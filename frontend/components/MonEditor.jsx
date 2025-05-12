import { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

//utils
import map from "./utility/map"
import axios from "axios"
import { notifyInfo } from './utility/toast';

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

        if(e.target.value != "")
          notifyInfo(`Language changed to ${e.target.value}`);
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
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <select
            id="language"
            value={selected}
            onChange={handleChange}
            className="bg-zinc-800 text-white border border-zinc-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value = "">--Select--</option>
            <option value = "java">Java</option>
            <option value = "c">C</option>
            <option value = "c++">C++</option>
            <option value = "python">Python</option>
          </select>

          <button onClick={executeCode} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition">
            Run
          </button>
        </div>

      <div className="rounded-lg overflow-hidden border border-zinc-700 shadow-inner">
        <MonacoEditor
          language={selected}
          theme="vs-dark"
          value={map.get(selected)}
          options={editorOptions}
          height="500px"
          width={"100%"}
          onChange={(newCode) => setCode(newCode)}
        />
      </div>

      {/* Input box */}
      <div className="mt-4 rounded-lg overflow-hidden border border-zinc-700 shadow-inner">
        <label className="block text-sm font-medium text-indigo-400 mb-1">Input</label>
        <textarea
          rows={3}
          className="w-full bg-zinc-900 text-white p-2 focus:outline-none focus:ring-indigo-500 resize-none border-0"
          onChange={(e) => setInput(e.target.value)}
          placeholder="Optional input for your program..."
        />
      </div>
    </div>
    </div>
  );
}

export default MonEditor;