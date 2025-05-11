import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";

export default function SignUp () {
    const navigate = useNavigate();

    //states
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    // const handleSignIn = async (e /* stands for event */)=>{
    //     e.preventDefault(); // prevents the form to submit
    //     try{
    //         const body = {
    //             "email": email,
    //             "password": pass
    //         }

    //         await axios.post("http://localhost:5000/api/auth/signin", body, {withCredentials : true}) //"withCredentials" allows us to send or receive cookies
    //             .then(()=>{
    //                 notifySuccess("Signed In Successfully!");
    //                 console.log("User Logged In!");
    //                 navigate("/") // navigate to Home page
    //             }).catch(()=>{
    //                 notifyError("Invalid Credentials!")
    //                 console.log("Error Logging in!!");
    //             })

    //     } catch(err){
    //         console.log(err);
    //     }
    // }

    return <div className="flex flex-row justify-center items-center h-screen w-screen gap-4">
        <div className="basis-1/2 flex flex-col justify-center items-center">
            <h2 className="text-2xl pb-10 font-semibold">Welcome to the Compile Storm!</h2>
            <form>
                <input type="username" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)}></input>
                <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}></input>

                <input type="password" placeholder="Password" onChange={(e)=>setPass(e.target.value)}></input>
                {/* <a href="/forgotPassword" className="hover:text-[#d00000] underline place-self-start text-sm pb-4">Forgot Password?</a> */}

                <button type="submit" >Sign In</button>
            </form>
            
            <div className="pt-4">Already have an account? <a href="/signup" className="hover:text-[#d00000] underline">Sign In!</a></div>
        </div>
        <div className="basis-1/2 bg-[url(/images/backgroungimg.jpg)] h-screen"></div>
    </div>
}