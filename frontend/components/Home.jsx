import Header from "./Header"
import Body from "./Body"

import {useState} from 'react';

export default function Home(){
    const [user, setUser] = useState("Guest000000000012");
    return (<div className="min-h-screen bg-gradient-to-r from-zinc-700 to-zinc-500">
        <Header user ={user} setUser = {setUser}/>
        <Body user = {user}/>
    </div>)
}
