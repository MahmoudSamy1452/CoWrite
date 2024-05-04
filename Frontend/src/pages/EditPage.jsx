import { useParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import Editor from '../components/Editor';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

// io('http://localhost:3000');

const EditPage = () => {
    const [siteID, setSiteID] = useState(null);
    const socketRef = useRef(null);
    const documentID = useParams().id;

    useEffect(() => {
        if(!socketRef.current){
            socketRef.current = io('http://localhost:3000');
            socketRef.current.on('connect', () => {
                socketRef.current.emit('join-document', documentID);
            });
            socketRef.current.on('disconnect', () => {
                socketRef.current = null;
            });
            socketRef.current.on('document-joined', (siteID) => {
                setSiteID(siteID);
            });
        }
        return () => {
            if(socketRef.current)
                socketRef.current.disconnect();
        };
    }, []);



    return (
        <div className="mt-16 text-left w-screen">
            <Editor documentID={documentID} siteID={siteID} />
        </div>
    );
};

export default EditPage;