import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "./utility/toast";

export default function Header({ user, setUser }) {
  const [showDropDown, setShowDropDown] = useState(false);
  const navigate = useNavigate();

  // Fetch logged-in user
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/userDetails`,
          { withCredentials: true }
        );

        if (res.data?.userData) {
          const { username, email, _id } = res.data.userData;
          setUser({ username, email, _id });
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  const handleSignOut = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/signout`, {}, {
        withCredentials : true
      });
      setShowDropDown(false);
      setUser(null);
      navigate("/");
      notifySuccess("Signed Out Successfully!");

    //   window.location.reload();
    } catch (err) {
      console.log(err);
      notifyError("Error Signing Out!");
    }
  };

  const displayName = user?.username || "Guest";


  return (
    <div className="bg-neutral-800 text-white pl-0 pr-6 py-2 flex items-start justify-between shadow-md">

      {/* Logo */}
      <h1 className="mt-4 ml-4 text-xl font-serif italic">
        <span className="text-indigo-400">Compile</span>
        <span className="text-white">Storm</span>
      </h1>

      {/* Profile Section */}
      <div className="absolute top-2 right-6 text-white">
        <div className="relative">

          <div
            onClick={() => setShowDropDown((prev) => !prev)}
            className="
              w-10 h-10 rounded-full bg-neutral-700 
              hover:bg-neutral-600 cursor-pointer
              flex items-center justify-center
              text-lg font-semibold
            "
          >
            {displayName[0]?.toUpperCase()}
          </div>

          {showDropDown && (
            <div
              className="
                min-w-30 absolute right-0 mt-2 z-50 
                bg-neutral-800 border border-neutral-600 
                rounded-md shadow-lg py-2 px-4
              "
            >
              {!user ? (
                <button onClick={() => navigate("/signin")}>Sign In</button>
              ) : (
                <button onClick={handleSignOut}>Sign Out</button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
