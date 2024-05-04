import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Doc from '../CRDTs/Doc.js';
import CRDT from '../CRDTs/CRDT.js';
import { toast } from 'sonner';
import { VITE_BACKEND_URL } from '../../config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Editor({ documentID, siteID }) {
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
    getDocument();
  }, []);

  useEffect(() => {
    if (quillRef.current && document){
      console.log(document.getContent())
      quillRef.current.getEditor().setContents(document.getContent());
      quillRef.current.getEditor().on('text-change', (delta, oldContents, source) => {
        console.log(delta)
        if (!delta.length) return;
        const op = Object.keys(delta.ops.find((op) => op.insert !== undefined || op.delete !== undefined))[0];
        console.log(op);
        console.log(document)
        switch (op) {
          case 'insert':
            document.handleLocalInsert(delta.ops, siteID, siteCounter);
            break;
          case 'delete':
            document.handleLocalDelete(delta.ops, siteID, siteCounter);
            break;
          default:
            break;
        }
        setSiteCounter((prev) => prev + 1);
        document.pretty();
      })
    }
  }, [document]);

  const modules = {
    toolbar: ['bold', 'italic'],
  }

  return <ReactQuill ref={quillRef} theme="snow" value={value} onChange={setValue} modules={modules} />;
}

export default Editor;