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

    return <div>
        {/* Logo */}
        <h1>CompileStorm</h1>
        
        {/* Profile */}
        <div>
            {/* on click will show signout button */}
            <div onClick={()=>setShowDropDown(true)}>{user.username.charAt(0)}</div>
            {!showDropDown ? <></> : <div>
                {user.username == "Guest000000000012" ? <button onClick={()=>navigate("/signin")}>Sign In</button> : <button onClick={()=>handleSignOut()}>Sign Out</button>}
            </div>}
        </div>
    </div>
}