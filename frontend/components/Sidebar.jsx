import { useState, useEffect } from 'react';

export default function Sidebar({ onFileSelect }) {
  const [directories, setDirectories] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [topDropdown, setTopDropdown] = useState(false);

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'java': return '☕';
      case 'py': return '🐍';
      case 'js': return '📜';
      case 'c': return '🔧';
      case 'cpp': return '🔨';
      default: return '📄';
    }
  };

  const getLanguage = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'java': return 'java';
      case 'py': return 'python';
      case 'js': return 'javascript';
      case 'c': return 'c';
      case 'cpp': return 'cpp';
      default: return 'other';
    }
  };

  useEffect(() => {
    // Load directories from localStorage or initialize with default
    const savedDirs = localStorage.getItem('directories');
    if (savedDirs) {
      setDirectories(JSON.parse(savedDirs));
    } else {
      setDirectories([{ name: 'root', type: 'folder', children: [] }]);
    }
  }, []);

  const saveDirectories = (newDirs) => {
    setDirectories(newDirs);
    localStorage.setItem('directories', JSON.stringify(newDirs));
  };

  const addAtPath = (dirs, path, newItem) => {
    if (path.length === 1) {
      dirs[path[0]].children.push(newItem);
      return dirs;
    }
    const [currentIndex, ...remainingPath] = path;
    dirs[currentIndex].children = addAtPath(dirs[currentIndex].children, remainingPath, newItem);
    return dirs;
  };

  const getAtPath = (dirs, path) => {
    if (path.length === 0) return null;
    if (path.length === 1) return dirs[path[0]];
    const [currentIndex, ...remainingPath] = path;
    return getAtPath(dirs[currentIndex].children, remainingPath);
  };

  const addDirectory = (path = null) => {
    const name = prompt('Enter directory name:');
    if (name) {
      const newDir = { name, type: 'folder', children: [] };
      const newDirs = [...directories];
      if (path === null) {
        newDirs.push(newDir);
      } else {
        const updatedDirs = addAtPath(newDirs, path, newDir);
        saveDirectories(updatedDirs);
        return;
      }
      saveDirectories(newDirs);
    }
  };

  const addFile = (path) => {
    const name = prompt('Enter file name (with extension):');
    if (name) {
      if (!name.includes('.')) {
        alert('Please include a file extension (e.g., .java, .py, .js, .c, .cpp)');
        return;
      }
      const ext = name.split('.').pop().toLowerCase();
      if (!['java', 'py', 'js', 'c', 'cpp'].includes(ext)) {
        alert('Unsupported file extension. Supported: .java, .py, .js, .c, .cpp');
        return;
      }
      const newFile = { name, type: 'file', content: '' };
      const newDirs = [...directories];
      const newLanguage = getLanguage(name);
      if (path === null) {
        // Check top-level language consistency
        const existingFiles = newDirs.filter(item => item.type === 'file');
        if (existingFiles.length > 0) {
          const existingLanguage = getLanguage(existingFiles[0].name);
          if (existingLanguage !== newLanguage) {
            alert(`Cannot add file. This location only allows ${existingLanguage} files.`);
            return;
          }
        }
        newDirs.push(newFile);
        saveDirectories(newDirs);
      } else {
        // Check language consistency in folder
        const folder = getAtPath(newDirs, path);
        if (folder && folder.children.length > 0) {
          const existingFiles = folder.children.filter(child => child.type === 'file');
          if (existingFiles.length > 0) {
            const existingLanguage = getLanguage(existingFiles[0].name);
            if (existingLanguage !== newLanguage) {
              alert(`Cannot add file. This location only allows ${existingLanguage} files.`);
              return;
            }
          }
        }
        const updatedDirs = addAtPath(newDirs, path, newFile);
        saveDirectories(updatedDirs);
      }
    }
  };

  const selectFile = (file, parentIndex) => {
    onFileSelect(file, parentIndex);
  };

  const deleteAtPath = (dirs, path) => {
    if (path.length === 1) {
      dirs.splice(path[0], 1);
      return dirs;
    }
    const [currentIndex, ...remainingPath] = path;
    dirs[currentIndex].children = deleteAtPath(dirs[currentIndex].children, remainingPath);
    return dirs;
  };

  const deleteItem = (item, path) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${item.name}"?`);
    if (confirmDelete) {
      const newDirs = [...directories];
      const updatedDirs = deleteAtPath(newDirs, path);
      saveDirectories(updatedDirs);
      // If the deleted item was a file and was selected, deselect it
      if (item.type === 'file') {
        onFileSelect(null, null);
      }
    }
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const renderTree = (items, parentPath = []) => {
    return items.map((item, index) => {
      const currentPath = [...parentPath, index];
      const itemId = currentPath.join('-');
      return (
        <div key={index} className="ml-4">
          <div className="flex items-center relative">
            {item.type === 'folder' ? (
              <>
                <span className="text-yellow-400">📁</span>
                <span className="ml-2 text-white">{item.name}</span>
                <div className="ml-auto relative">
                  <button onClick={() => toggleDropdown(itemId)} className="text-white text-xs px-1 rounded hover:bg-zinc-700">⋮</button>
                  {openDropdown === itemId && (
                    <div className="absolute right-0 mt-1 w-32 bg-zinc-700 border border-zinc-600 rounded shadow-lg z-10">
                      <button onClick={() => { addDirectory(currentPath); setOpenDropdown(null); }} className="block w-full text-left px-3 py-1 text-xs text-white hover:bg-zinc-600">Add Folder</button>
                      <button onClick={() => { addFile(currentPath); setOpenDropdown(null); }} className="block w-full text-left px-3 py-1 text-xs text-white hover:bg-zinc-600">Add File</button>
                      <button onClick={() => { deleteItem(item, currentPath); setOpenDropdown(null); }} className="block w-full text-left px-3 py-1 text-xs text-red-400 hover:bg-zinc-600">Delete</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <span className="text-blue-400">{getFileIcon(item.name)}</span>
                <span className="ml-2 text-white cursor-pointer" onClick={() => selectFile(item, parentPath.length > 0 ? parentPath[parentPath.length - 1] : null)}>{item.name}</span>
                <div className="ml-auto relative">
                  <button onClick={() => toggleDropdown(itemId)} className="text-white text-xs px-1 rounded hover:bg-zinc-700">⋮</button>
                  {openDropdown === itemId && (
                    <div className="absolute right-0 mt-1 w-32 bg-zinc-700 border border-zinc-600 rounded shadow-lg z-10">
                      <button onClick={() => { deleteItem(item, currentPath); setOpenDropdown(null); }} className="block w-full text-left px-3 py-1 text-xs text-red-400 hover:bg-zinc-600">Delete</button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          {item.children && renderTree(item.children, currentPath)}
        </div>
      );
    });
  };

  return (
    <div className="w-64 bg-zinc-800 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-indigo-400 mb-4">Directories</h2>
      <div className="mb-4 relative">
        <button onClick={() => setTopDropdown(!topDropdown)} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm">
          Add
        </button>
        {topDropdown && (
          <div className="absolute left-0 mt-1 w-32 bg-zinc-700 border border-zinc-600 rounded shadow-lg z-10">
            <button onClick={() => { addDirectory(null); setTopDropdown(false); }} className="block w-full text-left px-3 py-1 text-xs text-white hover:bg-zinc-600">Add Folder</button>
            <button onClick={() => { addFile(null); setTopDropdown(false); }} className="block w-full text-left px-3 py-1 text-xs text-white hover:bg-zinc-600">Add File</button>
          </div>
        )}
      </div>
      {renderTree(directories)}
    </div>
  );
}
