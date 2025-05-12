import axios from "axios";
import { useState, useEffect } from "react";

export default function Header(){
    const [user, setUser] = useState({username : "Guest"});

    useEffect(()=>{
        async function fetch(){
            await axios.get("http://localhost:3000/api/userDetails", {withCredentials : true})
            .then((res)=>{
                setUser(res.data.userData)
            }).catch((e)=>console.log(e));
        }
        fetch();
    },[])

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
            {user.username.charAt(0)}
        </div>
    </div>
}