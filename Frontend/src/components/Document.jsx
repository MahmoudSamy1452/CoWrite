import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faShare, faCodeCompare } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '../hooks/useAuthContext';
import { VITE_BACKEND_URL } from "../../config.js";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Document = (props) => {
  const { token } = useAuthContext();
  const navigate = useNavigate();

  const colors = {
    'v': 'hover:bg-[#fc9d03]',
    'e': 'hover:bg-green-900',
    'o': 'hover:bg-blue-900',
  }

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
      props.setIsOpen(prev => {
        return prev-1;
      });
      toast.success(res?.data?.message || "Document deleted successfully");
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message || "Document deletion failed. Please try again");
    });
  }

  const openModal = (action) => {
    props.setAction(action);
    props.setIsOpen(props.id);
  }

  const getRandomClass = () => {
    const classes = ['bg-[#fbbc05]', 'bg-[#ea4335]', 'bg-[#4285f4]', 'bg-[#34a853]'];
    const randomIndex = Math.floor(Math.random() * classes.length);
    return classes[randomIndex];
  }

  return (
    <>
      {props.view === "table" && (
        <div className="flex flex-wrap flex-row w-full justify-between p-5 bg-slate-100 hover:bg-slate-200 hover:shadow-l hover:cursor-pointer transition duration-500 ease-in-out" onClick={() => {props.setTitle(props.title)
          props.setUserRole(props.role)
          navigate(`/view/${props.id}`, { state: { role: props.role} })}}>
          <div className='flex gap-3 w-44'>
            <h3 className='text-lg overflow-hidden overflow-ellipsis whitespace-nowrap'>{props.title}</h3>
          </div>
          <p>{props.role === 'o' ? "Owner" : props.role === 'e' ? "Editor" : "Viewer"}</p>
          <div>
            <span className="self-center flex gap-2" onClick={(e) => e.stopPropagation()}>
                <FontAwesomeIcon className="self-center" icon={faPenToSquare} onClick={() => openModal("Rename")} />
                <FontAwesomeIcon className="self-center" icon={faTrashCan} onClick={deleteDocument} />
                <FontAwesomeIcon className="self-center" icon={faShare} onClick={() => openModal("Share")}/>
                <FontAwesomeIcon className="self-center" icon={faCodeCompare} onClick={() => {props.setTitle(props.title) 
                  navigate(`/history/${props.id}`, { state: { role: props.role } })}}/>
              </span>
          </div>
          <p className='w-64 text-left'>Last Edited: {props.lastEdited}</p>
        </div>
      )}
      {props.view === "grid" && (
        <div className="flex flex-col rounded-lg overflow-hidden hover:bg-slate-100 hover:shadow-l hover:cursor-pointer transition duration-500 ease-in-out md:w-60 max-w-64 border"
        onClick={() => {props.setTitle(props.title)
          props.setUserRole(props.role)
          navigate(`/view/${props.id}`, { state: { role: props.role} })}}>
          <div className={`${props.color} transition-colors relative group ${colors[props.role]} h-48`}>
            <div className="opacity-0 group-hover:opacity-100 duration-300 absolute inset-0 z-10 flex justify-center items-center text-6xl text-white font-semibold">{props.role.toUpperCase()}</div>
          </div>
          <div className="p-3 flex flex-col gap-2">
            <h3 className='text-lg overflow-hidden overflow-ellipsis whitespace-nowrap'>{props.title}</h3>
            <p>Last Edited: {props.lastEdited}</p>
            <div className='flex gap-3 justify-center'>
              <span className="self-center flex gap-2" onClick={(e) => e.stopPropagation()}>
                <FontAwesomeIcon className="self-center" icon={faPenToSquare} onClick={() => openModal("Rename")} />
                <FontAwesomeIcon className="self-center" icon={faTrashCan} onClick={deleteDocument} />
                <FontAwesomeIcon className="self-center" icon={faShare} onClick={() => openModal("Share")}/>
                <FontAwesomeIcon className="self-center" icon={faCodeCompare} onClick={() => {props.setTitle(props.title) 
                  navigate(`/history/${props.id}`, { state: { role: props.role } })}}/>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
 
export default Document;