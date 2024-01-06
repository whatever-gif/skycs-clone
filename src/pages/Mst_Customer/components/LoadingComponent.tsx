import { useAtomValue } from "jotai";
import React, { useEffect } from "react";
import { isLoadingUploadAtom } from "./store";
import { LoadPanel } from "devextreme-react";

const LoadingComponent = ({ onReload }: any) => {
  const isLoadingUpload = useAtomValue(isLoadingUploadAtom);
  return (
    <div>
      <LoadPanel visible={isLoadingUpload} />
    </div>
  );
};

export default LoadingComponent;
