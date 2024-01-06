import { useI18n } from "@/i18n/useI18n";
import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import { useSetAtom } from "jotai";

import { useEffect, useState } from "react";
import Button from "devextreme-react/button";
const ssoDomain: string = `${import.meta.env.VITE_ACC_BASE_URL}`;
const myDomain = import.meta.env.VITE_DOMAIN;

export default function ErrorLogin({
  login,
  naoid,
}: {
  login: boolean;
  naoid: string;
}) {
  const { t } = useI18n("Error");
  const [check, setCheck] = useState(false);
  const title = t("ErrorTitle");
  useEffect(() => {
    setCheck(login);
  }, [login, naoid]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    window.open(
      `${ssoDomain}/account/signout/?returnUrl=${myDomain}`,
      "_self",
      "noreferrer"
    );
    window.close();
  };

  return (
    <Popup
      width={300}
      height={200}
      titleRender={(item: any) => (
        <div className="error-title">
          <Button
            icon={"/images/icons/warning.svg"}
            hoverStateEnabled={false}
            activeStateEnabled={false}
            focusStateEnabled={false}
            stylingMode={"text"}
          />
          {title}
        </div>
      )}
      // container=".dx-viewport"
      visible={check}
      position={"center"}
    >
      <Position at="bottom" my="center" />
      <ToolbarItem toolbar="bottom" location="after">
        <Button text={t("Re-Login")} onClick={handleLogout} />
      </ToolbarItem>
      <ToolbarItem toolbar="bottom" location="after">
        <Button
          text={t("Close")}
          className="cancel-button"
          onClick={() => setCheck(false)}
        />
      </ToolbarItem>
      <p>Hết phiên truy cập. Vui lòng đăng nhập lại để tiếp tục sử dụng!</p>
    </Popup>
  );
}
