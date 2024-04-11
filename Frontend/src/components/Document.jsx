
const Document = (props) => {
  return (
  <div className="flex flex-col rounded-lg overflow-hidden hover:bg-slate-100 hover:shadow-l hover:cursor-pointer transition duration-500 ease-in-out">
      <img src="preview.jpg" className="max-h-48" alt="preview"/>
      <div className="p-3">
        <h5>{props.title}</h5>
        <p>Last Edited: {props.lastEdited}</p>
      </div>
  </div>
  );
}
 
export default Document;