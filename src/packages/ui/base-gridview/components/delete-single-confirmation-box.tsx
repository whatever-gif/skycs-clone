import React from "react";
import {useAtomValue} from "jotai";
import {
  normalGridDeleteSingleConfirmationBoxAtom,
  normalGridSingleDeleteItemAtom
} from "../store/normal-grid-store";
import {PopupBox} from "./popup";

interface DeleteSingleConfirmationBoxProps {
  title: string;
  message: string;
  onYesClick: (key: string) => void;
  onNoClick: () => void;
}

export const DeleteSingleConfirmationBox = ({
                                                title,
                                                message,
                                                onNoClick,
                                                onYesClick
                                              }: DeleteSingleConfirmationBoxProps) => {
  const visible = useAtomValue(normalGridDeleteSingleConfirmationBoxAtom)
  const selected = useAtomValue(normalGridSingleDeleteItemAtom)

  const handleYesClick = () => {
    onYesClick?.(selected);
  };

  const handleNoClick = () => {
    onNoClick?.();
  };

  return (
    <PopupBox
      visible={visible}
      title={title}
      message={message} onYesClick={handleYesClick} onNoClick={handleNoClick}/>
  )
}
