import { UploadFile } from "@/packages/types";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";
import { useMemo, useState } from "react";


export const Attachment = ({ file, onRemoveClick }: { file: UploadFile, onRemoveClick?: (fileId?: string) => void }) => {

    const ext = useMemo(() => {
        if (!!file.Type) return file.Type?.toLocaleLowerCase();
        var arr = file.Url.split('.');
        if (arr.length == 0) return '';
        return arr[arr.length - 1].toLocaleLowerCase();


    }, [file]);

    const name = useMemo(() => {
        if (!!file.Name) return file.Name;
        var arr = file.Url.split('/');
        if (arr.length == 0) return '';
        return arr[arr.length - 1];


    }, [file]);


    return (
        <span className="attachment">
            <a title={name} href={file.Url} target="_blank"><i className={`dx-icon-custom dx-icon-custom-file-${ext ?? 'all'} mr-1`}></i>{name}</a>
            {!!onRemoveClick ? <a href="#" className="remove ml-1" onClick={() => onRemoveClick(file.Id)}><i className="dx-icon-remove"></i></a> :

                <a href={file.Url} className="remove ml-1"><i className="dx-icon-download" /></a>
            }
        </span>

    );
}