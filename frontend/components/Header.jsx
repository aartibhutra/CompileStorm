import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "./utility/toast";

export default function Header(){
    const [user, setUser] = useState({username : "Guest000000000012"});
    const [showDropDown, setShowDropDown] = useState(false);

    const navigate = useNavigate();

    useEffect(()=>{
        async function fetch(){
            await axios.get("http://localhost:3000/api/userDetails", {withCredentials : true})
            .then((res)=>{
                setUser(res.data.userData)
            }).catch((e)=>console.log(e));
        }
        fetch();
    },[])

    const handleSignOut = async ()=>{
        await axios.post("http://localhost:3000/api/signout").then(()=>{
            console.log("signed out !");
            setShowDropDown(false);
            setUser({username : "Guest000000000012"});

            notifySuccess("Signed Out Successfully!")
        }).catch((e)=>{
            console.log(e);

            notifyError("Error Signing Out!")
        })
    }

    //  nav bar 
    return <div className="bg-neutral-800 text-white pl-0 pr-6 py-2 flex items-start justify-between shadow-md">
        {/* Logo */}
        <h1 className="text-xl font-serif italic leading-tight tracking-tight text-white">
            <span className="block text-indigo-400">Compile</span>
            <span className="block text-white">Storm</span>
        </h1>
        
        {/* Profile */}
        <div className="absolute bottom-2 left-6 text-white">
            {/* on click will show signout button */}
            <div onClick={()=>setShowDropDown(!showDropDown)}
                className="w-10 h-10 rounded-full bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center text-lg font-semibold cursor-pointer transition">{user.username.charAt(0)}</div>
            {!showDropDown ? <></> : <div className="mt-2 bg-neutral-800 border border-neutral-600 rounded-md shadow-lg py-2 px-4">
                {user.username == "Guest000000000012" ? <button onClick={()=>navigate("/signin")}>Sign In</button> : <button onClick={()=>handleSignOut()}>Sign Out</button>}
            </div>}
        </div>
    </div>
}