import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Doc from '../CRDTs/Doc.js';
import CRDT from '../CRDTs/CRDT.js';
import { toast } from 'sonner';
import { VITE_BACKEND_URL, VITE_NODE_URL } from '../../config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Editor({ documentID, siteID, socketRef }) {
  const [value, setValue] = useState('');
  const [siteCounter, setSiteCounter] = useState(0);
  const [document, setDocument] = useState();
  const quillRef = useRef(null);

  const getDocument = () => {
    axios.defaults.withCredentials = true;

    axios.get(`${VITE_BACKEND_URL}/document/${documentID}`)
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
        if (newCRDT.tombstone) {
          document.handleRemoteDelete(newCRDT);
        } else if (!char) {
          console.log(newCRDT)
          document.handleRemoteInsert(newCRDT);
        } else {
          document.handleRemoteAttribute(newCRDT);
        }
        // document.pretty();
        quillRef.current.getEditor().setContents(document.getContent(), 'silent');
      });
      quillRef.current.getEditor().setContents(document.getContent(), 'silent');
      setSiteCounter(document.extractLastSiteCounter(siteID));
    }
  }, [document]);

  useEffect(() => {
    getDocument();
  }, []);

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
            crdt = document.handleLocalInsert(delta.ops, siteID, siteCounter);
            setSiteCounter((prev) => prev + 1);
            break;
          case 'delete':
            crdt = document.handleLocalDelete(delta.ops);
            break;
          default:
            crdt = document.handleLocalAttribute(delta.ops);
            break;
        }
        document.pretty();
        socketRef.current.emit('send-changes', documentID, JSON.stringify(crdt));
      })
    }
  }, [document, siteCounter]);

  const modules = {
    toolbar: ['bold', 'italic'],
  }

  const handleSave = () => {
    axios.defaults.withCredentials = true;

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
      <ReactQuill ref={quillRef} theme="snow" value={value} onChange={setValue} modules={modules} />
    </>
  )
}

export default Editor;