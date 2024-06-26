import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { VITE_BACKEND_URL } from "../../config";
import { useAuthContext } from "../hooks/useAuthContext";
import Version from "../components/Version";

const History = ({ setTitle }) => {
  const { token } = useAuthContext();
  const documentID = useParams().id;
  const [versionList, setVersionList] = useState([]);

  const location = useLocation();
  const role = location.state.role;

  const navigate = useNavigate();

  const getDocumentHistory = (e) => {
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios
      .get(`${VITE_BACKEND_URL}/version/history/${documentID}`)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          setVersionList(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDocumentHistory();
  }, []);

  return (
    <>
      <div className="text-left mt-16">
        <button
          className="mt-3 ml-16 text-blue-500 bg-slate-100"
          onClick={() => {setTitle("CoWrite"); navigate("/home")}}
        >
          Back
        </button>
      </div>
      <div className="flex flex-wrap gap-3 p-20 pt-0 mt-5">
        {versionList.map((document, index) => {
          return (
            <Version
              key={index}
              id={document.id}
              versionNumber={document.versionNumber}
              lastEdited={moment(document.createdAt).format("LLL")}
              documentId={document.documentId}
              role={role}
              setTitle={setTitle}
            />
          );
        })}
      </div>
    </>
  );
};

export default History;
