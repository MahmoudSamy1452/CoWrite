import { useNavigate } from "react-router-dom";

const Version = (props) => {
    const navigate = useNavigate();

    return (
        <div className="flex w-full justify-between p-5 bg-slate-100 hover:bg-slate-200 hover:shadow-l hover:cursor-pointer transition duration-500 ease-in-out" onClick={() => {navigate(`/version/${props.id}`, { state: { documentId : props.documentId, role: props.role }})}}>
          <div className='flex gap-3'>
            <h3 className='text-lg'>Version No.{props.versionNumber}</h3>
          </div>
          <p className='w-64 text-left'>Created On: {props.lastEdited}</p>
        </div>
    );
}

export default Version;