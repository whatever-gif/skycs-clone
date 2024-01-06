import { useI18n } from "@/i18n/useI18n";
import { showErrorAtom } from "@/packages/store";
import { SelectboxField } from "@/pages/admin/custom-field/components/selectbox-field";
import { TextboxField } from "@/pages/admin/custom-field/components/textbox-field";
import { useClientgateApi } from "@packages/api";
import { useAuth } from "@packages/contexts/auth";
import {
  MdMetaColGroupSpecDto,
  Mst_CampaignColumnConfig,
} from "@packages/types";
import { Icon } from "@packages/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { CheckBox } from "devextreme-react";
import Button from "devextreme-react/button";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import TextBox from "devextreme-react/text-box";
import { useAtomValue, useSetAtom } from "jotai";
import { memo, useEffect, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "./edit-form.scss";
import { currentItemAtom, flagAtom, showPopupAtom } from "./store";
import { CheckboxField } from "@/pages/admin/custom-field/components/checkbox-field";

interface EditFormProps {
  onCancel: () => void;
  onSave: (data: Mst_CampaignColumnConfig) => void;
  onSuccess: () => void;
}

const isSearchableType = (dataType: string) => {
  return "FLAG" !== dataType;
};

export const EditForm = memo(
  ({ onCancel, onSave, onSuccess }: EditFormProps) => {
    const { t } = useI18n("EditForm_Campaign");
    const popupVisible = useAtomValue(showPopupAtom);
    const currentItem = useAtomValue(currentItemAtom);
    const { auth } = useAuth();
    const api = useClientgateApi();
    const flag = useAtomValue(flagAtom);
    const setPopupVisible = useSetAtom(showPopupAtom);
    const showError = useSetAtom(showErrorAtom);
    const { data: listDataType } = useQuery({
      queryFn: async () => {
        const resp = await api.MDMetaColumnDataType_GetAllActive();
        if (resp.isSuccess) {
          return resp.DataList;
        }
        return [];
      },
      queryKey: ["MdMetaColDataTypeApi"],
    });

    const { data: listMasterData } = useQuery({
      queryFn: async () => {
        const resp = await api.MDOptionValue_GetAllMasterDataTable();
        if (resp.isSuccess) {
          return resp.DataList;
        }
        return [];
      },
      queryKey: ["MdOptionValueApi"],
    });

    const getData = async () => {
      if (popupVisible) {
        const resp =
          await api.Mst_CampaignColumnConfig_GetCampaignColCfgCodeSys();
        if (resp.isSuccess) {
          if (resp?.Data) {
            setValue("CampaignColCfgCodeSys", resp.Data ?? "");
            setValue("CampaignColCfgCode", resp.Data ?? "");
          }
        } else {
          showError({
            message: resp._strErrCode,
            _strErrCode: resp._strErrCode,
            _strTId: resp._strTId,
            _strAppTId: resp._strAppTId,
            _objTTime: resp._objTTime,
            _strType: resp._strType,
            _dicDebug: resp._dicDebug,
            _dicExcs: resp._dicExcs,
          });
        }
      }
    };

    const handleCancel = () => {
      onCancel();
    };

    useEffect(() => {
      if (flag === "add") {
        reset();
        getData();
      } else {
        if (currentItem?.JsonListOption) {
          let json = JSON.parse(currentItem?.JsonListOption);
          if (json) {
            if (currentItem.CampaignColCfgDataType === "MASTERDATA") {
              // setTimeout(() => {
              //   register("DataSource", json[0].Value);
              //   setValue("DataSource", json[0].Value);
              // }, 0);`
            } else {
              register("ListOption", json);
              setValue("ListOption", json);
            }
          }
        }
      }
    }, [currentItem, flag]);

    const {
      register,
      reset,
      unregister,
      watch,
      control,
      setValue,
      getValues,
      handleSubmit,
      formState: { errors },
    } = useForm<Mst_CampaignColumnConfig>({
      defaultValues: {
        FlagActive: "1",
        FlagIsDynamic: "1",
        ListOption: [{}],
        ...currentItem,
      },
      values: currentItem as Mst_CampaignColumnConfig,
    });

    const {
      fields: singleChoiceValuesFields,
      append,
      remove,
    } = useFieldArray<Mst_CampaignColumnConfig>({
      name: "ListOption",
      control: control,
    });

    console.log("singleChoiceValuesFields ", singleChoiceValuesFields);

    const handleSave = async (data: Mst_CampaignColumnConfig) => {
      // console.log("data ", data);

      if (Object.keys(errors).length === 0) {
        if (flag === "add") {
          const response = await api.Mst_CampaignColumnConfig_Create({
            ...data,
            OrgID: auth.orgData?.Id,
            NetworkID: auth.networkId,
          });
          if (response.isSuccess) {
            toast.success(t("Create Success"));
            onSuccess();
            setPopupVisible(false);
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
          const response = await api.Mst_CampaignColumnConfig_Update({
            ...data,
            OrgID: auth.orgData?.Id,
            NetworkID: auth.networkId,
          });
          if (response.isSuccess) {
            toast.success(t("Update Success"));
            onSuccess();
            setPopupVisible(false);
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
    const dataTypeValue = watch("CampaignColCfgDataType");
    const choiceValues = watch("ListOption");

    const canAddMore = (choiceValues: any) => {
      return (
        !choiceValues ||
        choiceValues.every((item: any) => {
          return item.Value !== "" && !!item.Value;
        })
      );
    };

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
        setValue("ListOption", []);
        unregister("DefaultIndex");
      }
    }, [dataTypeValue]);

    useEffect(() => {
      if (!["SELECTMULTIPLE", "SELECTONE"].includes(dataTypeValue)) {
        if (currentItem.JsonListOption) {
          const value = JSON.parse(currentItem.JsonListOption);
          if (typeof value === "string") {
            // console.log("coming");
            unregister("ListOption");
            unregister("DefaultIndex");
          }
        }
      }
    }, [dataTypeValue]);

    return (
      <Popup
        height={500}
        width={700}
        position={"center"}
        showCloseButton={true}
        onHiding={handleCancel}
        title={t(`${flag.toLocaleUpperCase()} Field`)}
        visible={popupVisible}
      >
        <ScrollView width={"100%"}>
          <form
            id={"editForm"}
            ref={formRef}
            onSubmit={handleSubmit(handleSave)}
          >
            <Controller
              name={"CampaignColCfgCode"}
              control={control}
              render={({ field }) => {
                return (
                  <TextboxField
                    disabled={true}
                    field={field}
                    label={t("Field Code")}
                    required={true}
                    error={errors.CampaignColCfgCode}
                  />
                );
              }}
              rules={{
                required: { value: true, message: "FieldCodeIsRequired" },
                // pattern: {
                //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                //   message: ("The special key must be not input"),
                // },
              }}
            />
            <Controller
              name={"CampaignColCfgName"}
              control={control}
              render={({ field }) => {
                return (
                  <TextboxField
                    field={field}
                    label={t("Field Name")}
                    required={true}
                    error={errors.CampaignColCfgName}
                  />
                );
              }}
              rules={{
                required: { value: true, message: "FieldNameIsRequired" },
              }}
            />
            <Controller
              name={"CampaignColCfgDataType"}
              control={control}
              render={({ field }) => {
                return (
                  <SelectboxField
                    field={field}
                    label={t("Data Type")}
                    dataSource={listDataType}
                    required
                    error={errors.CampaignColCfgDataType}
                    valueExpr={"ColDataType"}
                    displayExpr={"ColDataTypeDesc"}
                    onValueChanged={(newValue: string) => {
                      if (!["SELECTONE", "SELECTMULTIPLE"].includes(newValue)) {
                        // unregister("ListOption");
                        // setValue("ListOption", []);
                        // singleChoiceValuesFields.forEach((item, index) => {
                        //   remove(index);
                        // });
                      }
                    }}
                  />
                );
              }}
              rules={{
                required: { value: true, message: "CampaignColCfgDataType" },
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
                {singleChoiceValuesFields.map((field, index) => {
                  const { ref, onChange, ...restField } = register(
                    `ListOption.${index}.Value` as const,
                    {
                      required: true,
                    }
                  );

                  const { onChange: onDefaultChange, ...restDefaultField } =
                    register(`ListOption.${index}.IsDefault` as const, {});
                  return (
                    <div key={field.id} className={"flex items-center my-2"}>
                      <CheckBox
                        className={"mr-2"}
                        {...restDefaultField}
                        onValueChanged={async (e: any) => {
                          await onDefaultChange({
                            target: {
                              name: restDefaultField.name,
                              value: e.value,
                            },
                          });
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
                      <Button
                        onClick={() => remove(index)}
                        stylingMode={"text"}
                      >
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
                      isSelected: false,
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
            {(dataTypeValue === "MASTERDATA" ||
              dataTypeValue === "MASTERDATASELECTMULTIPLE") && (
              <Controller
                name={"DataSource"}
                control={control}
                render={({ field }) => {
                  return (
                    <SelectboxField
                      field={field}
                      label={"Data Source"}
                      dataSource={listMasterData}
                      required={true}
                      error={errors.DataSource}
                      displayExpr={"Value"}
                      valueExpr={"Key"}
                    />
                  );
                }}
                rules={{
                  required: {
                    value: true,
                    message: "DataSource IsRequired",
                  },
                }}
              />
            )}
            <Controller
              name={"FlagActive"}
              control={control}
              render={({ field }) => {
                return <CheckboxField field={field} label={t("Is Active")} />;
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
          <Button
            text={t("Save")}
            type={"default"}
            className="mr-1"
            stylingMode={"contained"}
            onClick={handleSaveClick}
          />
          <Button
            text={t("Cancel")}
            stylingMode={"contained"}
            onClick={handleCancel}
          />
        </ToolbarItem>
      </Popup>
    );
  }
);

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

  const { t } = useI18n("EditForm_Campaign");

  const choiceValues = watch("ListOption");
  const defaultIndexValue =
    choiceValues.find((item: any) => item.IsSelected)?.OrderIdx || 0;
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
        <span className={"mx-2"}>{t("Add New")}</span>
      </Button>
    </div>
  );
};
