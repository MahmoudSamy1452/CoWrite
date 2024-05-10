import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Doc from '../CRDTs/Doc.js';
import QuillCursors from 'quill-cursors';
import { toast } from 'sonner';
import { VITE_NODE_URL } from '../../config';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { faker } from '@faker-js/faker';

Quill.register('modules/cursors', QuillCursors)

function Editor({ documentID, siteID, loadedDocument, socketRef, readOnly }) {
  const [value, setValue] = useState('');
  const [siteCounter, setSiteCounter] = useState(0);
  const [document, setDocument] = useState();
  const [cursors, setCursors] = useState([{}]);
  const quillRef = useRef(null);
  const { user } = useAuthContext();

  const getDocument = () => {
    axios.defaults.withCredentials = true;

    axios.get(`${VITE_NODE_URL}/document/${documentID}`)
    .then((res) => {
      if (res.status === 200) {
        setDocument(new Doc(res.data.content));
      }
    })
    .catch((error) => {
      console.log(error);
      toast.error("Error getting document");
    });
  }

  useEffect(() => {
    if (quillRef.current && socketRef.current && document) {
      socketRef.current.on('receive-changes', (crdt) => {
        console.log("receive", crdt);
        const newCRDT = JSON.parse(crdt);
        const char = document.doc.find((oldCRDT) => newCRDT.siteID == oldCRDT.siteID && newCRDT.siteCounter == oldCRDT.siteCounter);
        console.log(char)
        let delta = null;
        if (newCRDT.tombstone) {
          delta = document.handleRemoteDelete(newCRDT);
        } else if (!char) {
          console.log(newCRDT)
          delta = document.handleRemoteInsert(newCRDT);
        } else {
          delta = document.handleRemoteAttribute(newCRDT);
        }
        // document.pretty();
        console.log(delta);
        quillRef.current.getEditor().updateContents(delta, 'silent');
      });

      socketRef.current.on('receive-cursor', (cursor, range) => {
        console.log("received cursor", cursor.id, range);
        const editor = quillRef.current.getEditor();
        const cursorModule = editor.getModule('cursors');

        if (cursorModule._cursors[cursor.id]) {
          cursorModule.moveCursor(cursor.id, range);
        } else {
          cursorModule.createCursor(cursor.id, cursor.name, cursor.color);
          cursorModule.moveCursor(cursor.id, range);
        }
        console.log(cursorModule._cursors);
      })

      socketRef.current.on('user-left', (ID) => {
        console.log("removing cursor", ID);
        const editor = quillRef.current.getEditor();
        const cursorModule = editor.getModule('cursors');

        cursorModule.removeCursor(ID);
      })

      if (document) {
        console.log(document.doc)
        quillRef.current.getEditor().updateContents(document.getContent(), 'silent');
        setSiteCounter(document.extractLastSiteCounter(siteID));
      }
    }
  }, [document]);

  useEffect(() => {
    if(quillRef.current && socketRef.current){
      const editor = quillRef.current.getEditor();
      const cursorModule = editor.getModule('cursors');
      const cursor = cursorModule.createCursor(siteID, user, faker.helpers.arrayElement(['red', 'green', 'blue', 'purple', 'orange', 'cyon', 'magenta']));
      console.log("cursor", cursor);
      // setCursors((prev) => [...prev, { id: cursor.id }]);
      const range = {"index":0,"length":0}
      socketRef.current.emit('send-cursor', documentID, cursor, range);
    }
  }, [socketRef.current, quillRef.current]);

  useEffect(() => {
    if (loadedDocument) {
      console.log(loadedDocument);
      console.log(documentID);
      console.log(siteID)
      setDocument(new Doc(loadedDocument));
    }
  }, [loadedDocument]);

  useEffect(() => {
    if (quillRef.current && document){
      // quillRef.current.getEditor().updateContents(document.getContent(), 'silent');
      quillRef.current.getEditor().off('text-change');
      quillRef.current.getEditor().on('text-change', (delta) => {
        if (!delta.length) return;
        const opObject = delta.ops.find((op) => op.insert !== undefined || op.delete !== undefined);
        const op = opObject ? Object.keys(opObject)[0] : null;
        let crdt;
        switch (op) {
          case 'insert':
            setSiteCounter((prev) => {
              crdt = document.handleLocalInsert(delta.ops, siteID, prev);
              console.log('gowa el set site counter',crdt)
              socketRef.current.emit('send-changes', documentID, JSON.stringify(crdt));
              return prev + 1
            });
            break;
          case 'delete':
            crdt = document.handleLocalDelete(delta.ops);
            socketRef.current.emit('send-changes', documentID, JSON.stringify(crdt));
            break;
          default:
            crdt = document.handleLocalAttribute(delta.ops);
            socketRef.current.emit('send-changes', documentID, JSON.stringify(crdt));
            break;
        }
        document.pretty();

        const retainObject = delta.ops.find((op) => op.retain !== undefined && op.attributes === undefined && op.insert === undefined && op.delete === undefined);
        const editor = quillRef.current.getEditor();
        const cursorModule = editor.getModule('cursors');
        socketRef.current.emit('send-cursor', documentID, cursorModule._cursors[siteID], {index: retainObject?.retain + 1 || 0, length: 0});
      })

      quillRef.current.getEditor().off('selection-change');
      quillRef.current.getEditor().on('selection-change', (range) => {
        console.log(range);
        if (range) {
          const editor = quillRef.current.getEditor();
          const cursorModule = editor.getModule('cursors');
          cursorModule.moveCursor( siteID, range.index, range.length);
          socketRef.current?.emit('send-cursor', documentID, cursorModule._cursors[siteID], range);
        }
      })
    }
  }, [document, siteCounter]);

  const modules = {
    cursors: {
      transformOnTextChange: true,
    },
    toolbar: ['bold', 'italic']
  }

  const handleSave = () => {
    axios.defaults.withCredentials = true;

    if (readOnly) {
      toast.error("You do not have permission to save this document");
      return;
    }

    axios.put(`${VITE_NODE_URL}/save`, {
      docId: documentID
    })
    .then((res) => {
      if (res.status === 200) {
        toast.success("Document saved");
      }
    })
    .catch((error) => {
      console.log(error);
      toast.error("Error saving document");
    });
  }

  return(
    <>  
      <div className='flex items-end flex-col'>
        <button className='text-blue-500 bg-slate-100 m-3' onClick={handleSave}>Save</button>
      </div>
      <ReactQuill ref={quillRef} theme="snow" value={value} onChange={setValue} modules={modules} readOnly={readOnly} />
    </>
  )
}

export default Editor;