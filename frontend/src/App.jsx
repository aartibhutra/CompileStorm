import { useState, useEffect } from 'react';
import './App.css';
import React from 'react';

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { ToastContainer } from 'react-toastify';

// import Home from '../components/Home';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import ForgotPassword from '../components/ForgotPassword';
import ProjectDashboard from '../components/ProjectDashboard';
import EditorPage from '../components/EditorPage';
import LandingPage from '../components/LandingPage';

import axios from "axios";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/userDetails`,
          { withCredentials: true }
        );
        setUser(res.data.userData || null);

        console.log(res)
      } catch (err) {
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  return (
    <>
      <Router>
        <Routes>
          {/* Home route */}
          <Route path="/" element={
            user ? <ProjectDashboard user={user} setUser={setUser} /> : <LandingPage />
          } />

          {/* Editor Page */}
          <Route path="/project/:id" element={<EditorPage />} />

          {/* Auth routes */}
          <Route path="/signin" element={<SignIn setUser={setUser} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
        </Routes>
      </Router>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick={false}
        draggable
        theme="dark"
      />
    </>
  );
}

export default App;
