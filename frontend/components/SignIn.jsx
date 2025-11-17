import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "./utility/toast";

export default function SignIn({ setUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");

  async function handleSignIn(e) {
    e.preventDefault();

    try {
      // Reset errors
      setEmailError("");
      setPassError("");

      // Validation
      if (!email.trim()) return setEmailError("Email is required");
      if (!email.includes("@")) return setEmailError("Enter a valid email");
      if (!pass.trim()) return setPassError("Password is required");
      if (pass.length < 8) return setPassError("Password must be at least 8 characters");

      const body = { email, password: pass };

      // Sign in
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/signin`, body, {
        withCredentials: true,
      });

      // Fetch user details after login
      const userRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/userDetails`,
        { withCredentials: true }
      );

      setUser(userRes.data.userData); // <-- IMPORTANT
      notifySuccess("Signed In Successfully!");
      navigate("/");

    } catch (err) {
      console.log(err);
      notifyError("Invalid Credentials!");
    }
  }

  return (
    <div className="flex flex-row justify-center items-center h-screen w-screen gap-4 bg-zinc-900 text-white">
      <div className="bg-zinc-800 p-8 rounded-xl shadow-lg w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-serif italic">
            <span className="text-indigo-500 font-mono">Compile</span>
            <span className="text-white font-sans">Storm</span>
          </h1>
        </div>

        <br />
        <h2 className="text-2xl pb-10 font-semibold text-center">Welcome Back!</h2>

        {/* Form */}
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-700 text-white p-2 rounded-md outline-none"
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="bg-zinc-700 text-white p-2 rounded-md outline-none"
          />
          {passError && <p className="text-red-500 text-sm">{passError}</p>}

          <a
            href="/forgotPassword"
            className="hover:text-[#d00000] underline text-sm pb-1"
          >
            Forgot Password?
          </a>

          <button
            type="submit"
            onClick={handleSignIn}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-md"
          >
            Sign In
          </button>
        </form>

        <div className="pt-4 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="hover:text-indigo-400 underline">
            Create an account!
          </a>
        </div>
      </div>
    </div>
  );
}
