// import { useRecoilValue } from "recoil";
import { MonEditor } from "./MonEditor";
import { useState } from "react";
// import { outputSt } from "../store/output";


export default function Body(){
    const [op , setOp] =  useState("...")
    return (<div className="flex flex-col w-full p-4 gap-4 bg-zinc-900 text-white overflow-auto">
        {/* Code Editor */}
        <div className="flex-1 bg-zinc-800 rounded-lg shadow-inner p-2">
        <MonEditor setOp={setOp}/>
        </div>

        {/* Output and Input Screen */}
        <div className="bg-zinc-800 rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold text-indigo-400 mb-2">Output</h2>
        <div className="bg-black text-green-400 font-mono p-2 rounded h-40 overflow-y-auto whitespace-pre-wrap">
          {op}
        </div>
      </div>
    </div>)
}