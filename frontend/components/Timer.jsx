import { useEffect, useState } from "react";
import { notifyDefault } from "./utility/toast";

const INIT_MIN = "10"
const INIT_SEC = "00"

export const Timer = ({startTimer, setTimer})=>{
    const [min, setMin] = useState(INIT_MIN);
    const [sec, setSec] = useState(INIT_SEC)

    useEffect(()=>{
        if(startTimer){
            setMin(INIT_MIN)
            setSec(INIT_SEC)
        }
    },[startTimer])

    // console.log(props.sec)

    useEffect(()=>{
        if(min == 0 && sec == 0){
            notifyDefault("OTP Expired!")
            setTimer(false);
        }
        else if(sec == 0){
            setTimeout(()=>{
                setSec("59")
                
                const minute = parseInt(min) - 1;
                setMin(minute < 10 ? "0" + minute : "" + minute);

            }, 1000)
        }
        else{
            setTimeout(()=>{
                const seconds = (parseInt(sec) - 1);
                setSec( seconds < 10 ? "0" + seconds : "" + seconds );
            },1000)
        }

    },[sec, min])

    return <div className="pb-2">
        {min} : {sec}
    </div>
}