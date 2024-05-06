import Document from "../components/Document";
import axios from "axios";
import moment from "moment";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import { VITE_BACKEND_URL } from "../../config.js";
import CustomModal from "../components/CustomModal";
import ShareModal from "../components/ShareModal";

const colors = {
  'v': 'bg-[#fbbc05]',
  'e': 'bg-[#34a853]',
  'o': 'bg-[#4285f4]',
}

const Documents = () => {
  const { token } = useAuthContext();
  const [documentList, setDocumentList] = useState([]);
  const [view, setView] = useState("grid");
  const [isOpen, setIsOpen] = useState(-1);
  const [action, setAction] = useState("");

  const fetchDocuments = (e) => {
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    axios.get(`${VITE_BACKEND_URL}/document/all`)
    .then((res) => {
      if (res.status === 200) {
        setDocumentList(res.data);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    console.log(isOpen)
    if(isOpen < 0)
      console.log("fetching documents")
      fetchDocuments();
  }, [isOpen]);

  return ( 
    <>
      <CustomModal isOpen={isOpen} setIsOpen={setIsOpen} action={action}></CustomModal>
      <ShareModal isOpen={isOpen} setIsOpen={setIsOpen} action={action}></ShareModal>
      <div className="h-full text-blue-500 mt-16">
        <div className="bg-slate-100 p-20 py-5 text-left">
          <h4 className="text-left mb-5">Start a new document</h4>
          <img className="cursor-pointer" src="docs-blank-googlecolors.png" width="180px" alt="new document" onClick={() => {setAction("Create"); setIsOpen(0)}}/>
        </div>
        <div className="flex justify-between p-5">
          <h4 className="text-left p-20 py-7">Recent documents</h4>
          {view === "table" &&
            <button onClick={() => setView("grid")} className="bg-slate-100 text-blue-500 m-5">Grid view</button>
          }
          {view === "grid" &&
            <button onClick={() => setView("table")} className="bg-slate-100 text-blue-500 m-5">Tabular view</button>
          }
        </div>
        <div className="flex flex-wrap gap-3 p-20 pt-0">
          {documentList.map((document, index) => {
              return (
              <Document
                key={index}
                id={document.id}
                title={document.name}
                lastEdited={moment(document.updatedAt).format("LLL")}
                view={view}
                setIsOpen={setIsOpen}
                setAction={setAction}
                color={colors[document.role]}
              />
              );
          })}
        </div>
      </div>
    </>
   );
}
 
export default Documents;