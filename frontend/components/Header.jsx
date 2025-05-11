const user = {
    username : "RaunakAga12",
    email : "raunakaga12@gmail.com"
}

import { useState } from "react";

export default function Header(){
    const [selected, setSelected] = useState("");

    const handleChange = (e) =>{
        setSelected(e.target.value);
    }

    return <div>
        {/* Logo */}
        <h1>CompileStorm</h1>

        {/* Two buttons in center (Run, Language(dropbox)) */}
        <div>
            <button>Run</button>
            <select id="language" value={selected} onChange = {handleChange}>
                <option value = "">--Select--</option>
                <option value = "java">Java</option>
            </select>
        </div>
        
        {/* Profile */}
        <div>
            {user.username.charAt(0)}
        </div>
    </div>
}