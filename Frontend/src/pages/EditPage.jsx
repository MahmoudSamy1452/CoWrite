import { useParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import Editor from '../components/Editor';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { VITE_NODE_URL } from '../../config';

const EditPage = () => {
    const [siteID, setSiteID] = useState(null);
    const [document, setDocument] = useState(null);
    const socketRef = useRef(null);
    const documentID = useParams().id;

    useEffect(() => {
        if(!socketRef.current){
            socketRef.current = io(VITE_NODE_URL);
            socketRef.current.on('connect', () => {
                socketRef.current.emit('join-document', documentID);
            });
            socketRef.current.on('document-joined', ({siteID, loadDocument}) => {
                setSiteID(siteID);
                setDocument(loadDocument);
            });
        }
        return () => {
            if(socketRef.current) 
            {
                socketRef.current.emit('leave-document', documentID);
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);



    return (
        <div className="mt-16 text-left w-screen">
            <Editor documentID={documentID} siteID={siteID} loadedDocument={document} socketRef = {socketRef}/>
        </div>
    );
};

export default EditPage;