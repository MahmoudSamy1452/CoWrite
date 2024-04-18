import { useState, useRef } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";

const TextArea = () => {
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty()
  );

  // const editor = useRef(null);

  // function focusEditor() {
  //   editor.current.focus();
  // }

  // React.useEffect(() => {
  //   focusEditor();
  // }, []);

  console.log(convertToRaw(editorState.getCurrentContent()))

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-16 text-black">
      {/* <div
        // onClick={focusEditor}
        className="m-auto w-[40rem] h-96 text-black bg-[#f9f8fa] border-2 border-gray-300 rounded-md shadow-md p-2"
      > */}
        <Editor
          // ref={editor}
          editorState={editorState}
          onEditorStateChange={(editorState) => setEditorState(editorState)}
          textAlignment="left"
          toolbar={{
            options: ['inline'],
            inline: { options: ['bold', 'italic'] },
            className: "overflow-y-auto",
          }}
          toolbarClassName="flex sticky top-11 z-50 w-[98.5vw] mx-auto !border-0 !border-b-2 !border-[#ccc] shadow-md"
          editorClassName="m-20 bg-white p-5 shadow-lg min-h-[1300px] min-w-[700px] md:min-w-[700] max-w-5xl mx-auto border-2 rounded-sm border-gray-300"
        />
      {/* </div> */}
    </div>
  );
};

// var INLINE_STYLES = [
//   { label: "Bold", style: "BOLD" },
//   { label: "Italic", style: "ITALIC" },
// ];


// const InlineStyleControls = (props) => {
//   const currentStyle = props.editorState.getCurrentInlineStyle();
  
//   return (
//     <div className="RichEditor-controls">
//       {INLINE_STYLES.map((type) =>
//         <StyleButton
//           key={type.label}
//           active={currentStyle.has(type.style)}
//           label={type.label}
//           onToggle={props.onToggle}
//           style={type.style}
//         />
//       )}
//     </div>
//   );
// };

export default TextArea;
