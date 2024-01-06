import { useState } from "react";

export interface AvatarData {
    img?: string | null;
    name?: string | null;
    size?: string | null;
    className?: string | null;
}
export const Avatar = ({ img, name, size, className }: AvatarData) => {

    const getName = () => {
        if (name == null || name == '') return '';
        var n: string= name??'';

        var arr = n.split(' ');

        if(arr.length>0) return arr[0][0]+arr[arr.length-1][0];

        return n.substring(0,2);
    };
    return (
        (img != null && img != '') ? <img className={`avatar avatar-${size ?? 'sm'} ${className ?? ""}`} src={img} /> :
            <span className={`avatar avatar-${size ?? 'sm'} ${className ?? ""}`}>{getName()}</span>

    );
}