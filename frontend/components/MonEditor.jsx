import { useEffect, useState } from 'react';
import MonacoEditor from  '@monaco-editor/react';
import axios from "axios";
import { notifyInfo } from './utility/toast';
import { useNavigate } from 'react-router-dom';

export const MonEditor = (props) => {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [filePath, setFilePath] = useState("");

  const projectLanguage = props.project?.language || "";
  const projectName = props.project?.name || "";

  const [run, setRun] = useState(false);
  const [controller, setController] = useState(null);

  const mapLangToMonaco = (lang) => {
    switch (lang) {
      case "js": return "javascript";
      case "python": return "python";
      case "c": return "c"
      case "cpp": return "cpp"
      case "java":
        return "java"; 
      default:
        return "plaintext";
    }
  };

  function flattenStructure(items, prefix = "") {
    let result = {};

    items.forEach(item => {
      const full = prefix ? `${prefix}/${item.name}` : item.name;

      if (item.type === "file") {
        result[full] = item.content || "";
      }

      if (item.type === "folder") {
        Object.assign(result, flattenStructure(item.children, full));
      }
    });

    return result;
  }

  useEffect(() => {
    if (props.selectedFile) {
      setCode(props.selectedFile.content || "");
      setFilePath(props.selectedFile.fullPath);
    } else {
      setCode("");
      setFilePath("");
    }
  }, [props.selectedFile]);

  const editorOptions = {
    selectOnLineNumbers: true,
    fontSize: 14,
    lineNumbers: 'on',
    minimap: { enabled: true },
    wordWrap: "on",
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (filePath) {
      props.updateFileContent(filePath, newCode);
    }
  };

  const executeCode = async () => {
    if (!props.user) {
      notifyInfo("Please login to execute code");
      navigate("/signIn");
      return;
    }

    if (!filePath) {
      notifyInfo("Select a file to run");
      return;
    }

    const abortController = new AbortController();
    setController(abortController);

    setRun(true);
    props.setOp("...loading");

    const flatFiles = flattenStructure(props.project.structure);

    const body = {
      language: projectLanguage,
      entryFile: filePath,
      input: input,
      files: flatFiles
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/runCode`,
        body,
        {
          withCredentials: true,
          signal: abortController.signal
        }
      );

      console.log(res.data)

      props.setOp(res.data?.stdout || res.data.stderr || "No Output");

    } catch (err) {
      props.setOp("Error executing code.");
    }

    setRun(false);
    setController(null);
  };

  const stopExecution = () => {
    if (controller) {
      controller.abort();
      props.setOp("Stopped manually.");
      setRun(false);
      setController(null);
    }
  };

  return (
    <div className="w-full h-screen px-4 py-4 overflow-auto">
      <div className="w-full flex flex-col gap-4">

        <div className="w-full flex justify-between items-center">
          
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-indigo-400">{projectName}</span>
            <span className="text-sm text-zinc-400">
              Language: {projectLanguage}
            </span>

            {filePath && (
              <span className="text-sm text-white mt-1">Editing: {filePath}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!run ? (
              <button 
                onClick={executeCode} 
                className="px-3 py-1 bg-indigo-600 text-white rounded-md">
                Run
              </button>
            ) : (
              <>
                <button 
                  disabled 
                  className="px-3 py-1 border border-indigo-500 text-white rounded-md">
                  Running...
                </button>

                <button 
                  onClick={stopExecution} 
                  className="px-3 py-1 bg-red-600 text-white rounded-md">
                  Stop
                </button>
              </>
            )}
          </div>
        </div>

        {!props.selectedFile ? (
          <div className="w-full h-[60vh] flex items-center justify-center text-zinc-500 border border-zinc-700 rounded-lg">
            Select a file to start editing...
          </div>
        ) : (
          <div className="rounded-lg border border-zinc-700 h-[60vh] overflow-hidden">
            <MonacoEditor
              key={filePath}
              language={mapLangToMonaco(projectLanguage)}
              // language='python'
              theme="vs-dark"
              value={code}
              options={editorOptions}
              height="100%"
              width="100%"
              onChange={handleCodeChange}
            />
          </div>
        )}

        <div className="mt-4 rounded-lg border border-zinc-700 p-2">
          <label className="text-sm text-indigo-400 mb-1 block">Input</label>
          <textarea
            rows={3}
            className="w-full bg-zinc-900 text-white p-2 outline-none"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Optional input for your program..."
          />
        </div>
      </div>
    </div>
  );
};

export default MonEditor;
