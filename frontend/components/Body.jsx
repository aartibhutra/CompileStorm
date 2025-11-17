import { useState } from "react";
import Sidebar from "./Sidebar";
import MonEditor from "./MonEditor";
import axios from "axios";

export default function Body({ user, project, setProject }) {
  const [op, setOp] = useState("...");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  // Save whole folder structure
  const handleStructureUpdate = async (newStructure) => {
    const updated = { ...project, structure: newStructure };
    setProject(updated);

    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/project/${project._id}`,
      { structure: newStructure },
      { withCredentials: true }
    );
  };

  // Save file content inside structure
  const handleFileContentUpdate = async (filePath, newCode) => {

    function updateContent(items, prefix = "") {
      return items.map(item => {
        const full = prefix ? `${prefix}/${item.name}` : item.name;

        if (item.type === "file" && full === filePath) {
          return { ...item, content: newCode };
        }

        if (item.type === "folder") {
          return { ...item, children: updateContent(item.children, full) };
        }

        return item;
      });
    }

    const updatedStructure = updateContent(project.structure);
    await handleStructureUpdate(updatedStructure);
  };

  return (
    <div className="flex w-full h-screen p-4 gap-4 bg-zinc-900 text-white">

      <Sidebar
        project={project}
        onFileSelect={handleFileSelect}
        updateStructure={handleStructureUpdate}
      />

      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex-1 bg-zinc-800 rounded-lg shadow-inner p-2 overflow-hidden">
          <MonEditor
            setOp={setOp}
            user={user}
            selectedFile={selectedFile}
            project={project}
            updateFileContent={handleFileContentUpdate}
          />
        </div>
      </div>

      <div className="w-[30%] h-full bg-zinc-800 rounded-lg p-4 shadow-md flex flex-col">
        <h2 className="text-lg font-semibold text-indigo-400 mb-2">Output</h2>
        <div className="bg-black text-green-400 font-mono p-2 rounded h-full overflow-y-auto whitespace-pre-wrap">
          {op}
        </div>
      </div>
    </div>
  );
}
