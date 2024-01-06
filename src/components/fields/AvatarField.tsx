import { useClientgateApi } from "@/packages/api";
import { Button, Popup } from "devextreme-react";
import { Position } from "devextreme-react/popup";
import { useRef, useState } from "react";

export const defaultAvatar =
  "https://tse2.mm.bing.net/th?id=OIP.udoq18uxDpu6UHi2H__97gAAAA&pid=Api&P=0&h=180";

export const AvatarField = ({ component, formData, field, editType }: any) => {
  const [avatar, setAvatar] = useState<any>(
    formData[field.ColCodeSys] == null || formData[field.ColCodeSys] == "null"
      ? defaultAvatar
      : formData[field.ColCodeSys]
  );

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const api = useClientgateApi();

  // setFormValue(formData);
  const imgRef: any = useRef();

  const handleUpload = () => {
    imgRef.current?.click();
  };

  const onFileChange = async (event: any) => {
    const fileFromLocal = event.target.files?.[0];
    if (fileFromLocal) {
      const resp: any = await api.SysUserData_UploadFile(fileFromLocal);
      if (resp?.isSuccess) {
        setAvatar(resp?.Data?.FileUrlFS);
        component?.updateData(field.ColCodeSys, resp?.Data?.FileUrlFS);
      }
    }
  };

  const handleClear = () => {
    setAvatar(null);
    component?.updateData(field.ColCodeSys, null);
  };

  return (
    <div className="flex gap-3 items-center">
      <div
        className="overflow-hidden h-[100px] w-[100px] rounded-lg shadow-xl cursor-pointer"
        style={{
          borderRadius: "50%",
          pointerEvents: editType == "detail" ? "none" : "unset",
        }}
        onClick={handleOpen}
        id="image"
      >
        <div className="h-full w-full">
          <img
            alt=""
            className="w-full h-full object-cover"
            src={avatar ?? defaultAvatar}
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
        <Position collision={"fit"} of="#image" offset={{ x: 120, y: 0 }} />
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
