import React from "react";
import { useAtomValue } from "jotai";
import {
  normalGridDeleteMultipleConfirmationBoxAtom,
  normalGridSelectionKeysAtom,
} from "@packages/ui/base-gridview/store/normal-grid-store";
import { PopupBox } from "@packages/ui/base-gridview/components/popup";

interface DeleteMultipleConfirmationBoxProps {
  title: string;
  message: string;
  onYesClick: (keys: string[]) => void;
  onNoClick: () => void;
}

export const DeleteMultipleConfirmationBox = ({
  title,
  message,
  onNoClick,
  onYesClick,
}: DeleteMultipleConfirmationBoxProps) => {
  const visible = useAtomValue(normalGridDeleteMultipleConfirmationBoxAtom);
  const selectionKeys = useAtomValue(normalGridSelectionKeysAtom);

  const handleYesClick = () => {
    onYesClick?.(selectionKeys);
  };

  const handleNoClick = () => {
    onNoClick?.();
  };

  return (
    <PopupBox
      visible={visible}
      title={title}
      message={message}
      onYesClick={handleYesClick}
      onNoClick={handleNoClick}
    />
  );
};
