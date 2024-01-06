import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useAuth } from "@/packages/contexts/auth";
import { showErrorAtom } from "@/packages/store";
import { ColumnOptions } from "@/packages/ui/base-gridview";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, LoadPanel, Popup } from "devextreme-react";
import { ToolbarItem } from "devextreme-react/data-grid";
import { SimpleItem } from "devextreme-react/form";
import { useAtomValue, useSetAtom } from "jotai";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { dataRowAtom, popupVisibleAtom } from "../store";
import "./style.scss";
interface Props {
  onCancel: () => void;
  onSave?: () => void;
}

interface PayloadInterface {
  TicketID: string;
  OrgIDNew: string;
  DepartmentCode: string;
  AgentCode: string;
}

const index = ({ onCancel, onSave }: Props) => {
  const { t } = useI18n("Eticket_Manager_In_Charge_Of_Tranfer");
  const formRef: any = useRef<Form>(null);
  const api = useClientgateApi();
  const popupVisible = useAtomValue(popupVisibleAtom);
  const dataRow = useAtomValue(dataRowAtom);
  const { auth } = useAuth();
  const showError = useSetAtom(showErrorAtom);
  const [org, setOrg] = useState(
    auth.orgData?.Id ? auth.orgData?.Id.toString() : ""
  );
  const [formPayload, setFormPayload] = useState<Partial<PayloadInterface>>({
    OrgIDNew: auth.orgData?.Id ? auth.orgData?.Id.toString() : "",
  });
  const [department, setDepartment] = useState("");

  useEffect(() => {
    return () => {
      setDepartment("");
      setOrg(auth.orgData?.Id ? auth.orgData?.Id.toString() : "");
      setFormPayload({
        OrgIDNew: auth.orgData?.Id ? auth.orgData?.Id.toString() : "",
      });
    };
  }, []);

  const { data: getListDepartment, isLoading: isLoadingListDepartment } =
    useQuery({
      queryKey: ["Mst_DepartmentControl_GetByOrgID", org],
      queryFn: async () => {
        if (org !== "") {
          const response = await api.Mst_DepartmentControl_GetByOrgID(org);
          if (response.isSuccess) {
            const v = response?.Data?.Lst_Mst_Department ?? [];
            const result = v.filter((i) => {
              return i.FlagActive === "1";
            });
            return result;
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
            return [];
          }
        } else {
          return [];
        }
      },
    });

  const { data: getListOrg, isLoading: isLoadingListOrg } = useQuery({
    queryKey: ["Mst_NNTController_GetMSTForETicket"],
    queryFn: async () => {
      const response = await api.Mst_NNTController_GetMSTForETicket();
      if (response.isSuccess) {
        return response.Data
          ? response.Data.filter((item) => item.FlagActive === "1")
          : [];
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
        return [];
      }
    },
  });

  // const { data, isLoading, refetch } = useQuery({
  //   queryKey: [""],
  //   queryFn: async () => {
  //     const response = await api.Mst_Customer_Search(formValue);
  //     if (response.isSuccess) {
  //       return response.DataList;
  //     } else {
  //       showError({
  //         message: (response.errorCode),
  //         debugInfo: response.debugInfo,
  //         errorInfo: response.errorInfo,
  //       });
  //     }
  //   },
  // });
  const { data: getListAgent, isLoading: isLoadingListAgent } = useQuery({
    queryKey: ["Mst_DepartmentControl_GetByDepartmentCode", department, org],
    queryFn: async () => {
      if (department !== "" && org !== "") {
        const response = await api.Mst_DepartmentControl_GetByDepartmentCode(
          department,
          org
        );
        if (response.isSuccess) {
          return response?.Data?.Lst_Sys_UserMapDepartment;
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
          return [];
        }
      } else {
        return [];
      }
    },
  });

  const array: ColumnOptions[] = useMemo(() => {
    return [
      {
        dataField: "OrgIDNew",
        caption: t("OrgIDNew"),
        editorType: "dxSelectBox",
        label: {
          text: t("OrgIDNew"),
        },
        editorOptions: {
          dataSource: getListOrg ?? [],
          displayExpr: "NNTFullName",
          valueExpr: "OrgID",
          onValueChanged: (param: any) => {
            setOrg(param.value);
            setDepartment("");
            if (formRef.current) {
              formRef.current.instance.updateData("DepartmentCode", "");
              formRef.current.instance.updateData("AgentCode", "");
            }
          },
        },
        validationRules: [requiredType],
      },
      {
        dataField: "DepartmentCode",
        caption: t("DepartmentCode"),
        editorType: "dxSelectBox",
        label: {
          text: t("DepartmentCode"),
        },
        editorOptions: {
          dataSource: getListDepartment ?? [],
          valueExpr: "DepartmentCode",
          displayExpr: "DepartmentName",
          onValueChanged: (param: any) => {
            setDepartment(param.value);
            if (formRef.current) {
              formRef.current.instance.updateData("AgentCode", "");
            }
          },
        },
        validationRules: [requiredType],
      },
      {
        dataField: "AgentCode",
        caption: t("AgentCode"),
        editorType: "dxSelectBox",
        label: {
          text: t("AgentCode"),
        },
        editorOptions: {
          dataSource: getListAgent ?? [],
          valueExpr: "UserCode",
          displayExpr: "FullName",
        },
      },
    ];
  }, [
    isLoadingListOrg,
    isLoadingListAgent,
    isLoadingListDepartment,
    department,
    org,
  ]);

  const handleSave = async () => {
    const resp = formRef.current.instance.validate();
    if (resp.isValid) {
      const obj = {
        TicketID: dataRow[0].TicketID,
        OrgIDNew: formPayload?.OrgIDNew ?? "",
        DepartmentCode: formPayload?.DepartmentCode ?? "",
        AgentCode: formPayload?.AgentCode ?? "",
      };

      const response = await api.ET_Ticket_UpdateAgentCode(obj);
      if (response.isSuccess) {
        toast.success(t("ET_Ticket_UpdateAgentCode success!"));
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
    }
  };

  return (
    <Popup
      className="popup"
      position={"center"}
      showCloseButton={true}
      onHiding={onCancel}
      title={t(`In_Charge_Of_Tranfer`)}
      width={700}
      height={350}
      visible={popupVisible}
    >
      <LoadPanel
        visible={
          isLoadingListOrg || isLoadingListAgent || isLoadingListDepartment
        }
        showIndicator={true}
        showPane={true}
        container={".dx-viewport"}
        shadingColor="rgba(0,0,0,0.4)"
      />
      <div className="popup-content" style={{ height: 230 }}>
        <div className="tag flex items-center justify-between mb-4">
          <div className="left">
            <p className="strong">
              {dataRow.length &&
                t(
                  `Hộ trợ tạo phụ trách cho khách hàng ${dataRow[0].CustomerCodeSys}`
                )}
            </p>
          </div>
          <div className="right">
            {dataRow.length && <p>{dataRow[0].TicketID}</p>}
          </div>
        </div>
        <div className="form">
          <Form
            formData={formPayload}
            ref={formRef}
            labelLocation="left"
            // showRequiredMark={true}
            validationGroup="form-Change-Of-Tranfer"
            className="form-transformCustomer flex items-center"
          >
            {array.map((item: any, index: number) => {
              return <SimpleItem key={`t-${index}`} {...item} />;
            })}
          </Form>
        </div>
      </div>
      <ToolbarItem toolbar={"bottom"} location={"after"}>
        <Button
          text={t("Save")}
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
