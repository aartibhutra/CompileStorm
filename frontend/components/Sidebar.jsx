import { useState, useEffect } from "react";
import JavaOriginal from "devicons-react/icons/JavaOriginal";
import JavascriptOriginal from "devicons-react/icons/JavascriptOriginal";
import COriginal from "devicons-react/icons/COriginal";
import CplusplusOriginal from "devicons-react/icons/CplusplusOriginal";
import PythonOriginal from "devicons-react/icons/PythonOriginal";
import Modal from "./Modal"; // <-- Your new modal

export default function Sidebar({ project, onFileSelect, updateStructure }) {
  const [directories, setDirectories] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [topDropdown, setTopDropdown] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    mode: null,
    keyPath: null,
    item: null,
  });

  useEffect(() => {
    if (project?.structure) {
      setDirectories(project.structure);
    }
  }, [project]);

  const saveDirectories = (newDirs) => {
    setDirectories(newDirs);
    updateStructure(newDirs);
  };

  // ===================== HELPERS =====================
  const addAtPath = (dirs, path, newItem) => {
    if (path.length === 0) {
      dirs.push(newItem);
      return dirs;
    }
    const [cur, ...rest] = path;
    dirs[cur].children = addAtPath(dirs[cur].children, rest, newItem);
    return dirs;
  };

  const getAtPath = (dirs, path) => {
    if (path.length === 1) return dirs[path[0]];
    const [cur, ...rest] = path;
    return getAtPath(dirs[cur].children, rest);
  };

  const deleteAtPath = (dirs, path) => {
    if (path.length === 1) {
      dirs.splice(path[0], 1);
      return dirs;
    }
    const [cur, ...rest] = path;
    dirs[cur].children = deleteAtPath(dirs[cur].children, rest);
    return dirs;
  };

  // ===================== MODAL TRIGGERS =====================
  const addFolderWindow = (keyPath) => {
    setModal({
      open: true,
      mode: "addFolder",
      keyPath,
      item: null,
    });
  };

  const addFileWindow = (keyPath) => {
    setModal({
      open: true,
      mode: "addFile",
      keyPath,
      item: null,
    });
  };

  const renameWindow = (item, keyPath) => {
    setModal({
      open: true,
      mode: "rename",
      keyPath,
      item,
    });
  };

  // ===================== MODAL SUBMIT LOGIC =====================
  const handleModalSubmit = (value) => {
    if (!value) {
      setModal({ open: false });
      return;
    }

    const { mode, keyPath, item } = modal;
    const newDirs = JSON.parse(JSON.stringify(directories));

    if (mode === "addFolder") {
      const newFolder = { name: value, type: "folder", children: [] };
      if (!keyPath) newDirs.push(newFolder);
      else addAtPath(newDirs, keyPath, newFolder);

      saveDirectories(newDirs);
    }

    if (mode === "addFile") {
      if (!value.includes(".")) {
        alert("Filename must include extension");
        return;
      }
      const newFile = { name: value, type: "file", content: "" };
      if (!keyPath) newDirs.push(newFile);
      else addAtPath(newDirs, keyPath, newFile);

      saveDirectories(newDirs);
    }

    if (mode === "rename") {
      const target = getAtPath(newDirs, keyPath);
      target.name = value;
      saveDirectories(newDirs);
    }

    setModal({ open: false });
  };

  // ===================== DELETE ITEM =====================
  const deleteItem = (item, keyPath) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;

    const newDirs = JSON.parse(JSON.stringify(directories));
    saveDirectories(deleteAtPath(newDirs, keyPath));

    if (item.type === "file") onFileSelect(null);
  };

  // ===================== SELECT FILE =====================
  const selectFile = (item, namePath) => {
    const fullPath = namePath.join("/");
    onFileSelect({ ...item, fullPath });
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  // ===================== RENDER TREE =====================
  const renderTree = (items, namePath = [], keyPath = []) =>
    items.map((item, index) => {
      const newKeyPath = [...keyPath, index];
      const newNamePath = [...namePath, item.name];
      const id = newKeyPath.join("-");

      return (
        <div key={id} className="ml-4">
          <div className="flex items-center relative">

            {/* --------- FOLDER --------- */}
            {item.type === "folder" ? (
              <>
                <span className="text-yellow-400">📁</span>
                <span className="ml-2 text-white">{item.name}</span>

                <button
                  onClick={() => toggleDropdown(id)}
                  className="ml-auto text-white text-xs px-1 hover:bg-zinc-700 rounded"
                >
                  ⋮
                </button>

                {openDropdown === id && (
                  <div className="absolute right-0 mt-1 w-32 bg-zinc-700 border border-zinc-600 rounded shadow-lg z-10">
                    <button
                      onClick={() => {
                        addFolderWindow(newKeyPath);
                        setOpenDropdown(null);
                      }}
                      className="px-3 py-1 text-xs hover:bg-zinc-600 text-white w-full text-left"
                    >
                      Add Folder
                    </button>

                    <button
                      onClick={() => {
                        addFileWindow(newKeyPath);
                        setOpenDropdown(null);
                      }}
                      className="px-3 py-1 text-xs hover:bg-zinc-600 text-white w-full text-left"
                    >
                      Add File
                    </button>

                    <button
                      onClick={() => {
                        renameWindow(item, newKeyPath);
                        setOpenDropdown(null);
                      }}
                      className="px-3 py-1 text-xs text-indigo-300 hover:bg-zinc-600 w-full text-left"
                    >
                      Rename
                    </button>

                    <button
                      onClick={() => {
                        deleteItem(item, newKeyPath);
                        setOpenDropdown(null);
                      }}
                      className="px-3 py-1 text-xs text-red-400 hover:bg-zinc-600 w-full text-left"
                    >
                      Delete
                    </button>
                    
                    <button
                      onClick={() => {
                        setOpenDropdown(null);
                      }}
                      className="px-3 py-1 text-xs text-red-400 hover:bg-zinc-600 w-full text-left"
                    >
                      Close
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* --------- FILE --------- */}
                <span className="text-blue-400 flex items-center">

                  {item.name.endsWith(".java") && <JavaOriginal size={18} />}
                  {item.name.endsWith(".js") && <JavascriptOriginal size={18} />}
                  {item.name.endsWith(".c") && <COriginal size={18} />}
                  {item.name.endsWith(".cpp") && <CplusplusOriginal size={18} />}
                  {item.name.endsWith(".py") && <PythonOriginal size={18} />}

                  {!(
                    item.name.endsWith(".java") ||
                    item.name.endsWith(".js") ||
                    item.name.endsWith(".c") ||
                    item.name.endsWith(".cpp") ||
                    item.name.endsWith(".py")
                  ) && <span className="text-gray-300">📄</span>}
                </span>

                <span
                  className="ml-2 text-white cursor-pointer"
                  onClick={() => selectFile(item, newNamePath)}
                >
                  {item.name}
                </span>

                <button
                  onClick={() => toggleDropdown(id)}
                  className="ml-auto text-white text-xs px-1 hover:bg-zinc-700 rounded"
                >
                  ⋮
                </button>

                {openDropdown === id && (
                  <div className="absolute right-0 mt-1 w-32 bg-zinc-700 border border-zinc-600 rounded shadow-lg z-10">
                    <button
                      onClick={() => {
                        renameWindow(item, newKeyPath);
                        setOpenDropdown(null);
                      }}
                      className="px-3 py-1 text-xs text-indigo-300 hover:bg-zinc-600 w-full text-left"
                    >
                      Rename
                    </button>

                    <button
                      onClick={() => {
                        deleteItem(item, newKeyPath);
                        setOpenDropdown(null);
                      }}
                      className="px-3 py-1 text-xs text-red-400 hover:bg-zinc-600 w-full text-left"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => {
                        setOpenDropdown(null);
                      }}
                      className="px-3 py-1 text-xs text-red-400 hover:bg-zinc-600 w-full text-left"
                    >
                      Close
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {item.children && renderTree(item.children, newNamePath, newKeyPath)}
        </div>
      );
    });

  return (
    <div className="w-64 bg-zinc-800 p-4 overflow-y-auto">

      {/* Add Button */}
      <div className="mb-4 relative">
        <button
          onClick={() => setTopDropdown(!topDropdown)}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm"
        >
          Add
        </button>

        {topDropdown && (
          <div className="absolute left-0 mt-1 w-32 bg-zinc-700 border border-zinc-600 rounded shadow-lg z-10">
            <button
              onClick={() => {
                addFolderWindow(null);
                setTopDropdown(false);
              }}
              className="px-3 py-1 text-xs hover:bg-zinc-600 text-white w-full text-left"
            >
              Add Folder
            </button>

            <button
              onClick={() => {
                addFileWindow(null);
                setTopDropdown(false);
              }}
              className="px-3 py-1 text-xs hover:bg-zinc-600 text-white w-full text-left"
            >
              Add File
            </button>

            <button
              onClick={() => {
                setTopDropdown(null);
              }}
              className="px-3 py-1 text-xs text-red-400 hover:bg-zinc-600 w-full text-left"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {renderTree(directories)}

      {/* Modal */}
      <Modal
        open={modal.open}
        title={
          modal.mode === "addFolder"
            ? "Add Folder"
            : modal.mode === "addFile"
            ? "Add File"
            : "Rename"
        }
        placeholder={
          modal.mode === "addFolder"
            ? "Folder name"
            : modal.mode === "addFile"
            ? "Filename with extension"
            : modal.item?.name
        }
        onClose={() => setModal({ open: false })}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
