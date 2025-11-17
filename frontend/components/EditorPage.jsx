import Header from "./Header";
import Body from "./Body";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function EditorPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/userDetails`,
          { withCredentials: true }
        );
        setUser(res.data.userData);

        console.log(user)
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/project/${id}`,
          { withCredentials: true }
        );
        setProject(res.data.project);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProject();
  }, [id]);

  const updateStructure = async (newStructure) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/${id}`,
        { structure: newStructure },
        { withCredentials: true }
      );

      setProject(res.data.project);
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  if (!project || !user)
    return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-900">
      <Header user={user} setUser={setUser} />

      <Body
        user={user}
        project={project}
        setProject={setProject}
        updateStructure={updateStructure}  
      />
    </div>
  );
}
