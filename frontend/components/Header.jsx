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

    return <div>
        {/* Logo */}
        <h1>CompileStorm</h1>
        
        {/* Profile */}
        <div>
            {/* on click will show signout button */}
            {user.username.charAt(0)}
        </div>
    </div>
}