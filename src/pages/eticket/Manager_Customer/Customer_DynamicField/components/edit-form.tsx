import { useI18n } from "@/i18n/useI18n";
import { showErrorAtom } from "@/packages/store";
import { CheckboxField } from "@/pages/admin/custom-field/components/checkbox-field";
import { SelectboxField } from "@/pages/admin/custom-field/components/selectbox-field";
import { TextboxField } from "@/pages/admin/custom-field/components/textbox-field";
import { useClientgateApi } from "@packages/api";
import { useAuth } from "@packages/contexts/auth";
import {
  MdMetaColGroupSpecDto,
  MstTicketColumnConfigDto,
} from "@packages/types";
import { Icon } from "@packages/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { CheckBox, LoadPanel } from "devextreme-react";
import Button from "devextreme-react/button";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import TextBox from "devextreme-react/text-box";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "./edit-form.scss";
import { currentItemAtom, flagAtom, showPopupAtom } from "./store";

interface EditFormProps {
  onCancel: () => void;
  onSave: (data: any) => void;
}

const isSearchableType = (dataType: string) => {
  return "FLAG" !== dataType;
};

export const SelectOneField = ({
  control,
  setValue,
  getValues,
  watch,
  register,
  errors,
}: any) => {
  const canAddMore = (choiceValues: any) => {
    return (
      !choiceValues ||
      choiceValues.every((item: any) => {
        return item.Value !== "" && !!item.Value;
      })
    );
  };

  const choiceValues = watch("ListOption");
  const defaultIndexValue =
    choiceValues?.find((item: any) => item.IsSelected)?.OrderIdx || 0;
  const {
    fields: singleChoiceValuesFields,
    append,
    remove,
  } = useFieldArray<MdMetaColGroupSpecDto>({
    name: "ListOption",
    control: control,
  });

  const onAddNewItem = () => {
    append({
      Value: "",
      IsSelected: false,
      id: "",
    });
    if (!choiceValues || choiceValues.length === 0) {
      setValue("DefaultIndex", "0");
    }
  };
  const onRemoveItem = (index: number) => {
    // if remove the default one, we set the DefaultIndex value to the first item
    if (defaultIndexValue === index.toString()) {
      setValue("DefaultIndex", "0");
    }
    remove(index);
  };
  const defaultIndexField = register("DefaultIndex", {
    // required: true,
  });

  return (
    <div className={"w-full ml-[150px]"}>
      {singleChoiceValuesFields.map((field, index) => {
        const { ref, onChange, ...restField } = register(
          `ListOption.${index}.Value` as const,
          {
            required: true,
          }
        );
        return (
          <div key={field.id} className={"flex items-center my-2"}>
            <input
              type={"radio"}
              className={"mr-2"}
              {...defaultIndexField}
              disabled={true}
              defaultChecked={defaultIndexValue === index}
              value={index}
              onChange={async (e: any) => {
                setValue("DefaultIndex", e.target.value);
                setValue(`ListOption.${index}.IsSelected`, true);
                await onChange({
                  target: {
                    name: defaultIndexField.name,
                    value: e.target.value,
                  },
                });
              }}
            />
            <TextBox
              ref={ref}
              {...restField}
              value={getValues("ListOption." + index + ".Value") ?? ""}
              onValueChanged={async (e: any) => {
                await onChange({
                  target: {
                    name: restField.name,
                    value: e.value,
                  },
                });
              }}
              validationMessageMode={"always"}
              isValid={!errors.ListOption?.[index]}
            />
            <Button onClick={() => onRemoveItem(index)} stylingMode={"text"}>
              <Icon name={"trash"} size={14} color={"#ff5050"} />
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
        onClick={() => onAddNewItem()}
        disabled={!canAddMore(choiceValues)}
        className={"flex items-center"}
      >
        <Icon name={"plus"} size={20} />
        <span className={"mx-2"}>Add New</span>
      </Button>
    </div>
  );
};

export const EditForm = ({ onCancel, onSave }: EditFormProps) => {
  const { t } = useI18n("Eticket_Custom_Field_Dynamic_EditForm");
  const popupVisible = useAtomValue(showPopupAtom);
  const currentItem = useAtomValue(currentItemAtom);
  const { auth } = useAuth();
  const api = useClientgateApi();
  const flag = useAtomValue(flagAtom);
  const showError = useSetAtom(showErrorAtom);
  const { data: listGroup, isLoading: isGettingGroups } = useQuery({
    queryFn: async () => {
      const resp = await api.MdMetaColGroupApi_Search({
        ScrTplCodeSys: "ScrTplCodeSys.2023",
      });
      if (resp.isSuccess) {
        return resp.DataList;
      }
      return [];
    },
    queryKey: ["MdMetaColGroupApi"],
  });

  const listColDataTypeValid = [
    "DATE",
    "DATETIME",
    "DECIMAL",
    "INT",
    "MASTERDATA",
    "MASTERDATASELECTMULTIPLE",
    "PASSWORD",
    "PERCENT",
    "SELECTMULTIPLEDROPDOWN",
    "SELECTMULTIPLESELECTBOX",
    "SELECTONEDROPDOWN",
    "SELECTONERADIO",
    "TEXT",
    "TEXTAREA",
    "URL",
  ];

  const { data: listDataType, isLoading: isGettingDataTypes } = useQuery({
    queryFn: async () => {
      const resp = await api.MDMetaColumnDataType_GetAllActive();
      if (resp.isSuccess) {
        const result = resp?.DataList?.map((item: any) => {
          if (item?.ColDataType == "CUSTOMERCODESYSERP") {
            return {
              ...item,
              ColDataTypeDesc: "Doanh nghiệp",
            };
          }
          if (item?.ColDataType == "GOVID") {
            return {
              ...item,
              ColDataTypeDesc: "Số giấy tờ",
            };
          }
          return item;
        });

        const filter = result?.filter((item: any) => {
          return listColDataTypeValid.includes(item?.ColDataType);
        });

        return filter;
      }
      return [];
    },
    queryKey: ["MdMetaColDataTypeApi_dynamic_et"],
  });

  const { data: listOperators, isLoading: isGettingOperators } = useQuery({
    queryFn: async () => {
      const resp = await api.MDMetaColumnOperatorType_GetAllActive();
      if (resp.isSuccess) {
        return resp.DataList;
      }
      return [];
    },
    queryKey: ["MdMetaColOperatorApi"],
  });
  const { data: listMasterData, isLoading: isGettingMasterData } = useQuery({
    queryFn: async () => {
      const resp = await api.MDOptionValue_GetAllMasterDataTable();
      if (resp.isSuccess) {
        return resp.DataList;
      }
      return [];
    },
    queryKey: ["MdOptionValueApi"],
  });

  const handleCancel = () => {
    onCancel();
  };

  const {
    register,
    reset,
    unregister,
    watch,
    control,
    setValue,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<MstTicketColumnConfigDto>({
    defaultValues: {
      Enabled: true,
      FlagActive: true,
      IsRequired: true,
      FlagCheckRequire: true,
      IsSearchable: true,
      IsUnique: true,
      FlagCheckDuplicate: true,
      ListOption: currentItem ? currentItem.ListOption : [{}],
      ...currentItem,
    },
    values: currentItem as MstTicketColumnConfigDto,
  });
  const {
    fields: singleChoiceValuesFields,
    append,
    remove,
  } = useFieldArray<MstTicketColumnConfigDto>({
    name: "ListOption",
    control: control,
  });

  const handleSave = async (data: MstTicketColumnConfigDto) => {
    if (Object.keys(errors).length === 0) {
      if (!data.TicketColCfgDataType) {
        setError("TicketColCfgDataType", {
          message: "Please select at least one option",
        });
        return;
      }
      if (
        [
          "SELECTONERADIO",
          "SELECTONEDROPBOX",
          "SELECTONEDROPDOWN",
          "SELECTMULTIPLESELECTBOX",
          "SELECTMULTIPLEDROPDOWN",
        ].includes(data.TicketColCfgDataType) &&
        (!data.ListOption || data.ListOption.length === 0)
      ) {
        setError("TicketColCfgDataType", {
          message: "Please select at least one option",
        });
        return;
      }
      const newData = {
        ...data,
        FlagCheckDuplicate: data.FlagCheckDuplicate ? "1" : "0",
        FlagCheckRequire: data.FlagCheckRequire ? "1" : "0",
        FlagActive: data.FlagActive ? "1" : "0",
        FlagIsDynamic: "1",
      };
      if (flag === "add") {
        const response = await api.Mst_TicketColumnConfig_Create({
          ...newData,
          OrgID: auth.orgData?.Id ?? "",
          NetworkID: auth.networkId ?? "",
          // OrderIdx: 0,
          // JsonListOption: JSON.stringify(data.ListOption),
        });
        if (response.isSuccess) {
          toast.success("Add success");
          onSave({ ...data });
          reset();
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
        const response = await api.Mst_TicketColumnConfig_Update({
          ...newData,
          OrgID: auth.orgData?.Id ?? "",
          NetworkID: auth.networkId ?? "",
          // OrderIdx: 0,
          // JsonListOption: JSON.stringify(data.ListOption),
        });
        if (response.isSuccess) {
          toast.success(t("Update success"));
          onSave({ ...data });
          reset();
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
    }
  };

  const formRef = useRef<HTMLFormElement>(null);
  const handleSaveClick = () => {
    triggerSubmit();
  };
  const refSubmitButton = useRef<HTMLButtonElement>(null);
  const triggerSubmit = () => {
    refSubmitButton?.current?.click();
  };
  const dataTypeValue = watch("TicketColCfgDataType");
  const choiceValues = watch("ListOption");

  // const defaultIndexValue = watch("DefaultIndex");
  useEffect(() => {
    if (
      ![
        "SELECTONERADIO",
        "SELECTONEDROPDOWN",
        "SELECTMULTIPLESELECTBOX",
        "SELECTMULTIPLEDROPDOWN",
      ].includes(dataTypeValue)
    ) {
      unregister("ListOption");
      unregister("DefaultIndex");
      register("ListOption", []);
    }
  }, [dataTypeValue]);

  const canAddMore = (choiceValues: any) => {
    return (
      !choiceValues ||
      choiceValues.every((item: any) => {
        return item.Value !== "" && !!item.Value;
      })
    );
  };

  if (
    isGettingGroups ||
    !listGroup ||
    !listDataType ||
    isGettingDataTypes ||
    isGettingMasterData ||
    isGettingOperators
  ) {
    return <LoadPanel visible={true} />;
  }
  return (
    <Popup
      position={"center"}
      showCloseButton={true}
      onHiding={handleCancel}
      title={t(`${flag} field`)}
      visible={popupVisible}
    >
      <ScrollView width={"100%"} height={600}>
        <form id={"editForm"} ref={formRef} onSubmit={handleSubmit(handleSave)}>
          <Controller
            name={"TicketColCfgCode"}
            control={control}
            render={({ field }) => {
              return (
                <TextboxField
                  field={field}
                  label={t("TicketColCfgCode")}
                  required={true}
                  error={errors.TicketColCfgCode}
                  disabled={true}
                />
              );
            }}
            rules={{
              required: {
                value: true,
                message: "TicketColCfgCode Is Required!",
              },
            }}
          />
          <Controller
            name={"TicketColCfgName"}
            control={control}
            render={({ field }) => {
              return (
                <TextboxField
                  field={field}
                  label={t("TicketColCfgName")}
                  required={true}
                  error={errors.TicketColCfgName}
                />
              );
            }}
            rules={{
              required: {
                value: true,
                message: "TicketColCfgName Is Required!",
              },
            }}
          />
          <Controller
            name={"FlagCheckRequire"}
            control={control}
            render={({ field }) => {
              return (
                <CheckboxField
                  field={field}
                  label={t("Flag CheckRequire")}
                  // readonly={
                  //   flag !== "add" && currentItem.FlagIsDynamic ? true : false
                  // }
                />
              );
            }}
          />
          <Controller
            name={"FlagCheckDuplicate"}
            control={control}
            render={({ field }) => {
              return (
                <CheckboxField
                  field={field}
                  label={t("FlagCheckDuplicate")}
                  // readonly={
                  //   flag !== "add" && currentItem.FlagIsDynamic ? true : false
                  // }
                />
              );
            }}
          />
          <Controller
            name={"TicketColCfgDataType"}
            control={control}
            render={({ field }) => {
              return (
                <SelectboxField
                  field={field}
                  label={t("TicketColCfgDataType")}
                  dataSource={listDataType}
                  required
                  readonly={
                    flag !== "add" && currentItem.FlagIsDynamic ? true : false
                  }
                  error={errors.TicketColCfgDataType}
                  valueExpr={"ColDataType"}
                  displayExpr={"ColDataTypeDesc"}
                  onValueChanged={(newValue: string) => {
                    if (
                      ![
                        "SELECTONERADIO",
                        "SELECTONEDROPDOWN",
                        "SELECTMULTIPLESELECTBOX",
                        "SELECTMULTIPLEDROPDOWN",
                      ].includes(newValue)
                    ) {
                      singleChoiceValuesFields.forEach((item, index) => {
                        remove(index);
                      });
                    }
                  }}
                />
              );
            }}
            rules={{
              required: {
                value: true,
                message: "TicketColCfgDataType Is Required!",
              },
            }}
          />
          {(dataTypeValue === "SELECTONEDROPDOWN" ||
            dataTypeValue === "SELECTONERADIO") && (
            <SelectOneField
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
              watch={watch}
            />
          )}
          {(dataTypeValue === "SELECTMULTIPLEDROPDOWN" ||
            dataTypeValue === "SELECTMULTIPLESELECTBOX") && (
            <div className={"w-full ml-[150px]"}>
              {singleChoiceValuesFields.map((field: any, index: any) => {
                const { ref, onChange, ...restField } = register(
                  `ListOption.${index}.Value` as const,
                  {
                    required: true,
                  }
                );
                const { onChange: onDefaultChange, ...restDefaultField } =
                  register(`ListOption.${index}.IsSelected` as const, {});
                return (
                  <div key={field.id} className={"flex items-center my-2"}>
                    <CheckBox
                      className={"mr-2"}
                      {...restDefaultField}
                      value={getValues(`ListOption.${index}.IsSelected`)}
                      onValueChanged={async (e: any) => {
                        // setValue("DefaultIndex", index);
                        setValue(`ListOption.${index}.IsSelected`, e.value);
                        // await onDefaultChange({
                        //   target: {
                        //     name: restDefaultField.name,
                        //     value: e.value,
                        //   },
                        // });
                      }}
                    />
                    <TextBox
                      ref={ref}
                      {...restField}
                      defaultValue={field?.Value ?? ""}
                      onValueChanged={async (e: any) => {
                        await onChange({
                          target: {
                            name: restField.name,
                            value: e.value,
                          },
                        });
                      }}
                      validationMessageMode={"always"}
                      isValid={!errors.ListOption?.[index]}
                    />
                    <Button onClick={() => remove(index)} stylingMode={"text"}>
                      <Icon name={"trash"} size={14} color={"#ff5050"} />
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
                disabled={!canAddMore(choiceValues)}
                className={"flex items-center"}
              >
                <Icon name={"plus"} size={20} />
                <span className={"mx-2"}>{t("Add New")}</span>
              </Button>
            </div>
          )}
          {dataTypeValue === "MASTERDATA" && (
            <Controller
              name={"DataSource"}
              control={control}
              render={({ field }) => {
                const jsonListOption = getValues("JsonListOption");
                const options = JSON.parse(jsonListOption ?? "[]");
                return (
                  <SelectboxField
                    field={field}
                    label={t("Data Source")}
                    dataSource={listMasterData}
                    defaultValue={
                      options.length > 0 ? options?.[0].Value : null
                    }
                    required={true}
                    error={errors.DataSource}
                    displayExpr={"Value"}
                    valueExpr={"Key"}
                    readonly={flag === "detail"}
                  />
                );
              }}
              rules={{
                required: { value: true, message: "MASTERDATA is Require" },
              }}
            />
          )}
          {dataTypeValue === "MASTERDATASELECTMULTIPLE" && (
            <Controller
              name={"DataSource"}
              control={control}
              render={({ field }) => {
                const jsonListOption = getValues("JsonListOption");
                const options = JSON.parse(jsonListOption ?? "[]");
                return (
                  <SelectboxField
                    field={field}
                    label={t("Data Source")}
                    dataSource={listMasterData}
                    defaultValue={
                      options.length > 0 ? options?.[0].Value : null
                    }
                    required={true}
                    error={errors.DataSource}
                    displayExpr={"Value"}
                    valueExpr={"Key"}
                    readonly={currentItem.FlagIsDynamic ? true : false}
                  />
                );
              }}
              rules={{
                required: {
                  value: true,
                  message: "MASTERDATASELECTMULTIPLE is Require",
                },
              }}
            />
          )}
          <Controller
            name={"FlagActive"}
            control={control}
            render={({ field }) => {
              return (
                <CheckboxField
                  field={field}
                  label={t("IsActive")}
                  readonly={
                    false
                    // flag !== "detail" && currentItem.FlagIsDynamic === true
                  }
                />
              );
            }}
          />
          <button
            hidden={true}
            ref={refSubmitButton}
            type={"submit"}
            form={"editForm"}
          />
        </form>
      </ScrollView>
      <ToolbarItem toolbar={"bottom"} location={"center"}>
        {(flag !== "detail" || currentItem.FlagIsDynamic === true) && (
          <Button
            text={t("Save")}
            type={"default"}
            stylingMode={"contained"}
            onClick={handleSaveClick}
            className={"mx-2 w-[100px]"}
          />
        )}

        <Button
          text={t("Cancel")}
          stylingMode={"outlined"}
          type={"normal"}
          onClick={handleCancel}
          className={"mx-2 w-[100px]"}
        />
      </ToolbarItem>
    </Popup>
  );
};
