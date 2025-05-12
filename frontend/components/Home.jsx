import Header from "./Header"
import Body from "./Body"

export default function Home(){
    return (<div className=" flex bg-gradient-to-r from-zinc-700 to-zinc-500 h-screen">
        <Header/>
        <Body/>
    </div>)
}