import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "./utility/toast";

export default function SignUp () {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    const [userError, setUserError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passError, setPassError] = useState("");

    async function handleSignUp(e){
        e.preventDefault();

        try {
            const body = { username, email, password: pass };

            setUserError("");
            setEmailError("");
            setPassError("");

            if (!username.trim()) setUserError("Username is required");
            else if (username.length < 3) setUserError("Username must be at least 3 characters");

            if (!email.trim()) setEmailError("Email is required");
            else if (!email.includes("@")) setEmailError("Enter a valid email");

            if (!pass.trim()) setPassError("Password is required");
            else if (pass.length < 8) setPassError("Password must be at least 8 characters");

            const hasError = userError || emailError || passError;
            if (hasError) return;

            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/signup`, 
                body,
                { withCredentials: true }
            );

            notifySuccess("Signed Up Successfully!");
            navigate("/signin");

        } catch(err){
            console.log(err)
            notifyError(err.response.data.message || "Invalid Data!");
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-zinc-900 text-white px-4">

            <div className="bg-zinc-800 p-8 rounded-xl shadow-lg w-full max-w-sm">
                
                <h2 className="text-2xl pb-8 font-semibold text-center text-indigo-500">
                    Welcome to
                    <div>
                        <span className="text-2xl font-serif italic">
                            <span className="text-indigo-500 font-mono">Compile</span>
                            <span className="text-white font-sans">Storm</span>
                        </span>
                    </div>
                </h2>

                <form className="flex flex-col gap-4">
                    
                    <input
                        type="text"
                        placeholder="Name"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                        className="bg-zinc-700 text-white p-2 rounded-md outline-none"
                    />
                    {userError && <p className="text-red-500 text-sm">{userError}</p>}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        className="bg-zinc-700 text-white p-2 rounded-md outline-none"
                    />
                    {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e)=>setPass(e.target.value)}
                        className="bg-zinc-700 text-white p-2 rounded-md outline-none"
                    />
                    {passError && <p className="text-red-500 text-sm">{passError}</p>}

                    <button
                        type="submit"
                        onClick={handleSignUp}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-md mt-2"
                    >
                        Sign Up
                    </button>

                </form>

                <div className="pt-4 text-center">
                    Already have an account?{" "}
                    <a href="/signin" className="hover:text-indigo-400 underline">
                        Sign In!
                    </a>
                </div>

            </div>
        </div>
    );
}
