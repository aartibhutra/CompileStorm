import Header from "./Header"
import Body from "./Body"

import {useState} from 'react';

export default function Home(){
    const [user, setUser] = useState("Guest000000000012");
    return (<div className=" flex bg-gradient-to-r from-zinc-700 to-zinc-500 h-screen">
        <Header user ={user} setUser = {setUser}/>
        <Body user = {user}/>
    </div>)
}