import NavNetworkLink from "@/components/Navigate";
import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useNetworkNavigate } from "@/packages/hooks";
import { usePhone } from "@/packages/hooks/usePhone";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { showErrorAtom } from "@/packages/store";
import { Icon } from "@/packages/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, LoadPanel } from "devextreme-react";
import { Item, SimpleItem } from "devextreme-react/form";
import { useAtom, useSetAtom } from "jotai";
import { sortBy } from "lodash-es";
import { nanoid } from "nanoid";
import { forwardRef, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Customer_Tabs, { currentIndexAtom } from "./components/Customer_Tabs";
import "./style.scss";
export const CustomerPrimaryPage = () => {
  const api = useClientgateApi();
  const { t } = useI18n("Mst_Customer");
  const { t: common } = useI18n("Common");
  const formRef: any = useRef(null);
  const { auth } = useAuth();

  const params: any = useParams();
  const phone = usePhone();

  const handleCall = () => {
    const data = formRef.current.instance.option("formData");
    phone.call(data.CtmPhoneNo);
  };

  const { CustomerCodeSys: currentCustomerCodeSys } = params;

  const showError = useSetAtom(showErrorAtom);

  const { data: customer, isLoading } = useQuery({
    queryKey: ["CustomerInfo", currentCustomerCodeSys],
    queryFn: async () => {
      const resp: any = await api.Mst_Customer_GetByCustomerCode([
        currentCustomerCodeSys,
      ]);

      return resp?.Data;
    },
  });

  const { data: listCodeField, isLoading: isLoadingCodeField } = useQuery({
    queryKey: ["ListCodeFieldAbout"],
    queryFn: async () => {
      const response = await api.MdMetaColGroupSpec_Search(
        {
          ColGrpCodeSys: "COLGRPCODESYS.2023.01",
          FlagActive: 1,
        },
        "SCRTCS.CTM.DTL.2023"
      );
      if (response?.isSuccess) {
        const list = response?.DataList;
        const result =
          list?.map((item: any, index: number) => {
            return {
              ...item,
            };
          }) ?? [];
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
    },
  });

  const getListDynamic = useMemo(() => {
    if (!isLoadingCodeField && customer && customer?.Lst_Mst_Customer[0]) {
      const list = JSON.parse(customer?.Lst_Mst_Customer[0].JsonCustomerInfo);
      const listDynamic = listCodeField?.reduce((prev: any, cur: any) => {
        if (cur?.FlagIsColDynamic == "1") {
          prev[cur.ColCodeSys] =
            list?.find((item: any) => item.ColCodeSys == cur.ColCodeSys)
              ?.ColValue || customer?.Lst_Mst_Customer[0][cur.ColCodeSys];

          return prev;
        }
        return prev;
      }, {} as { [key: string]: any[] });

      return listDynamic;
    }
  }, [isLoadingCodeField, customer, listCodeField, isLoading]);

  // - loại khách hàng: CustomerType
  // - Mã khách hàng: CustomerCodeSys
  // - Tên khách hàng: CustomerName
  // - Điện thoại: CustomerPhoneJson
  // - Đối tượng: PartnerType
  // - Chức vụ: RepresentPosition
  // - Doanh nghiệp: Org_NNTFullName
  // - Email: CustomerEmailJson
  const getFormField = useMemo(() => {
    if (!isLoadingCodeField && customer && customer?.Lst_Mst_Customer[0]) {
      // console.log("memo ", customer);

      const listField = sortBy(listCodeField, ["OrderIdx"]);

      // console.log("listField ", listField);

      const customizeField = listField?.map((item) => {
        // console.log("item ", item);
        if (item.ColCodeSys === "CtmPhoneNo") {
          // console.log("item phone", item);
          return {
            dataField: item.ColCodeSys,
            label: {
              text: t(item.ColCaption),
            },
            editorType: "dxSelectBox",
            editorOptions: {
              dataSource: customer?.Lst_Mst_CustomerPhone ?? [],
              displayExpr: "CtmPhoneNo",
              valueExpr: "CtmPhoneNo",
              readOnly: true,
            },
            render: ({ component, dataField, editorOptions, name }: any) => {
              return (
                <div className="flex">
                  <Form labelMode="hidden" formData={formValue}>
                    <SimpleItem
                      dataField={dataField}
                      editorType="dxSelectBox"
                      editorOptions={{
                        onValueChanged: (param: any) => {
                          component.updateData(dataField, param.value);
                        },
                        defaultValue: customer?.Lst_Mst_CustomerPhone.length
                          ? customer?.Lst_Mst_CustomerPhone[0]?.CtmPhoneNo ?? ""
                          : "",
                        // readOnly: true,
                        dataSource: customer?.Lst_Mst_CustomerPhone ?? [],
                        displayExpr: "CtmPhoneNo",
                        valueExpr: "CtmPhoneNo",
                      }}
                    ></SimpleItem>
                  </Form>
                  <PermissionContainer
                    permission={"BTN_CUSTOMER_DTLCUSTOM_CALL"}
                  >
                    <Button
                      style={{
                        background: "#00703c",
                        color: "white",
                        // padding: "10px 20px",
                        marginLeft: "5px",
                      }}
                      onClick={handleCall}
                    >
                      <Icon name="phoneIcon"></Icon>
                    </Button>
                  </PermissionContainer>
                </div>
              );
            },
          };
        }
        if (item.ColCodeSys === "CtmEmail") {
          return {
            dataField: item.ColCodeSys,
            label: {
              text: t(item.ColCaption),
            },
            editorType: "dxSelectBox",
            editorOptions: {
              dataSource: customer?.Lst_Mst_CustomerEmail ?? [],
              displayExpr: "CtmEmail",
              valueExpr: "CtmEmail",
              readOnly: true,
            },
            render: ({ component, dataField, editorOptions, name }: any) => {
              return (
                <>
                  {customer?.Lst_Mst_CustomerEmail?.length > 0 ? (
                    <div className="flex">
                      <Form labelMode="hidden" formData={formValue}>
                        <SimpleItem
                          dataField={dataField}
                          editorType="dxSelectBox"
                          editorOptions={{
                            readOnly: false,
                            onValueChanged: (param: any) => {
                              component.updateData(dataField, param.value);
                            },
                            defaultValue: customer?.Lst_Mst_CustomerEmail.length
                              ? customer?.Lst_Mst_CustomerEmail[0]?.CtmEmail ??
                                ""
                              : "",
                            // readOnly: true,
                            dataSource: customer?.Lst_Mst_CustomerEmail ?? [],
                            displayExpr: "CtmEmail",
                            valueExpr: "CtmEmail",
                          }}
                        ></SimpleItem>
                      </Form>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              );
            },
          };
        } else {
          return {
            dataField: item.ColCodeSys,
            label: {
              text: t(item.ColCaption),
            },
            editorType: "dxTextBox",
            editorOptions: {
              readOnly: true,
            },
          };
        }
      });
      return customizeField;
    } else {
      return [];
    }
  }, [isLoadingCodeField, customer, listCodeField, isLoading]);
  console.log("getFormField ", getFormField);
  const navigate: any = useNetworkNavigate();

  const handleEdit = () => {
    navigate(`/customer/edit/${currentCustomerCodeSys}/direct`);
  };

  const handleDelete = async () => {
    const deleteConfirm = confirm(
      `Bạn có muốn xóa khách hàng ${currentCustomerCodeSys} không?`
    );

    if (deleteConfirm) {
      const response = await api.Mst_Customer_Delete({
        OrgID: auth?.orgData?.Id,
        CustomerCodeSys: currentCustomerCodeSys,
        NetworkID: auth?.networkId,
      });
      if (response.isSuccess) {
        toast.success(t("Delete Success"));
        navigate(`/customer/list`);
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

  const formValue = {
    ...getListDynamic,
    ...customer?.Lst_Mst_Customer[0],
    CtmEmail: customer?.Lst_Mst_CustomerEmail
      ? customer?.Lst_Mst_CustomerEmail.length
        ? customer?.Lst_Mst_CustomerEmail[0].CtmEmail
        : ""
      : "",
    //  customer?.Lst_Mst_CustomerEmail ?? [],
    CtmPhoneNo: customer?.Lst_Mst_CustomerPhone
      ? customer?.Lst_Mst_CustomerPhone.length
        ? customer?.Lst_Mst_CustomerPhone.find(
            (item: any) => item.FlagDefault === "1"
          )?.CtmPhoneNo ?? ""
        : ""
      : "",
    PartnerType:
      customer?.Lst_Mst_CustomerInPartnerType?.map(
        (item: any) => item?.mpt_PartnerTypeName
      ) ?? [],
    CustomerType: customer?.Lst_Mst_Customer[0]?.mct_CustomerTypeName ?? "",
    CustomerCodeSysERP: customer?.Lst_Mst_Customer[0]?.mcerp_CustomerName ?? "",
  };

  const [currentIndex] = useAtom(currentIndexAtom);

  return (
    <AdminContentLayout className={"province-management customer-detail"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header flex justify-between items-center w-full px-2 py-3">
          <div className="breakcrumb flex gap-1">
            <NavNetworkLink to="/customer" className="text-black">
              {t("Customer")}
            </NavNetworkLink>
            <p>{`>`}</p>
            <p>{t("Info's Detail Customer")}</p>
          </div>
          <div className="flex gap-3">
            <PermissionContainer permission={"BTN_CUSTOMER_DTLCUSTOM_EDIT"}>
              <Button
                onClick={handleEdit}
                style={{
                  background: "#00703c",
                  color: "white",
                  padding: "10px 20px",
                }}
              >
                {common("Edit")}
              </Button>
            </PermissionContainer>

            {currentIndex == 4 && (
              <PermissionContainer
                permission={"BTN_CUSTOMER_DTLCUSTOM_TABDTL_DELETE"}
              >
                <Button
                  style={{
                    padding: "10px 20px",
                  }}
                  onClick={handleDelete}
                >
                  {common("Delete")}
                </Button>
              </PermissionContainer>
            )}
          </div>
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <LoadPanel
          container={".dx-viewport"}
          shadingColor="rgba(0,0,0,0.4)"
          position={"center"}
          visible={false}
          showIndicator={true}
          showPane={true}
        />
        <div className="flex gap-3 items-center py-2 pl-[50px]">
          <div
            className="overflow-hidden h-[120px] w-[120px] shadow-lg"
            style={{ borderRadius: "50%" }}
          >
            <div className="h-full w-full">
              <img
                alt=""
                className="w-full h-full object-cover"
                src={
                  customer?.Lst_Mst_Customer[0]?.CustomerAvatarPath ??
                  "https://tse2.mm.bing.net/th?id=OIP.udoq18uxDpu6UHi2H__97gAAAA&pid=Api&P=0&h=180"
                }
              />
              {/* <input type="file" ref={imgRef} hidden onChange={onFileChange} /> */}
            </div>
          </div>
          {listCodeField && customer && (
            <CustomerContent
              customer={customer}
              listCodeField={listCodeField}
              formField={getFormField}
              listDynamic={getListDynamic}
              ref={formRef}
              formValue={formValue}
            />
          )}
        </div>
        <Customer_Tabs />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

const CustomerContent = forwardRef(
  (
    { customer, listCodeField, formField, listDynamic, formValue }: any,
    ref: any
  ) => {
    return (
      <form className="pt-[20px] form-customer">
        <Form
          ref={ref}
          className="form-customer-content"
          formData={formValue}
          validationGroup="customerData"
          showValidationSummary={true}
          labelMode="outside"
          labelLocation="left"
          colCount={2}
        >
          {formField.map((item: any, index: number) => {
            if (item.dataField == "CtmPhoneNo") {
              return <Item {...item} key={nanoid()} />;
            }
            return <Item {...item} disabled key={nanoid()} />;
          })}
        </Form>
      </form>
    );
  }
);
