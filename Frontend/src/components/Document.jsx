import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';

const Document = (props) => {

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

  return (
    <>
      {props.view === "table" && (
        <div className="flex w-full justify-between p-5 bg-slate-100 hover:bg-slate-200 hover:shadow-l hover:cursor-pointer transition duration-500 ease-in-out">
          <div className='flex gap-3'>
            <h3 className='text-lg'>{props.title}</h3>
            <FontAwesomeIcon className="self-center" icon={faPenToSquare} onClick={() => {
                props.setAction("Rename"); props.setIsOpen(props.id)}} />
          </div>
          <p>Last Edited: {props.lastEdited}</p>
        </div>
      )}
      {props.view === "grid" && (
        <div className="flex flex-col rounded-lg overflow-hidden hover:bg-slate-100 hover:shadow-l hover:cursor-pointer transition duration-500 ease-in-out">
          <img src="preview.jpg" className="max-h-48" alt="preview" />
          <div className="p-3">
            <div className='flex gap-3 justify-center'>
              <h3 className='text-lg'>{props.title}</h3>
              <FontAwesomeIcon className="self-center" icon={faPenToSquare} onClick={() => {
                props.setAction("Rename"); props.setIsOpen(props.id)}} />
            </div>
            <p>Last Edited: {props.lastEdited}</p>
          </div>
        </div>
      )}
    </>
  );
}
 
export default Document;