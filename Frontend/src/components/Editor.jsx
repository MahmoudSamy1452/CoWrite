import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Doc from '../CRDTs/Doc.js';
import { toast } from 'sonner';
import { VITE_BACKEND_URL } from '../../config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Editor({ documentID }) {
  const [value, setValue] = useState('');
  const [document, setDocument] = useState();
  const quillRef = useRef(null);

  const getDocument = () => {
    axios.defaults.withCredentials = true;

    axios.get(`${VITE_BACKEND_URL}/document/${documentID}`)
    .then((res) => {
      if (res.status === 200) {
        console.log(res)
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
      quillRef.current.getEditor().setContents(document.getContent());
    }
  }, [document]);

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.on('text-change', (delta, oldContents, source) => {
        console.log("Content changed:", delta, oldContents, source);
      });
    }
  }, [quillRef]);

  const modules = {
    toolbar: ['bold', 'italic'],
  }

  return <ReactQuill ref={quillRef} theme="snow" value={value} onChange={setValue} modules={modules} />;
}

export default Editor;