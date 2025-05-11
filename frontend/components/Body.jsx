// import { useRecoilValue } from "recoil";
import { MonEditor } from "./MonEditor";
import { useState } from "react";
// import { outputSt } from "../store/output";


export default function Body(){
    const [op , setOp] =  useState("...")
    return (<div>
        {/* Code Editor */}
        <MonEditor setOp={setOp}/>

        {/* Output and Input Screen */}
        <div>
            {/* Output Screen */}
            <div>
                Output - {op}
            </div>
        </div>
    </div>)
}