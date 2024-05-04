import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Doc from '../CRDTs/Doc.js';
import CRDT from '../CRDTs/CRDT.js';
import { toast } from 'sonner';
import { VITE_BACKEND_URL } from '../../config';
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
        if (!newCRDT.tombstone) {
          document.handleRemoteInsert(newCRDT);
        } else {
          document.handleRemoteDelete(newCRDT);
        }
          document.pretty();
        quillRef.current.getEditor().setContents(document.getContent(), 'silent');
      });
    }
  }, [document]);

  useEffect(() => {
    getDocument();
  }, []);

  useEffect(() => {
    if (quillRef.current && document){
      console.log("adfassd")
      // quillRef.current.getEditor().updateContents(document.getContent(), 'silent');
      quillRef.current.getEditor().off('text-change');
      quillRef.current.getEditor().on('text-change', (delta) => {
        console.log(delta)
        if (!delta.length) return;
        const op = Object.keys(delta.ops.find((op) => op.insert !== undefined || op.delete !== undefined))[0];
        console.log(op);
        console.log(document)
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

  return <ReactQuill ref={quillRef} theme="snow" value={value} onChange={setValue} modules={modules} />;
}

export default Editor;