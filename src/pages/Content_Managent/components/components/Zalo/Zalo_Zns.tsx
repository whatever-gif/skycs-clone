import { useI18n } from "@/i18n/useI18n";
import { requiredType } from "@/packages/common/Validation_Rules";

// import SelectBox from "devextreme-react/select-box";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  checkUIZNSAtom,
  dataFormAtom,
  idZNSAtom,
  valueIDAtom,
  valueIDZNSAtom,
  zaloTemplatetom,
} from "../../store";
import { useQuery } from "@tanstack/react-query";
import { useClientgateApi } from "@/packages/api";
import { SelectBox, TextBox } from "devextreme-react";
import { UiZNS } from "./UiZNS";
import UiZNSEdit from "./UiZNSEdit";

export default function Zalo_Zns({ formRef, dataForm }: any) {
  const { t } = useI18n("Zalo_Parent");
  const api = useClientgateApi();
  const zaloTemplate = useAtomValue(zaloTemplatetom);
  const idZNS = useAtomValue(idZNSAtom);
  const checkUiZNS = useAtomValue(checkUIZNSAtom);
  const { data: listMstBulletinType } = useQuery(["listMstSourceData"], () =>
    api.Mst_SourceData_GetAllActive()
  );

  const { data: templateZalo } = useQuery(
    ["templateZalo", dataForm?.Lst_Mst_SubmissionForm[0].IDZNS],
    () =>
      api.ZaloTemplate_GetByTemplateId(
        dataForm?.Lst_Mst_SubmissionForm[0].IDZNS
      )
  );
  useEffect(() => {
    formRef.current.instance.updateData("strJsonZNS", "{}");
  }, [idZNS]);

  const handleSave = (data: any) => {
    const dataNew = {
      ...data,
    };
    formRef.current.instance.updateData("strJsonZNS", dataNew);
  };

  return (
    <div className="flex justify-between px-5">
      <div className="w-[48.8%]">
        <div className="my-[20px] bg-lime-200 px-2 py-1 text-[14px]">
          {t("Cấu hình tham số Zalo ZNS")}
        </div>
        <div className="flex mb-3">
          <div className="w-[33.333%] ">{t("Tham số Zalo ZNS")}</div>
          <div className="w-[33.333%] pl-[12px]">{t("Nguồn dữ liệu")}</div>
          <div className="w-[33.333%] pl-[26px]">{t("Giá trị")}</div>
        </div>
        {checkUiZNS
          ? dataForm?.Lst_Mst_SubmissionFormZNS.map((item: any) => {
              return (
                <UiZNSEdit
                  onChange={handleSave}
                  item={item}
                  listMstBulletinType={listMstBulletinType?.DataList}
                />
              );
            })
          : zaloTemplate?.listParams?.map((item: any) => {
              return (
                <UiZNS
                  onChange={handleSave}
                  item={item}
                  listMstBulletinType={listMstBulletinType?.DataList}
                />
              );
            })}
      </div>
      <div className="w-[41%]">
        <div className="my-[20px] bg-lime-200 px-2 py-1 text-[14px] text-center">
          {t("Xem trước mẫu")}
        </div>
        <iframe
          className="overflow-hidden m-auto h-[350px]"
          src={
            checkUiZNS
              ? templateZalo?.Data?.previewUrl
              : zaloTemplate?.previewUrl
          }
          width="400px"
          height="auto"
        ></iframe>
      </div>
    </div>
  );
}
