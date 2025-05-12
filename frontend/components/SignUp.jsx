import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "./utility/toast";

export default function SignUp () {
    const navigate = useNavigate();

    //states
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    async function handleSignUp(e){
        e.preventDefault(); // prevents the form to submit
        try{
            const body = {
                "username" : username,
                "email": email,
                "password": pass
            }

            await axios.post("http://localhost:3000/api/signup", body, {withCredentials : true}) //"withCredentials" allows us to send or receive cookies
                .then(()=>{
                    // notifySuccess("Signed In Successfully!");
                    console.log("User Logged In!");
                    navigate("/") // navigate to Home page
                    notifySuccess("Signed Up Successfully!");
                }).catch(()=>{
                    // notifyError("Invalid Credentials!")
                    console.log("Error Logging in!!");
                    notifyError("Invalid Credentials!");
                })

        } catch(err){
            console.log(err);
        }
    }

    return <div className="flex flex-row justify-center items-center h-screen w-screen gap-4 bg-zinc-900 text-white">
        <h1 className="absolute top-6 left-6 text-2xl font-serif italic">
            <span className="text-indigo-500 font-mono">Compile</span>
            <span className="text-white font-sans">Storm</span>
        </h1>

        <div className="flex justify-center items-center">
            <div className="bg-zinc-800 p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl pb-10 font-semibold text-center text-indigo-400">Welcome to the Compile Storm!</h2>
                <form className="flex flex-col gap-4">
                    <input 
                        type="username" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)}
                        className="bg-zinc-700 text-white p-2 rounded-md outline-none"
                    ></input>
                    <input 
                        type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}
                        className="bg-zinc-700 text-white p-2 rounded-md outline-none"
                    ></input>

                    <input 
                        type="password" placeholder="Password" onChange={(e)=>setPass(e.target.value)}
                        className="bg-zinc-700 text-white p-2 rounded-md outline-none"
                    ></input>
                {/* <a href="/forgotPassword" className="hover:text-[#d00000] underline place-self-start text-sm pb-4">Forgot Password?</a> */}

                    <button 
                        type="submit" onClick={(e)=>handleSignUp(e)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-md"
                    >Sign Up</button>
            </form>
            
            <div className="pt-4 text-center">Already have an account? <a href="/signin" className="hover:text-indigo-400 underline">Sign In!</a></div>
            </div>
        </div>
    </div>
}