import Document from "../components/document";
import { Link } from "react-router-dom";

const documentList = [
  {
    documentId: 1,
    title: "APT Project",
    lastEdited: "1:00PM",
  },
  {
    documentId: 2,
    title: "CoWrite Project",
    lastEdited: "2:00PM",
  },
  {
    documentId: 3,
    title: "CoWrite Project",
    lastEdited: "2:00PM",
  },
  {
    documentId: 4,
    title: "CoWrite Project",
    lastEdited: "2:00PM",
  },
  {
    documentId: 5,
    title: "CoWrite Project",
    lastEdited: "2:00PM",
  },
  {
    documentId: 6,
    title: "CoWrite Project",
    lastEdited: "10:00PM",
  }
]

const Documents = () => {
  return ( 
    <div className="h-full text-blue-500">
      <div className="bg-slate-100 p-20 py-5 text-left">
        <h4 className="text-left mb-5">Start a new document</h4>
        <Link className="inline-block" to="/edit" >
          <img src="docs-blank-googlecolors.png" width="180px" alt="new document" />
        </Link>
      </div>
      <h4 className="text-left p-20 py-7">Recent documents</h4>
      <div className="flex flex-wrap gap-3 p-20 pt-0">
        {documentList.map((document, index) => {
          return <Document key={index} title={document.title} lastEdited={document.lastEdited} />
        })}
      </div>
    </div>
   );
}
 
export default Documents;