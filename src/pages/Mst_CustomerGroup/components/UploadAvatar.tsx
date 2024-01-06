import { useAtom } from "jotai";
import { useMemo, useRef } from "react";
import { fileAtom } from "./store";
import { toast } from "react-toastify";

export const getAvatarUrl = (avatarName: any) => {
  if (avatarName || avatarName === "") {
    return avatarName;
  } else {
    return "https://tse2.mm.bing.net/th?id=OIP.udoq18uxDpu6UHi2H__97gAAAA&pid=Api&P=0&h=180";
  }
};

export default function UploadAvatar({ data, setAvt }: any) {
  const imgRef = useRef<any>();
  const [file, setFile] = useAtom(fileAtom);
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : "";
  }, [file]);
  const handleUpload = () => {
    imgRef.current?.click();
  };
  const onFileChange = (event: any) => {
    const fileFromLocal = event.target.files?.[0];
    if (
      fileFromLocal &&
      (fileFromLocal.size >= 1048576 || !fileFromLocal.type.includes("image"))
    ) {
      toast.error(`Dụng lượng file tối đa 1 MB. Định dạng:.JPEG, .PNG`);
    } else {
      setAvt(fileFromLocal);
      setFile(fileFromLocal);
    }
  };

  return (
    <div className="overflow-hidden h-[190px] w-[190px] rounded-lg shadow-xl mt-[40px]">
      <div className="h-full w-full" onClick={handleUpload}>
        <img
          alt=""
          className="w-full h-full object-cover"
          src={getAvatarUrl(previewImage || data)}
        />
        <input type="file" ref={imgRef} hidden onChange={onFileChange} />
      </div>
    </div>
  );
}
