import CodeMirror from '@uiw/react-codemirror';
import { whiteLight } from '@uiw/codemirror-theme-white';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { VITE_BACKEND_URL } from '../../config';

const Editor = (documentID) => {

  const getDocument = () => {
    axios.defaults.withCredentials = true;

    axios.get(`${VITE_BACKEND_URL}/document/${documentID}`)
    .then((res) => {
      if (res.status === 200) {
        console.log(res)
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

  return (
    <CodeMirror
      value=`${}`
      height="200px"
      theme={whiteLight}
      basicSetup={{
        lineNumbers: true,
        
      }}
    />
  );
}

export default Editor;