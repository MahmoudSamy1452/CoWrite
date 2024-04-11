import React from "react";
import ReactDOM from "react-dom";
import { Editor, EditorState } from "draft-js";

const TextArea = () => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );

  const editor = React.useRef(null);

  function focusEditor() {
    editor.current.focus();
  }

  React.useEffect(() => {
    focusEditor();
  }, []);

  return (
    <div
      onClick={focusEditor}
      className="m-auto h-[500px] w-[500px] text-black bg-blue-500"
    >
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={(editorState) => setEditorState(editorState)}
        textAlignment="left"
      />
    </div>
  );
};

var INLINE_STYLES = [
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
];


const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map((type) =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

export default TextArea;
