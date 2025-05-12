import Header from "./Header"
import Body from "./Body"

export default function Home(){
    return (<div className=" flex bg-gradient-to-r from-zinc-400 to-zinc-700 h-screen">
        <Header/>
        <Body/>
    </div>)
}