import PermissionContainer from "@/components/PermissionContainer";
import { useNetworkNavigate } from "@/components/useNavigate";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useAuth } from "@/packages/contexts/auth";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { showErrorAtom } from "@/packages/store";
import { Icon } from "@/packages/ui/icons";
import { TextboxField } from "@/pages/admin/custom-field/components/textbox-field";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, List, Switch, TextBox } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { ItemDragging } from "devextreme-react/list";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./../../style.scss";
import {
  ListInfoDetailCampaignValue,
  dataComponent,
  defaultValue,
  flagSelection,
  popupVisibleAtom,
} from "./../store";
import { EditForm } from "./PopUp";

const Customize = () => {
  const api = useClientgateApi();
  const { auth } = useAuth();
  const param: any = useParams();
  const navigate = useNetworkNavigate();
  const { data: listDataType, isLoading: isLoadingDataType } = useQuery({
    queryFn: async () => {
      const resp = await api.MDMetaColumnDataType_GetAllActive();
      if (resp.isSuccess) {
        return resp.DataList;
      }
      return [];
    },
    queryKey: ["MdMetaColDataTypeApi"],
  });

  const refSubmitButton = useRef<HTMLButtonElement>(null);
  const formRef = useRef(null);
  const flagSelecter = useAtomValue(flagSelection);
  const getDefaultValue = useAtomValue(defaultValue);
  const setListValue = useSetAtom(ListInfoDetailCampaignValue);
  const listValue = useAtomValue(ListInfoDetailCampaignValue);
  const setFlagSelector = useSetAtom(flagSelection);
  const dataRow = useAtomValue(dataComponent);
  const setDataRow = useSetAtom(dataComponent);
  const showError = useSetAtom(showErrorAtom);
  const setVisiable = useSetAtom(popupVisibleAtom);
  const { t } = useI18n("Mst_CampaignType_Info");
  const {
    register,
    watch,
    getValues,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      Enabled: true,
      IsRequired: true,
      FlagIsNotNull: "1",
      IsSearchable: true,
      FlagIsQuery: "1",
      FlagActive: true,
      IsUnique: true,
      FlagIsCheckDuplicate: "1",
      ...dataRow,
    },
    values: dataRow as any,
  });

  console.log("dataRow ", dataRow);

  const handleSave = (): void => {
    triggerSubmit();
  };

  const triggerSubmit = () => {
    refSubmitButton?.current?.click();
  };

  const choiceValues = watch("Lst_Mst_CustomerFeedBack");
  const {
    data: listCampaign,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Mst_CampaignColumnConfig_GetAllActive"],
    queryFn: async () => {
      const response = await api.Mst_CampaignColumnConfig_GetAllActive();
      if (response.isSuccess) {
        return response?.DataList;
      } else {
        // showError({
        // });
      }
    },
  });

  const onsubmit = async (data: any) => {
    const obj = {
      ...data,
      listValueInfo: listValue,
    };
    // case add
    const buildParam: any = {
      Mst_CampaignType: {
        NetworkID: auth.networkId,
        CampaignTypeCode: obj.CampaignTypeCode ?? "",
        // CampaignTypeCode: obj.CampaignTypeCode,
        CampaignTypeName: obj.CampaignTypeName,
        CampaignTypeDesc: obj.CampaignTypeDesc,
        OrgID: auth.orgData?.Id,
      },
      Lst_Mst_CustomColumnCampaignType: listValue.map(
        (item: any, index: number) => {
          const result = {
            ...item,
            CampaignColCfgCodeSys: item.CampaignColCfgCodeSys,
            OrgID: item.OrgID,
            FlagRequired:
              item.FlagRequired && item.FlagRequired !== "0" ? "1" : "0",
            Idx: index,
          };

          delete result.listOption;
          delete result.ListOption;

          return result;
        }
      ),
      Lst_Mst_CustomerFeedBack: obj.Lst_Mst_CustomerFeedBack.map(
        (item: any, index: number) => {
          return {
            ...item,
            OrgID: auth.orgData?.Id,
            CusFBName: item.Value,
            CusFBCode: index,
          };
        }
      ),
    };

    if (flagSelecter === "add") {
      const responese = await api.Mst_CampaignType_Create(buildParam);
      if (responese.isSuccess) {
        toast.success("Create Campaign");
        setListValue([]);
        setDataRow(getDefaultValue);
        reset();
        handleCancel();
      } else {
        showError({
          message: responese._strErrCode,
          _strErrCode: responese._strErrCode,
          _strTId: responese._strTId,
          _strAppTId: responese._strAppTId,
          _objTTime: responese._objTTime,
          _strType: responese._strType,
          _dicDebug: responese._dicDebug,
          _dicExcs: responese._dicExcs,
        });
      }
    } else {
      const responese = await api.Mst_CampaignType_Update(buildParam);
      if (responese.isSuccess) {
        toast.success(t("Update Campaign"));
        handleCancel();
      } else {
        showError({
          message: responese._strErrCode,
          _strErrCode: responese._strErrCode,
          _strTId: responese._strTId,
          _strAppTId: responese._strAppTId,
          _objTTime: responese._objTTime,
          _strType: responese._strType,
          _dicDebug: responese._dicDebug,
          _dicExcs: responese._dicExcs,
        });
      }
    }
  };

  const {
    fields: singleChoiceValuesFields,
    append,
    remove,
  } = useFieldArray<any>({
    name: "Lst_Mst_CustomerFeedBack",
    control: control,
  });

  const { data: dataItem, isLoading: isLoadingDataItem } = useQuery({
    queryKey: ["Mst_CampaignTypeDetail", param],
    queryFn: async () => {
      if (param?.id) {
        setFlagSelector("update");
        const response = await api.Mst_CampaignType_GetByCode(
          param.id,
          auth.orgData?.Id ?? ""
        );
        if (response.isSuccess) {
          const data: any = response.Data;
          const obj = {
            ...data,
            ...data?.Lst_Mst_CampaignType[0],
            Lst_Mst_CustomerFeedBack: data.Lst_Mst_CustomerFeedBack.map(
              (item: any) => {
                return {
                  ...item,
                  Value: item.CusFBName,
                };
              }
            ),
          };
          let listValue = data?.Lst_Mst_CustomColumnCampaignType ?? [];
          listValue = listValue.filter((i: any) => i.CampaignColCfgCodeSys);
          setDataRow(obj);
          setListValue(listValue);
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
        setFlagSelector("add");
        setDataRow(getDefaultValue);
        setListValue([]);
      }
    },
  });

  const canAddMore = (choiceValues: any) => {
    return (
      !choiceValues ||
      choiceValues.every((item: any) => {
        return item.Value !== "" && !!item.Value;
      })
    );
  };
  useEffect(() => {
    if (flagSelecter === "add") {
      setListValue([]);
      setDataRow(getDefaultValue);
      reset();
    }
    if (flagSelecter === "update") {
      // setFormValue({});
    }
  }, [flagSelecter]);

  const handleReorder = (e: any) => {
    const list = [...listValue];
    const getItem = list[e.fromIndex];
    // console.log("e. ", e.toIndex, "form ", e.fromIndex);
    if (e.toIndex <= e.fromIndex) {
      list.splice(e.toIndex, 0, getItem);
      list.splice(e.fromIndex, 0);
      const lastValue = list.filter((item, index) => {
        return index !== e.fromIndex + 1;
      });
      // console.log("min ", lastValue);
      setListValue(lastValue);
      return;
    } else {
      list.splice(e.toIndex + 1, 0, getItem);
      list.splice(e.fromIndex, 0);
      const lastValue = list.filter((item, index) => {
        return index !== e.fromIndex;
      });
      // console.log("max ", lastValue);
      setListValue(lastValue);
      return;
    }
  };

  const handleCancel = () => {
    navigate("admin/Mst_CampaignTypePage");
  };

  const navigateBack = () => {
    navigate("admin/Mst_CampaignTypePage");
  };

  return (
    <AdminContentLayout>
      <AdminContentLayout.Slot name={"Header"}>
        <div className="header p-2 flex items-center w-full justify-between">
          <div className="breakcrumb">
            <p
              className="hover:underline cursor-pointer hover:text-[#00703c]"
              onClick={navigateBack}
            >
              {t("Mst_CampaignType")}
            </p>
            <p className="pl-1 pr-1">{`>`}</p>
            <p>
              {flagSelecter === "add"
                ? t("Add CampaignType")
                : t("Update CampaignType")}
            </p>
          </div>
          <div className="list-button">
            {param?.flag !== "detail" && (
              <PermissionContainer
                permission={
                  param?.flag == "add"
                    ? "BTN_ADMIN_CAMPAIGN_TYPE_CREATE_SAVE"
                    : "BTN_ADMIN_CAMPAIGN_TYPE_UPDATE_SAVE"
                }
              >
                <Button
                  className="mr-1"
                  onClick={handleSave}
                  type={"default"}
                  stylingMode={"contained"}
                  text={t("Save")}
                ></Button>
              </PermissionContainer>
            )}

            {param?.flag === "detail" && (
              <Button
                className="mr-1"
                onClick={() => {
                  navigate(
                    `admin/Mst_CampaignTypePage/Customize/update/${param?.id}`
                  );
                }}
                type={"default"}
                stylingMode={"contained"}
                text={t("Edit")}
              ></Button>
            )}

            <PermissionContainer
              permission={
                param?.flag == "add"
                  ? "BTN_ADMIN_CAMPAIGNTYPE_CREATE_CANCEL"
                  : param?.flag == "update"
                  ? "BTN_ADMIN_CAMPAIGN_TYPE_UPDATE_CANCEL"
                  : "BTN_ADMIN_CAMPAIGN_TYPE_DETAIL_CANCEL"
              }
            >
              <Button
                className="mr-1"
                onClick={handleCancel}
                type={"default"}
                stylingMode={"contained"}
                text={t("Cancel")}
              ></Button>
            </PermissionContainer>
          </div>
        </div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div className="container-content">
          <form ref={formRef} id="editForm" onSubmit={handleSubmit(onsubmit)}>
            <Controller
              name={"CampaignTypeName"}
              control={control}
              render={({ field }) => {
                return (
                  <TextboxField
                    field={field}
                    disabled={param?.flag === "detail"}
                    label={t("CampaignTypeName")}
                    required={true}
                    error={errors.CampaignTypeName}
                  />
                );
              }}
              rules={{
                required: {
                  value: true,
                  message: "CampaignTypeNameIsRequired",
                },
              }}
            />
            <Controller
              name={"CampaignTypeDesc"}
              control={control}
              render={({ field }) => {
                return (
                  <TextboxField
                    field={field}
                    disabled={param?.flag === "detail"}
                    label={t("CampaignTypeDesc")}
                    error={errors.CampaignTypeDesc}
                  />
                );
              }}
            />
            <Controller
              name={"FlagActive"}
              control={control}
              render={({ field }) => {
                const { ref, onChange, ...restField } = register("FlagActive");
                console.log("getValues ", getValues("FlagActive"));

                return (
                  <Switch
                    ref={ref}
                    {...restField}
                    readOnly={param?.flag === "detail"}
                    value={getValues("FlagActive")}
                    onValueChange={field.onChange}
                    switchedOffText={t("Inactive")}
                    switchedOnText={t("Active")}
                    defaultValue={true}
                    // isValid={false}
                  />
                );
              }}
            />
            <div className={"w-full"}>
              <p>{t("Response of customer")}</p>
              <Controller
                name={"Lst_Mst_CustomerFeedBack"}
                control={control}
                render={({ field }) => {
                  return (
                    <div className={"w-full"}>
                      {singleChoiceValuesFields.map((field, index) => {
                        // console.log("field ,", field);
                        const { ref, onChange, ...restField } = register(
                          `Lst_Mst_CustomerFeedBack.${index}.Value` as const,
                          {
                            required: true,
                          }
                        );
                        const {
                          onChange: onDefaultChange,
                          ...restDefaultField
                        } = register(
                          `Lst_Mst_CustomerFeedBack.${index}.IsSelected` as const,
                          {}
                        );
                        return (
                          <div
                            key={field.id}
                            className={"flex items-center my-2"}
                          >
                            <TextBox
                              ref={ref}
                              {...restField}
                              disabled={param?.flag === "detail"}
                              defaultValue={field?.Value ?? ""}
                              value={
                                getValues(
                                  `Lst_Mst_CustomerFeedBack.${index}.Value`
                                ) ?? ""
                              }
                              onValueChanged={async (e: any) => {
                                await onChange({
                                  target: {
                                    name: restField.name,
                                    value: e.value,
                                  },
                                });
                              }}
                              validationMessageMode={"always"}
                              isValid={
                                !errors.Lst_Mst_CustomerFeedBack?.[index]
                              }
                            />
                            <Button
                              onClick={() => remove(index)}
                              stylingMode={"text"}
                              disabled={param?.flag === "detail"}
                            >
                              <Icon
                                name={"trash"}
                                size={14}
                                color={"#ff5050"}
                              />
                            </Button>
                          </div>
                        );
                      })}
                      <Button
                        type={"default"}
                        stylingMode={"text"}
                        hoverStateEnabled={false}
                        activeStateEnabled={false}
                        focusStateEnabled={false}
                        onClick={() =>
                          append({
                            Value: "",
                            IsSelected: false,
                            id: "",
                          })
                        }
                        disabled={
                          !canAddMore(choiceValues) || param?.flag === "detail"
                        }
                        className={"flex items-center"}
                      >
                        <Icon name={"plus"} size={20} />
                        <span className={"mx-2"}>{t("Add New")}</span>
                      </Button>
                    </div>
                  );
                }}
              />
            </div>
            <button
              hidden={true}
              ref={refSubmitButton}
              type={"submit"}
              form={"editForm"}
            />
          </form>
          <div className="w-full">
            <p>{t("Information's campaing customize")}</p>
            <List
              className="list-campaign-type"
              dataSource={listValue}
              itemRender={(item) => {
                // console.log("item ", item);

                return (
                  <div className={"w-full flex flex-column items-center"}>
                    <Form
                      colCount={1}
                      className="detail-info-campaign"
                      formData={item}
                      // showValidationSummary={true}
                      validationGroup="customerData"
                    >
                      <GroupItem caption="" alignItemLabels={true}>
                        <SimpleItem
                          dataField=""
                          render={() => {
                            return (
                              <Button
                                onClick={() => {
                                  const newValue = listValue.filter(
                                    (itemValue: any) =>
                                      itemValue.CampaignColCfgCodeSys !==
                                      item.CampaignColCfgCodeSys
                                  );
                                  setListValue(newValue);
                                }}
                                stylingMode={"text"}
                              >
                                <Icon
                                  name={"trash"}
                                  color={"#ff0000"}
                                  size={10}
                                />
                              </Button>
                            );
                          }}
                        ></SimpleItem>
                        <SimpleItem
                          dataField="CampaignColCfgName"
                          editorType="dxTextBox"
                          validationRules={[requiredType]}
                          editorOptions={{
                            disabled: true,
                          }}
                        />
                        <SimpleItem
                          dataField="CampaignColCfgDataType"
                          editorType="dxSelectBox"
                          validationRules={[requiredType]}
                          editorOptions={{
                            dataSource: listDataType,
                            displayExpr: "ColDataTypeDesc",
                            valueExpr: "ColDataType",
                            disabled: true,
                          }}
                        ></SimpleItem>
                        <SimpleItem
                          dataField="FlagActive"
                          editorType="dxCheckBox"
                          editorOptions={{
                            disabled: true,
                            value: item?.FlagRequired
                              ? item?.FlagRequired === "1" ||
                                item?.FlagRequired === true
                              : false,
                          }}
                          // validationRules={[requiredType]}
                        ></SimpleItem>
                      </GroupItem>
                    </Form>
                  </div>
                );
              }}
            >
              <ItemDragging
                allowReordering={true}
                // onDragStart={(e: any) => {
                //   console.log("dragStart", e);
                // }}
                // onAdd={(e: any) => {
                //   console.log("add", e);
                // }}
                // onRemove={(e: any) => {
                //   console.log("remove ", e);
                // }}
                onReorder={handleReorder}
              ></ItemDragging>
            </List>
            <Button
              type={"default"}
              stylingMode={"text"}
              hoverStateEnabled={false}
              activeStateEnabled={false}
              focusStateEnabled={false}
              onClick={() => {
                setVisiable(true);
              }}
              disabled={param?.flag === "detail"}
              className={"flex items-center"}
            >
              <Icon name={"plus"} size={20} />
              <span className={"mx-2"}>{t("Add New")}</span>
            </Button>
          </div>
        </div>
        {!isLoading && !isLoadingDataType && (
          <EditForm
            onCancel={() => {
              setVisiable(false);
            }}
            onSave={() => {}}
            onSuccess={() => {}}
            // onSuccess={() => {}}
            data={listCampaign}
            dataType={listDataType}
          />
        )}
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default Customize;
