import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
        }).catch((e)=>{
            console.log(e);
        })
    }

    // nav bar 
    return <div className="bg-neutral-800 text-white px-6 py-2 flex items-start justify-between shadow-md">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
            <span className="block">Compile</span>
            <span className="block">Storm</span>
        </h1>
        
        {/* Profile */}
        <div className="absolute bottom-2 left-6">
            {/* on click will show signout button */}
            <div onClick={()=>setShowDropDown(true)}>{user.username.charAt(0)}</div>
            {!showDropDown ? <></> : <div>
                {user.username == "Guest000000000012" ? <button onClick={()=>navigate("/signin")}>Sign In</button> : <button onClick={()=>handleSignOut()}>Sign Out</button>}
            </div>}
        </div>
    </div>
}