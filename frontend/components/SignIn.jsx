import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { notifySuccess , notifyError} from "./utility/toast";

export default function SignIn () {
    const navigate = useNavigate();

    //states
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    async function handleSignIn (e /* stands for event */){
        console.log("hi")
        e.preventDefault(); // prevents the form to submit
        try{
            const body = {
                "email": email,
                "password": pass
            }

            await axios.post("http://localhost:3000/api/signin", body, {withCredentials : true}) //"withCredentials" allows us to send or receive cookies
                .then(()=>{
                    // notifySuccess("Signed In Successfully!");
                    console.log("User Logged In!");
                    navigate("/") // navigate to Home page
                    notifySuccess("Signed In Successfully!");
                }).catch(()=>{
                    // notifyError("Invalid Credentials!")
                    console.log("Error Logging in!!");
                    notifyError("Invalid Credentials!")
                })

        } catch(err){
            console.log(err);
        }
    }

    return <div className="flex flex-row justify-center items-center h-screen w-screen gap-4 bg-zinc-900 text-white">
        <h1 className="absolute top-6 text-4xl font-serif italic text-center">
            <span className="text-indigo-500 font-mono">Compile</span>
            <span className="text-white font-sans">Storm</span>
        </h1>
        <div className="bg-zinc-800 p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl pb-10 font-semibold text-center text-indigo-400">Welcome Back!</h2>
            <form className="flex flex-col gap-4">
                <input 
                    type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}
                    className="bg-zinc-700 text-white p-2 rounded-md outline-none"
                ></input>

                <input 
                    type="password" placeholder="Password" onChange={(e)=>setPass(e.target.value)}
                    className="bg-zinc-700 text-white p-2 rounded-md outline-none"
                ></input>
                <a href="/forgotPassword" className="hover:text-[#d00000] underline text-sm pb-1">Forgot Password?</a>

                <button type="submit" onClick={(e) => handleSignIn(e)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-md"
                >Sign In</button>
            </form>
            
            <div className="pt-4 text-center">Don't have an account? <a href="/signup" className="hover:text-indigo-400 underline">Create an account!</a></div>
        </div>
    </div>
}