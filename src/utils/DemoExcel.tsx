import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { showErrorAtom } from "@/packages/store";

import { useQuery } from "@tanstack/react-query";
import { Input } from "antd";
import { Button } from "devextreme-react";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { toast } from "react-toastify";
import { ChiTietKhachHangLieHe } from "./support-tool/ChiTietKhachHangLienHe";
import { ChiTietKhachHangTop } from "./support-tool/ChiTietKhachHangTop";
import { ListDuLieuTruongDong } from "./support-tool/ListDuLieuTruongDong";
import { TaoMoiKhachHang } from "./support-tool/TaoMoiKhachHang";

function DemoExcel() {
  const { auth } = useAuth();

  const [orgID, setOrgID] = useState(null);
  const [networkID, setNetworkID] = useState(null);

  const api = useClientgateApi();

  const showError = useSetAtom(showErrorAtom);

  const { t: error } = useI18n("ErrorMessage");

  const getSql = async () => await api.Seq_GetColCodeSys();

  const { data: listDynamic } = useQuery(["listDynamicField"], async () => {
    const resp: any = await api.MDMetaColumn_GetAllActive();

    return resp?.DataList ?? [];
  });

  const handleGenTruongDong = async () => {
    const listPromise = ListDuLieuTruongDong.map(async (item: any) => {
      const code = await getSql().then((res) => {
        return res.Data;
      });

      return {
        ColCodeSys: code,
        ColCode: code,
        ...item,
      };
    });

    const result = Promise.all(listPromise).then((res) => res);

    result.then((res) => {
      const listProcess = res.map(async (item: any, index: any) => {
        const param = {
          ...item,
          OrgID: orgID,
          NetworkID: networkID,
          FlagIsNotNull: "0",
          FlagIsCheckDuplicate: "0",
          FlagIsQuery: "1",
          FlagActive: "1",
          DefaultIndex: "0",
          ColOperatorType: "EQUAL",
          OrderIdx: 0,
        };

        const resp = await api.MDMetaColumn_Create(param);

        if (resp.isSuccess) {
          toast.success(`${param.ColCaption} - thành công!`);
        } else {
          toast.error(`${param.ColCaption} - thất bại!`);
        }
      });

      Promise.all(listProcess).then((res) => res);
    });
  };

  const handleGenDTL = async () => {
    return;

    const result = ChiTietKhachHangTop.map((item: any) => {
      const found = listDynamic?.find(
        (c: any) => c.ColCaption == item.ColCaption
      );
      if (found) {
        return {
          ...item,
          ColCodeSys: found.ColCodeSys,
          ColCode: found.ColCode,
          OrgID: orgID,
          NetworkID: networkID,
        };
      }
      return {
        ...item,
        OrgID: orgID,
        NetworkID: networkID,
      };
    });

    const response = await api.MDMetaColGroupSpec_Save({
      screen: "SCRTCS.CTM.DTL.2023",
      data: result,
    });

    if (response.isSuccess) {
      toast.success(`Insert mã SCRTCS.CTM.DTL.2023 - thành công!`);
    } else {
      showError({
        message: response._strErrCode,
        _strErrCode: response._strErrCode,
        _strTId: response._strTId,
        _strAppTId: response._strAppTId,
        _objTTime: response._objTTime,
        _strType: response._strType,
        _dicDebug: response._dicDebug,
        _dicExcs: response._dicExcs,
      });
    }
  };

  const handleGenAdd = async () => {
    return;

    const result = TaoMoiKhachHang.map((item: any) => {
      const found = listDynamic?.find(
        (c: any) => c.ColCaption == item.ColCaption
      );
      if (found) {
        return {
          ...item,
          ColCodeSys: found.ColCodeSys,
          ColCode: found.ColCode,
          OrgID: orgID,
          NetworkID: networkID,
        };
      }
      return {
        ...item,
        OrgID: orgID,
        NetworkID: networkID,
      };
    }).filter((item: any) => item);

    // console.log(result);
    // return;

    const response = await api.MDMetaColGroupSpec_Save({
      screen: "SCRTPLCODESYS.2023",
      data: result,
    });

    if (response.isSuccess) {
      toast.success(`Insert mã SCRTPLCODESYS.2023 - thành công!`);
    } else {
      showError({
        message: response._strErrCode,
        _strErrCode: response._strErrCode,
        _strTId: response._strTId,
        _strAppTId: response._strAppTId,
        _objTTime: response._objTTime,
        _strType: response._strType,
        _dicDebug: response._dicDebug,
        _dicExcs: response._dicExcs,
      });
    }
  };

  const handleGenContact = async () => {
    return;

    const result = ChiTietKhachHangLieHe.map((item: any) => {
      const found = listDynamic?.find(
        (c: any) => c.ColCaption == item.ColCaption
      );
      if (found) {
        return {
          ...item,
          ColCodeSys: found.ColCodeSys,
          ColCode: found.ColCode,
          OrgID: orgID,
          NetworkID: networkID,
        };
      }
      return {
        ...item,
        OrgID: orgID,
        NetworkID: networkID,
      };
    }).filter((item: any) => item);

    // console.log(result);
    // return;

    const response = await api.MDMetaColGroupSpec_Save({
      screen: "SCRTCS.CTM.CONTACT.2023",
      data: result,
    });

    if (response.isSuccess) {
      toast.success(`Insert mã SCRTCS.CTM.CONTACT.2023 - thành công!`);
    } else {
      showError({
        message: response._strErrCode,
        _strErrCode: response._strErrCode,
        _strTId: response._strTId,
        _strAppTId: response._strAppTId,
        _objTTime: response._objTTime,
        _strType: response._strType,
        _dicDebug: response._dicDebug,
        _dicExcs: response._dicExcs,
      });
    }
  };

  return (
    <div className="p-2 flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <Input
          placeholder="Nhập NetworkID"
          style={{
            width: 300,
          }}
          onChange={(e: any) => {
            setNetworkID(e.target.value);
          }}
        />
        <Input
          placeholder="Nhập OrgID"
          style={{
            width: 300,
          }}
          onChange={(e: any) => {
            setOrgID(e.target.value);
          }}
        />
      </div>

      {orgID && networkID && (
        <>
          <Button
            onClick={handleGenTruongDong}
            style={{
              background: "#00703c",
              color: "#fff",
              padding: "10px 20px",
            }}
            width={400}
          >
            Gen tất cả trường động
          </Button>
          {listDynamic && (
            <Button
              onClick={handleGenDTL}
              style={{
                background: "#00703c",
                color: "#fff",
                padding: "10px 20px",
              }}
              width={400}
            >
              Gen mã màn - SCRTCS.CTM.DTL.2023
            </Button>
          )}
          {listDynamic && (
            <Button
              onClick={handleGenContact}
              style={{
                background: "#00703c",
                color: "#fff",
                padding: "10px 20px",
              }}
              width={400}
            >
              Gen mã màn - SCRTCS.CTM.CONTACT.2023
            </Button>
          )}
          {listDynamic && (
            <Button
              onClick={handleGenAdd}
              style={{
                background: "#00703c",
                color: "#fff",
                padding: "10px 20px",
              }}
              width={400}
            >
              Gen mã màn - SCRTPLCODESYS.2023
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default DemoExcel;

// const [translateData] = useAtom(localeAtom);

// const getTranslate = () => {
//   let obj = {};

//   const viPattern = /[^\x00-\x7F]/;
//   const enPattern = /^[a-zA-Z\s]+$/;

//   const result = Object.entries(translateData).reduce(
//     (prev: any, current: any) => {
//       const t = current?.[0];

//       let o: any = {};

//       const list = current?.[1]?.map((c: any) => {
//         // console.log(c);
//         if (enPattern.test(c.key) && enPattern.test(c.value)) {
//           o[`${String(c.key)}`] = c?.value;
//         }

//         // o[`${String(c.key)}`] = c?.value;
//       });

//       prev[`${String(t)}`] = o;

//       return prev;
//     },
//     {}
//   );

//   const jsonData = JSON.stringify(result);

//   // Create a Blob object
//   const blob = new Blob([jsonData], { type: "application/json" });

//   // Create a link element
//   const a = document.createElement("a");

//   // Set the download attribute with the desired filename
//   a.download = `demo.json`;

//   // Create a URL for the Blob and set it as the href attribute of the link
//   a.href = window.URL.createObjectURL(blob);

//   // Append the link to the document
//   document.body.appendChild(a);

//   // Trigger a click on the link to start the download
//   a.click();

//   // Remove the link from the document
//   document.body.removeChild(a);
// };
