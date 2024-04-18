import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useAuthContext } from '../hooks/useAuthContext';
import { VITE_BACKEND_URL } from "../../config.js";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Document = (props) => {
  const { token } = useAuthContext();
  const navigate = useNavigate();

  const fetchCover = (e) => {
    axios.get(`http://www.colourlovers.com/api/colors?format=json`)
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const deleteDocument = (e) => {
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.delete(`${VITE_BACKEND_URL}/document/delete/${props.id}`)
    .then((res) => {
      console.log("Deleted")
      props.setIsOpen(prev => {
        console.log(prev-1);
        return prev-1;
      });
      toast.success("Document deleted successfully");
    })
    .catch((error) => {
      console.log(error);
      toast.error("Document deletion failed. Please try again");
    });
  }

  return (
    <>
      {props.view === "table" && (
        <div className="flex w-full justify-between p-5 bg-slate-100 hover:bg-slate-200 hover:shadow-l hover:cursor-pointer transition duration-500 ease-in-out" onClick={() => {navigate(`/view/${props.id}`)}}>
          <div className='flex gap-3'>
            <h3 className='text-lg'>{props.title}</h3>
            <FontAwesomeIcon className="self-center" icon={faPenToSquare} onClick={(e) => {
                props.setAction("Rename"); props.setIsOpen(props.id); e.stopPropagation(); }} />
            <FontAwesomeIcon className="self-center" icon={faTrashCan} onClick={(e) => {e.stopPropagation();deleteDocument();}} />
          </div>
          <p>Last Edited: {props.lastEdited}</p>
        </div>
      )}
      {props.view === "grid" && (
        <div className="flex flex-col rounded-lg overflow-hidden hover:bg-slate-100 hover:shadow-l hover:cursor-pointer transition duration-500 ease-in-out"
        onClick={() => {navigate(`/view/${props.id}`)}}>
          <img src="preview.jpg" className="max-h-48" alt="preview" />
          <div className="p-3">
            <div className='flex gap-3 justify-center'>
              <h3 className='text-lg'>{props.title}</h3>
              <FontAwesomeIcon className="self-center" icon={faPenToSquare} onClick={(e) => {
                props.setAction("Rename"); props.setIsOpen(props.id); e.stopPropagation(); }} />
              <FontAwesomeIcon className="self-center" icon={faTrashCan} onClick={(e) => {e.stopPropagation();deleteDocument();}} />
            </div>
            <p>Last Edited: {props.lastEdited}</p>
          </div>
        </div>
      )}
    </>
  );
}
 
export default Document;