// import { useRecoilValue } from "recoil";
import { MonEditor } from "./MonEditor";
import {  useState } from "react";
// import { outputSt } from "../store/output";


export default function Body({user}){
    const [op , setOp] =  useState("...")

    return (<div className="flex flex-col md:flex-row w-full h-screen p-4 gap-4 bg-zinc-900 text-white">

        {/* Code Editor */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 bg-zinc-800 rounded-lg shadow-inner p-2 overflow-hidden">
          <MonEditor setOp={setOp} user = {user}/>
          </div>
        </div>
        {/* Output and Input Screen */}
        <div className="w-full md:w-[30%] md:h-full bg-zinc-800 rounded-lg p-4 shadow-md flex flex-col">
        <h2 className="text-lg font-semibold text-indigo-400 mb-2">Output</h2>
        <div className="bg-black text-green-400 font-mono p-2 rounded h-full overflow-y-auto whitespace-pre-wrap">
          {op}
        </div>
      </div>
    </div>)
}