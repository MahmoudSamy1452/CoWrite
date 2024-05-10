import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { VITE_BACKEND_URL } from "../../config";
import { useAuthContext } from "../hooks/useAuthContext";
import Version from "../components/Version";

const History = () => {
    const { token } = useAuthContext();
    const documentID = useParams().id;
    const [versionList, setVersionList] = useState([]);

    const location = useLocation();
    const role = location.state.role;

    const getDocumentHistory = (e) => {
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        axios.get(`${VITE_BACKEND_URL}/version/history/${documentID}`)
        .then((res) => {
        if (res.status === 200) {
            console.log(res.data)
            setVersionList(res.data);
        }
        })
        .catch((error) => {
        console.log(error);
        });
    }

    useEffect(() => {
        getDocumentHistory();
    }, []);

    return (
        <div className="flex flex-wrap gap-3 p-20 pt-0 mt-20">
          {versionList.map((document, index) => {
              return (
              <Version
                key={index}
                id={document.id}
                versionNumber={document.versionNumber}
                lastEdited={moment(document.createdAt).format("LLL")}
                documentId={document.documentId}
                role = {role}
              />
              );
          })}
        </div>
    )
}

export default History;