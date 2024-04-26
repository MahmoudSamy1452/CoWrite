import { useRef, useEffect, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import axios from 'axios';
import { toast } from 'sonner';
import { VITE_BACKEND_URL } from '../../config';

const Editor = ({ documentID }) => {
  const editor = useRef();
  const [doc, setDoc] = useState();

  const getDocument = () => {
    axios.defaults.withCredentials = true;

    axios.get(`${VITE_BACKEND_URL}/document/${documentID}`)
    .then((res) => {
      if (res.status === 200) {
        console.log(res)
        setDoc(res.data.content);
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
    const startState = EditorState.create({
        doc: doc,
        extensions: [keymap.of(defaultKeymap)],
    });
    const view = new EditorView({
        state: startState,
        parent: editor.current
    });
    return () => {
        view.destroy();
    };
}, [doc]);
  return <div ref={editor}></div>;
}
 
export default Editor;