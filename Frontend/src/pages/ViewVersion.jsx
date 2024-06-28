import { useParams, useLocation } from "react-router-dom";
import Viewer from "../components/Viewer";

const ViewVersion = ({setTitle}) => {
    const versionID = useParams().id;

    const location = useLocation();
    const documentID = location.state.documentId;
    const role = location.state.role;

    return (
        <div className="mt-16 text-left w-screen">
            <Viewer versionID={versionID} documentID={documentID} role={role} setTitle={setTitle}/>
        </div>
    );
};

export default ViewVersion;