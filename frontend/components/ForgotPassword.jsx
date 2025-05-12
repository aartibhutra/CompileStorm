import { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

//utils
// import { notifyError, notifySuccess } from "../utils/toast";
import { notifyError, notifySuccess } from "./utility/toast";
import { Timer } from "./Timer";
// import { ipt } from "../styles_ui/ipt";
// import { form_style } from "../styles_ui/form_style";
// import { btn2 } from "../styles_ui/btn";

export default function ForgotPassword(){
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [pass, setPass] = useState("")
    const [confirmPass, setConfirmPass] = useState("")

    const [startTimer, setTimer] = useState(false);

    const navigate =  useNavigate();

    const handleEmailSubmit = async (e)=>{
        e.preventDefault();

        try{
            // console.log("hi")
            await axios.post("http://localhost:3000/api/forgotPassword", {email : email})
                .then(()=>{
                    notifySuccess("OTP sent!")
                    
                    setTimer(true);

                    setStep(2);
                }).catch((err)=>{
                    notifyError("Incorrect Email!")
                    console.log(err);
                })
        } catch(e){
            console.log("Error : ", e.message);
        }
    }

    const handleOtpVerification = async (e)=>{
        e.preventDefault();
        
        try{
            await axios.post("http://localhost:3000/api/verifyOtp", {email : email, otp : otp})
                .then(()=>{
                    notifySuccess("OTP Verified!")
                    setStep(3)
                }).catch((err)=>{
                    notifyError("Invalid OTP!")
                    console.log(err);
                })
        } catch(e){
            console.log("Error : ", e.message);
        }
    }

    const handlePasswordReset = async (e)=>{
        e.preventDefault();

        if(pass != confirmPass){
            notifyError("Password did not match!")
            return;
        }
        
        try{
            await axios.post("http://localhost:3000/api/resetPassword", {email : email, password : pass})
                .then(()=>{
                    notifySuccess("Password Reset Successfully!")
                    navigate("/signin")
                }).catch((err)=>{
                    notifyError("Password did not reset! Try Again!")
                    console.log(err);
                })
        } catch(e){
            console.log("Error : ", e.message);
        }
    }

    return <div className="flex flex-row justify-center items-center h-screen w-screen bg-zinc-900 text-white relative">
        <h1 className="absolute top-50 text-4xl font-serif italic text-center">
            <span className="text-indigo-500 font-mono">Compile</span>
            <span className="text-white font-sans">Storm</span>
        </h1>
            {step == 1 ?
            <div className="bg-zinc-800 p-8 rounded-lg shadow-lg w-[90%] sm:w-[400px] flex flex-col gap-6 items-center">
                
                <div className="text-xl font-semibold text-center">Enter your account's email address</div>

                <form onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-4">
                    <input 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e)=> setEmail(e.target.value)}
                        className="w-full bg-zinc-700 text-white border border-zinc-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                    </input>
                    <button 
                        type="submit" 
                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-md py-2 transition"
                    >Send OTP
                    </button>
                </form>

            </div> : step == 2 ? 
            <div className="bg-zinc-800 p-8 rounded-lg shadow-lg w-[90%] sm:w-[400px] flex flex-col gap-6 items-center">

                <div className="text-xl font-semibold text-center">Account's Email : {email}</div>

                <Timer setTimer={setTimer} startTimer={startTimer}/>

                <form 
                    onSubmit={handleOtpVerification}
                    className="w-full flex flex-col gap-4"
                    >
                    <input 
                        placeholder="OTP" 
                        value={otp} 
                        onChange={(e)=> setOtp(e.target.value)}
                        className="w-full bg-zinc-700 text-white border border-zinc-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        ></input>

                    {!startTimer ? 
                        <button 
                            onClick={handleEmailSubmit}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-md py-2 transition"
                            >Resend OTP</button> : <button 
                                type="submit" 
                                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-md py-2 transition"
                                >Verify</button>}
                </form>

            </div> : 
            <div className="bg-zinc-800 p-8 rounded-lg shadow-lg w-[90%] sm:w-[400px] flex flex-col gap-6 items-center">
                
                <div className="text-xl pb-6 font-semibold text-center">Enter New Password</div>

                <form onSubmit={handlePasswordReset}>
                   <div className="flex flex-col space-y-4">
                        <input
                            placeholder="New password"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            className="w-full bg-zinc-700 text-white border border-zinc-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            placeholder="Confirm new password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            className="w-full bg-zinc-700 text-white border border-zinc-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <button 
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-md py-2 transition" 
                        >Reset Password</button>
                    </div>
                    <div className="pt-4 text-center">Remembered your password? <a href="/signin" className="hover:text-indigo-400 underline">Sign In</a></div>
                </form>
            </div>
        }
    </div>
}