import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useAuth } from "@/packages/contexts/auth";
import { useConfiguration } from "@/packages/hooks";
import { showErrorAtom } from "@/packages/store";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, LoadPanel, Popup, RadioGroup } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";
import { SimpleItem } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { memo, useCallback, useReducer, useRef, useState } from "react";
import { toast } from "react-toastify";
import { dataRowAtom, popupCustomerVisibleAtom } from "../store";
import "./style.scss";
interface Props {
  onCancel: () => void;
  onSave?: () => void;
}

const index = ({ onCancel, onSave }: Props) => {
  const { t } = useI18n("Eticket_Manager_TransformCustomer");
  const formRef: any = useRef(null);
  const api = useClientgateApi();
  const config = useConfiguration();
  const popupVisible = useAtomValue(popupCustomerVisibleAtom);

  const dataRow = useAtomValue(dataRowAtom);

  const [customer, setCustomer] = useState("");
  const [loadingKey, reloading] = useReducer(() => {
    return nanoid();
  }, "0");

  const { auth } = useAuth();
  const showError = useSetAtom(showErrorAtom);
  const [formValue, setFormValue] = useState({
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    OrgId: auth.orgData?.Id,
    KeyWord: "",
  });
  const {
    data: listCustomer,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Mst_Customer_Search", loadingKey],
    queryFn: async () => {
      if (loadingKey !== "0") {
        const response = await api.Mst_Customer_Search(formValue);
        if (response.isSuccess) {
          setCustomer("");
          return response.DataList;
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
      } else {
        return [];
      }
    },
  });

  const handleSave = useCallback(async () => {
    if (customer !== "") {
      const obj = {
        TicketID: dataRow[0].TicketID,
        // CustomerCodeSys: dataRow[0].CustomerCodeSys,
        CustomerCodeSys: customer,
        // Lst_ET_TicketCustomer: [
        //   {
        //     CustomerCodeSys: customer,
        //   },
        // ],
      };
      const response = await api.ET_Ticket_UpdateCustomer(obj);
      if (response.isSuccess) {
        toast.success(t("ET_Ticket_UpdateCustomer success! "));
        onCancel();
        onSave?.();
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
    } else {
      toast.error(t("Please select customer!"));
    }
  }, [customer]);

  const onSearch = () => {
    const { isValid } = formRef.current.instance.validate();
    if (isValid || (formValue?.KeyWord && formValue?.KeyWord !== "")) {
      reloading();
      refetch();
    } else {
      toast.error(t("Please input keyword"));
    }
  };

  const handleChange = (item: any) => {
    setCustomer(item.value);
  };

  return (
    <Popup
      className="popup-tranfer-customer"
      position={"center"}
      showCloseButton={true}
      onHiding={onCancel}
      title={t(`Transform-Customer`)}
      width={700}
      height={400}
      visible={popupVisible}
    >
      <LoadPanel
        visible={isLoading}
        showIndicator={true}
        showPane={true}
        container={".dx-viewport"}
        shadingColor="rgba(0,0,0,0.4)"
      />
      <div
        className="popup-tranfer-customer-content popup-content overflow-hidden"
        style={{
          overflow: "hidden !important",
        }}
      >
        <div className="tag flex items-center justify-between mb-4">
          <div className="left">
            {dataRow.length && (
              <p className="strong">{dataRow[0]?.TicketName}</p>
            )}

            {dataRow.length && (
              <p>{`${dataRow[0]?.CustomerName ?? ""} - ${
                dataRow[0]?.CustomerCode
              }`}</p>
            )}
          </div>
          <div className="right">
            {dataRow.length && <p>{`${dataRow[0].TicketID}`}</p>}
            {dataRow.length && (
              <p>
                {t("Phone: ")}
                {`${dataRow[0].CustomerPhoneNo ?? ""}`}
              </p>
            )}
          </div>
        </div>
        <div className="form">
          <p className="mb-1 font-semibold">{t("Info of new Customer")}</p>
          <div className="flex items-center">
            <Form
              colCount={1}
              labelMode="hidden"
              formData={formValue}
              ref={formRef}
              showRequiredMark={true}
              validationGroup="form-transformCustomer"
              className="form-transformCustomer flex items-center"
            >
              <SimpleItem
                dataField={"KeyWord"}
                validationRules={[requiredType]}
                editorOptions={{
                  placeholder: t("Search..."),
                }}
              />
            </Form>

            <Button
              type={"default"}
              stylingMode={"contained"}
              onClick={onSearch}
              className="ml-1"
              text={t("Search")}
            />
          </div>
          {loadingKey !== "0" && listCustomer?.length ? (
            <RadioGroup
              items={listCustomer ?? []}
              valueExpr={"CustomerCodeSys"}
              onValueChanged={(item) => handleChange(item)}
              itemRender={(item: any) => {
                const lstPhoneNo = JSON.parse(item?.CustomerPhoneJson ?? "[]");

                const resultPhone =
                  lstPhoneNo?.find((c: any) => c?.FlagDefault == "1")
                    ?.CtmPhoneNo ?? "---";

                const lstEmailNo = JSON.parse(item?.CustomerEmailJson ?? "[]");

                const resultEmail =
                  lstEmailNo?.find((c: any) => c?.FlagDefault == "1")
                    ?.CtmEmail ?? "---";

                return (
                  <div
                    className="flex items-center justify-between mb-2 w-full bg-[#FAFAFA] 
                  shadow-sm min-w-full h-full px-1 rounded-[5px] hover:bg-[#EAF9F2] hover:shadow-xl"
                  >
                    <div className="w-full flex flex-col gap-1">
                      <p className="font-semibold">
                        {item?.CustomerName} - {item?.CustomerCode}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <p>{t("ContactPhone")}:</p>{" "}
                          <p className="font-semibold">{resultPhone}</p>
                        </span>
                        <span className="flex items-center gap-1">
                          <p>{t("ContactEmail")}:</p>{" "}
                          <p className="font-semibold">{resultEmail}</p>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          ) : (
            <div className="min-h-[100px] mt-1 font-semibold flex items-center justify-center">
              {t("No data")}
            </div>
          )}
        </div>
      </div>
      <ToolbarItem toolbar={"bottom"} location={"after"}>
        <Button
          text={t("Save")}
          disabled={customer === ""}
          type={"default"}
          stylingMode={"contained"}
          onClick={handleSave}
        />
        <Button
          text={t("Close")}
          stylingMode={"contained"}
          onClick={onCancel}
        />
      </ToolbarItem>
    </Popup>
  );
};

export default memo(index);
