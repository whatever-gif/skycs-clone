import { Button } from "devextreme-react";
import { Navigate } from "react-router-dom";

export const Disconnected = () => {
    return (
        <div className="p-5">
            <center>Bạn đã truy cập trên tab khác</center>
            <center className="mt-5"><Button text="Reload" onClick={()=>{
                window.location.href='/';
            }}/></center>
        </div>
    )
}