import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

export default function ProjectDashboard({ user, setUser }) {
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [projName, setProjName] = useState("");
  const [projLang, setProjLang] = useState("js");

  const navigate = useNavigate();

  const LANGS = ["js", "python", "java", "c", "cpp"];

  useEffect(() => {
    if (!user || !user._id) {
      navigate("/landing");
      return;
    }
  }, [user]);

  useEffect(() => {
    async function fetchProjects() {
      if (!user?._id) return;

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/projects`,
        { withCredentials: true }
      );
      setProjects(res.data.projects || []);
    }
    fetchProjects();
  }, [user]);

  const handleCreate = async () => {
    if (!projName.trim()) return;

    const body = { name: projName, language: projLang, structure: [] };

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/project`,
      body,
      { withCredentials: true }
    );

    setShowCreateModal(false);
    navigate(`/project/${res.data.project._id}`);
  };

  const deleteProject = async (id) => {
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/project/${id}`,
      { withCredentials: true }
    );

    setProjects(projects.filter((p) => p._id !== id));
    setShowEditModal(false);
  };

  const handleUpdateProject = async () => {
    if (!projName.trim()) return;

    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/project/${selectedProject._id}`,
      { name: projName, language: projLang },
      { withCredentials: true }
    );

    setProjects((prev) =>
      prev.map((p) =>
        p._id === selectedProject._id
          ? { ...p, name: projName, language: projLang }
          : p
      )
    );

    setShowEditModal(false);
  };

  const openEditModal = (project) => {
    setSelectedProject(project);
    setProjName(project.name);
    setProjLang(project.language);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Header user={user} setUser={setUser} />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Your Projects</h1>

        <button
          onClick={() => {
            setProjName("");
            setProjLang("js");
            setShowCreateModal(true);
          }}
          className="px-4 py-2 bg-indigo-600 rounded mb-6"
        >
          + New Project
        </button>

        <div className="grid grid-cols-3 gap-4">
          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-zinc-800 p-4 rounded shadow relative hover:bg-zinc-700 transition"
            >
              <div
                onClick={() => navigate(`/project/${p._id}`)}
                className="cursor-pointer"
              >
                <h2 className="text-xl font-semibold">{p.name}</h2>
                <p className="text-indigo-400">{p.language}</p>
              </div>

              <button
                className="absolute top-2 right-2 text-sm bg-zinc-700 px-2 py-1 rounded hover:bg-zinc-600"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(p);
                }}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-zinc-800 p-6 rounded w-96 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Create Project</h2>

            <input
              type="text"
              placeholder="Project Name"
              value={projName}
              onChange={(e) => setProjName(e.target.value)}
              className="w-full p-2 bg-zinc-700 rounded text-white mb-3 outline-none"
            />

            <select
              value={projLang}
              onChange={(e) => setProjLang(e.target.value)}
              className="w-full p-2 bg-zinc-700 rounded mb-4"
            >
              {LANGS.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 bg-zinc-600 rounded"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-indigo-600 rounded"
                onClick={handleCreate}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-zinc-800 p-6 rounded w-96 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Edit Project</h2>

            <input
              type="text"
              placeholder="Project Name"
              value={projName}
              onChange={(e) => setProjName(e.target.value)}
              className="w-full p-2 bg-zinc-700 rounded text-white mb-3 outline-none"
            />

            <select
              value={projLang}
              onChange={(e) => setProjLang(e.target.value)}
              className="w-full p-2 bg-zinc-700 rounded mb-4"
            >
              {LANGS.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                className="px-3 py-1 bg-red-600 rounded"
                onClick={() => deleteProject(selectedProject._id)}
              >
                Delete
              </button>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-zinc-600 rounded"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 bg-indigo-600 rounded"
                  onClick={handleUpdateProject}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
