import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'sonner';
import { VITE_BACKEND_URL, VITE_NODE_URL } from '../../config';
import Doc from '../CRDTs/Doc';

const Viewer = ({ versionID, documentID, role, setTitle }) => {
    const quillRef = useRef(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        axios.defaults.withCredentials = true;

        axios.get(`${VITE_BACKEND_URL}/version/${versionID}`)
        .then((res) => {
            toast.success('Version loaded');
            const document = new Doc(res.data.content);
            quillRef.current.getEditor().setContents(document.getContent());
        })
        .catch((err) => {
            console.log(err);
            toast.error('Error loading version');
        });
    }, [versionID, quillRef]);
    
    const handleRollBack = () => {
        axios.defaults.withCredentials = true;

        if (role === 'v') {
            toast.error('You do not have permission to roll back this document');
            return;
        }

        axios.put(`${VITE_NODE_URL}/rollback`, {
            docId: documentID,
            versionId: versionID
        })
        .then((res) => {
            toast.success('Document rolled back successfully');
        })
        .catch((err) => {
            console.log(err);
            toast.error(err.response.data.message);
        });
    }
    
    const modules = {
        toolbar: false
    }


return(
    <>  
      <div className='flex justify-between'>
        <button className='text-blue-500 bg-slate-100 m-3 mx-16' onClick={() => {setTitle(prev => prev.substring(0, prev.indexOf(' '))); navigate(`/history/${documentID}`, { state: { role: role } })}} >Back</button>
        <button className='text-blue-500 bg-slate-100 m-3 mx-16' onClick={handleRollBack}>Roll back</button>
      </div>
      <ReactQuill ref={quillRef} theme="snow" modules={modules} readOnly={true} />
    </>
  )
}

export default Viewer;