import { useI18n } from "@/i18n/useI18n";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { Button, CheckBox, Switch, TextBox } from "devextreme-react";
import React, { useEffect, useState } from "react";
declare global {
  interface Window {
    setZaloCallbackData: any;
  }
}
export default function Zalo_channel({
  data,
  setFlagZalo,
  setAccessCodeZalo,
}: any) {
  const { t } = useI18n("Omi_Chanel-zalo");
  const handleFlagZalo = (e: any) => {
    setFlagZalo.current = e.value;
  };
  // const handleFlagZalo = (e: any) => {
  //   setAccessCodeZalo.current = e.value;
  // };

  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");

  const windowSize = useWindowSize();
  const [customApp, useCustomApp] = useState(false);

  const url =
    "/zalo-login-callback?oa_id=1358767413636684272&code=4enaaSiAxtHekbYJX7tMJ4J9SfFMPSH80Ce7bzvRbainwmoPeLU4Q7MfCg-48PDm7uqaflPHttK-zNclqKNcVKBvK9wy0jPXUfz3XEGwwrOua3E_yJIBPXk7Jw2i4e0U28zhZQ4To4Wwe6RyjrBqIpwyGkwp7zWuEwTXoSL3-G0vnK-Jf6pWK060PkIQIfLj2A1Af9iR_rjssLYCzIoQVHFzCBwR2Aq3HT9UY_S-t4qItYppeK-4FLZ6FFQnU-yG1eP_gOfoIN1JyCBazKW0yIEFj3hR017WGA_N4gG70TzRcfCKWLaqyY_niI04tOkxx6OTK2UlTPJ3CuDC7FzLyEOvsaHbvGRCdKIhUdss5C67QyK19jDX_8mGhZ70RcS6w1_oUW";

  const idocUrl = `https://oauth.zaloapp.com/v4/oa/permission?app_id=${
    import.meta.env.VITE_ZALO_APPID
  }&redirect_uri=${import.meta.env.VITE_DOMAIN}%2Fzalo-login-callback`;

  const popupwindow = function (url: any, title: any, w: number, h: number) {
    var left = screen.width / 2 - w / 2;
    var top = screen.height / 2 - h / 2;
    return window.open(
      url,
      title,
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        top +
        ", left=" +
        left
    );
  };
  const openPopup = () => {
    let domain = import.meta.env.VITE_DOMAIN;
    let url = `https://oauth.zaloapp.com/v4/oa/permission?app_id=${appId}&redirect_uri=https%3A%2F%2${domain}%2Fzalo-login-callback`;

    if (!customApp) url = idocUrl;

    return popupwindow(url, "", 500, windowSize.height - 200);
  };

  const [connectZalo, setConnectZalo] = useState(true);

  useEffect(() => {
    //callApi.

    window.setZaloCallbackData = (code: any) => {
      if (code) {
        const datasaveZalo = {
          AccessCode: code,
          FlagIsConnect: "1",
        };
        setAccessCodeZalo.current = datasaveZalo;
        setConnectZalo(true);
      }
      //call api để save thông tin
    };
    return () => {
      window.setZaloCallbackData = undefined;
    };
  }, []);

  const handleDisconnectZalo = () => {
    const dataDisconnectZalo = {
      AccessCode: "",
      FlagIsConnect: "0",
    };
    setAccessCodeZalo.current = dataDisconnectZalo;
    setConnectZalo(false);
  };
  const OAInfo = () => {
    return (
      <>
        <div className="ml-5 mt-3">
          <div className="flex items-center gap-3">
            <div className="h-[50px] w-[50px] rounded-full overflow-hidden">
              <img
                src={
                  data?.moa_OAAvatar !== null || ""
                    ? data?.moa_OAAvatar
                    : "https://tse2.mm.bing.net/th?id=OIP.udoq18uxDpu6UHi2H__97gAAAA&pid=Api&P=0&h=180"
                }
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              {t("Name OA")}:
              <span className="font-bold ml-1">
                {data?.moa_OAName ? data?.moa_OAName : t("Đang cập nhật")}
              </span>{" "}
            </div>
          </div>
          <button
            onClick={handleDisconnectZalo}
            className="bg-[#ffc107] px-2 py-1 mt-4 rounded hover:bg-[#098850] hover:text-[#fff]"
          >
            {t("Disconnect")}
          </button>
        </div>
      </>
    );
  };

  const ConnectZalo = () => {
    return (
      <>
        <div className="p-5">
          <div style={{ textAlign: "left" }}>
            <div className="w-full pt-2">
              <p>Nhập thông tin Zalo App để kết nối với OA của doanh nghiệp.</p>
              <p>
                Bạn cần đăng nhập tài khoản quản trị của OA để thực hiện tác vụ
                này.
              </p>
              <p>Chọn "Custom app" nếu dùng Zalo App riêng</p>
              <p>...</p>
            </div>
            <div className="flex mb-2 mt-3">
              <label>Custom app</label>
              <Switch
                switchedOnText="Custom App"
                className="ml-2"
                readOnly={true}
                value={customApp}
                onValueChange={(e) => {
                  useCustomApp((c) => {
                    return !c;
                  });
                }}
              />
            </div>
            {customApp && (
              <>
                <span>Zalo App Id</span>
                <TextBox
                  className="mb-3"
                  width={300}
                  value={appId}
                  onValueChange={(e: any) => {
                    setAppId(e);
                  }}
                ></TextBox>
                <span>Zalo App secret</span>
                <TextBox
                  mode="password"
                  className="mb-3"
                  width={300}
                  value={appSecret}
                  onValueChange={(e: any) => {
                    setAppSecret(e);
                  }}
                ></TextBox>
              </>
            )}
            <Button text={t("Kết nối OA")} onClick={openPopup} />
          </div>
        </div>
      </>
    );
  };
  const [layout, setLayout] = useState<any>("");

  useEffect(() => {
    if (data?.moa_OAID !== null || "") {
      setLayout(<OAInfo />);
    }
    if (data?.FlagIsConnect === "0") {
      setLayout(<ConnectZalo />);
    }
    if (connectZalo === false) {
      setLayout(<ConnectZalo />);
    }
  }, [connectZalo, data]);

  return (
    <div className="ml-6">
      {/* {!!data && data?.ZaloOAID ? (
        <OAInfo />
      ) : (
        <>
          <ConnectZalo></ConnectZalo>
        </>
      )} */}
      {layout}
      {/* {connectZalo === true ? <OAInfo /> : <ConnectZalo />} */}
      {/* <ConnectZalo /> */}

      <div className="mt-5">
        <div className="font-bold">{t("Cấu hình nội dung gửi")}</div>
        <div className="ml-5 mt-5 flex items-center">
          <CheckBox
            defaultValue={data?.FlagIsCreateET === "1" ? true : false}
            onValueChanged={(e: any) => handleFlagZalo(e)}
          />
          <div className="ml-3">
            {t("Tự động tạo eTicket khi nhận được tin nhắn đến Zalo OA")}
          </div>
        </div>
      </div>
    </div>
  );
}
