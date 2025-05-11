import { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

//utils
import map from "./utility/map"
import axios from "axios"

export const MonEditor = (props) => {
  const [monacoLoaded, setMonacoLoaded] = useState(false);

  const [code, setCode] = useState("");

  const [input, setInput] = useState("");

  useEffect(() => {
    // Load Monaco Editor asynchronously
    import('monaco-editor').then(() => setMonacoLoaded(true));
  }, []);

  const editorOptions = {
    selectOnLineNumbers: true,
    fontSize: 14,
    lineNumbers: 'on',
    minimap: {
      enabled: true,
      showSlider : 'always'
    },
    autoClosingBrackets: "always", // Auto close brackets for Java
    autoIndent: "full", // Automatically indent Java code
    wordWrap : "on"
    };

    // selecting language 
    const [selected, setSelected] = useState("");

    const handleChange = (e) =>{
        setSelected(e.target.value);
        setCode(map.get(e.target.value))
    }

    const executeCode = async ()=>{

      props.setOp("...loading");
      
      const body = {
        lang : selected,
        content : code,
        inputs : input
      }

      const res = await axios.post("http://localhost:3000/api/runCode", body, {withCredentials : true})

      props.setOp(res.data.run.output);
    }

  return (
    <div>
        <select id="language" value={selected} onChange = {handleChange}>
            <option value = "">--Select--</option>
            <option value = "java">Java</option>
        </select>

        <button onClick={executeCode}>Run</button>

      <MonacoEditor
        language={selected} // Set the language to Java
        theme="vs-dark"
        value={map.get(selected)}
        options={editorOptions}
        height="500px" // or specify a pixel value like '500px'
        onChange={(newCode) => setCode(newCode)}
      />

      <div>
        Input -
        <textarea onChange={(e)=>setInput(e.target.value)}></textarea>
      </div>
    </div>
  );
};

export default MonEditor;