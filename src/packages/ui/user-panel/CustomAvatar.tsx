import { useI18n } from "@/i18n/useI18n";
import { Button, Popup } from "devextreme-react";
import { Position } from "devextreme-react/popup";
import { useAtom } from "jotai";
import { useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getAvatarUrl } from "./UploadAvatar";
import { fileAtom } from "./store";

const CustomAvatar = ({ data, setAvt, formInstance, dataField }: any) => {
  const imgRef = useRef<any>();
  const { t } = useI18n("Profile");
  const [file, setFile] = useAtom(fileAtom);
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : "";
  }, [file]);
  const handleUpload = () => {
    imgRef.current?.click();
  };

  console.log(file);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const onFileChange = async (event: any) => {
    const fileFromLocal = event.target.files?.[0];
    if (
      fileFromLocal &&
      (fileFromLocal.size >= 1048576 || !fileFromLocal.type.includes("image"))
    ) {
      toast.error(`Dụng lượng file tối đa 1 MB. Định dạng:.JPEG, .PNG`);
    } else {
      setFile(fileFromLocal);
      formInstance.updateData(dataField, fileFromLocal);
      // setAvt(fileFromLocal);
    }
  };

  const handleClear = () => {};

  return (
    <div className="flex gap-3 items-center mt-3 w-[250px] h-[250px]">
      <div
        className="overflow-hidden h-full w-full rounded-lg shadow-xl cursor-pointer"
        onClick={handleOpen}
        id="image"
      >
        <div className="h-full w-full">
          <img
            alt=""
            className="w-full h-full object-cover"
            src={getAvatarUrl(previewImage || data)}
          />
          <input
            type="file"
            ref={imgRef}
            hidden
            onChange={onFileChange}
            accept="image/png, image/gif, image/jpeg"
          />
        </div>
      </div>

      <Popup
        visible={open}
        hideOnOutsideClick
        onHiding={handleClose}
        hideOnParentScroll
        focusStateEnabled
        width="120"
        height="100"
        showTitle={false}
      >
        <Position collision={"fit"} of="#image" offset="center" />
        <Button
          className="bg-green-500 w-full py-[2px] px-[2px] mb-3"
          onClick={handleUpload}
        >
          Thêm ảnh
        </Button>
        <Button
          className="bg-red-400 w-full py-[2px] px-[2px]"
          onClick={handleClear}
        >
          Xóa ảnh
        </Button>
      </Popup>
    </div>
  );
};

export default CustomAvatar;
