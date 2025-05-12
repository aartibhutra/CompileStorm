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

    return <div className="flex flex-row justify-center items-center h-screen w-screen">
        {step == 1 ?
            <div className="flex flex-col gap-4">
                
                <div className="text-xl font-semibold">Enter your account's email address</div>

                <form onSubmit={handleEmailSubmit}>
                    <input placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)}></input>
                    <button type="submit" >Send OTP</button>
                </form>

            </div> : step == 2 ? 
            <div className="flex flex-col justify-center items-center">

                <div className="text-xl font-semibold pb-5">Account's Email : {email}</div>

                <Timer setTimer={setTimer} startTimer={startTimer}/>

                <form onSubmit={handleOtpVerification}>
                    <input placeholder="OTP" value={otp} onChange={(e)=> setOtp(e.target.value)}></input>

                    {!startTimer ? <button onClick={handleEmailSubmit}>Resend OTP</button> : <button type="submit" >Verify</button>}
                </form>

            </div> : 
            <div className="flex flex-col justify-center align-center">
                
                <div className="text-xl pb-6 font-semibold place-self-center">Enter New Password</div>

                <form onSubmit={handlePasswordReset}>
                    <input placeholder="new password" value={pass} onChange={(e)=> setPass(e.target.value)} ></input>
                    <input placeholder="confirm new password" value={confirmPass} onChange={(e)=> setConfirmPass(e.target.value)} ></input>
                    <button type="submit" >Reset Password</button>
                </form>

            </div>
        }
    </div>
}