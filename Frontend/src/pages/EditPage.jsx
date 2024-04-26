import { useParams } from 'react-router-dom';
import Editor from '../components/Editor';
import { useEffect } from 'react';

const EditPage = () => {
    const documentID = useParams().id;
    useEffect(() => {
        console.log(documentID)
    }, [documentID]);
    return (
        <div className="mt-16 text-left w-screen">
            <Editor documentID={documentID}/>
        </div>
    );
};

export default EditPage;