import { useI18n } from "@/i18n/useI18n";
import { showErrorAtom } from "@/packages/store";
import { SelectboxField } from "@/pages/admin/custom-field/components/selectbox-field";
import { TextboxField } from "@/pages/admin/custom-field/components/textbox-field";
import { useClientgateApi } from "@packages/api";
import { useAuth } from "@packages/contexts/auth";
import { MdMetaColGroupSpecDto } from "@packages/types";
import { Icon } from "@packages/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { CheckBox, LoadPanel } from "devextreme-react";
import Button from "devextreme-react/button";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import TextBox from "devextreme-react/text-box";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import ToggleActive from "./ToggleActive";
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
  readOnly,
}: any) => {
  const { t: common } = useI18n("Common");

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
    choiceValues?.find((item: any) => item.IsSelected)?.OrderIdx ?? 0;
  const {
    fields: singleChoiceValuesFields,
    append,
    prepend,
    remove,
    swap,
    move,
    insert,
    replace,
    update,
  } = useFieldArray<MdMetaColGroupSpecDto>({
    name: "ListOption",
    control: control,
  });

  const onAddNewItem = () => {
    // if this is the first item, we need set the DefaultIndex value
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
    required: true,
  });

  return (
    <div className={"w-full ml-[200px]"}>
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
              disabled={readOnly}
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
              readOnly={readOnly}
            />
            {!readOnly && (
              <Button onClick={() => onRemoveItem(index)} stylingMode={"text"}>
                <Icon name={"trash"} size={14} color={"#ff5050"} />
              </Button>
            )}
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
        disabled={!canAddMore(choiceValues) || readOnly}
        className={"flex items-center"}
      >
        <Icon name={"plus"} size={20} />
        <span className={"mx-2"}>{common("Add New")}</span>
      </Button>
    </div>
  );
};

export const EditForm = ({ onCancel, onSave }: EditFormProps) => {
  const { t } = useI18n("CustomField");

  const [popupVisible, setPopupVisible] = useAtom(showPopupAtom);
  const currentItem = useAtomValue(currentItemAtom);
  const flag = useAtomValue(flagAtom);

  const { auth } = useAuth();
  const api = useClientgateApi();

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
  const { data: listDataType, isLoading: isGettingDataTypes } = useQuery({
    queryFn: async () => {
      const resp = await api.MDMetaColumnDataType_GetAllActive();
      if (resp.isSuccess) {
        return resp.DataList;
      }
      return [];
    },
    queryKey: ["MdMetaColDataTypeApi"],
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
  } = useForm<MdMetaColGroupSpecDto>({
    defaultValues: {
      ...currentItem,
      Enabled: currentItem?.FlagActive == "1",
    },
    values: currentItem as MdMetaColGroupSpecDto,
  });

  const handleCancel = () => {
    onCancel();
    reset();
  };

  const {
    fields: singleChoiceValuesFields,
    append,
    prepend,
    remove,
    swap,
    move,
    insert,
    replace,
    update,
  } = useFieldArray<MdMetaColGroupSpecDto>({
    name: "ListOption",
    control: control,
  });

  const { t: common } = useI18n("Common");
  const { t: validateMessage } = useI18n("Validate");

  useEffect(() => {
    if (flag !== "add") {
      // const getKey = Object.keys(currentItem);
      // const getValue = Object.values(currentItem);
    } else {
      reset();
      setValue("ListOption", []);
      setValue("DefaultIndex", "0");
      setValue("ColOperatorType", "");
      setValue("FlagActive", "1");
      setValue("Enabled", true);
      setValue("FlagIsCheckDuplicate", "0");
      setValue("FlagIsNotNull", "0");
      setValue("IsUnique", false);
      setValue("IsRequired", false);
    }
  }, [currentItem]);

  const handleSave = async (data: MdMetaColGroupSpecDto) => {
    console.log(data);

    if (!data.ColDataType) {
      setError("ColDataType", {
        message: validateMessage("Please select one option!"),
      });
      return;
    }
    if (
      [
        "MASTERDATASELECTMULTIPLE",
        "SELECTMULTIPLE",
        "SELECTMULTIPLEDROPDOWN",
        "SELECTMULTIPLESELECTBOX",
        "SELECTONE",
        "SELECTONEDROPDOWN",
        "SELECTONERADIO",
      ].includes(data.ColDataType) &&
      (!data.ListOption || data.ListOption.length === 0)
    ) {
      setError("ColDataType", {
        message: validateMessage("Datasource can not be empty!"),
      });
      return;
    }

    if (flag === "add") {
      const listOption = match(data.ColDataType)
        .with("SELECTONERADIO", () =>
          data.ListOption?.map((item, index) => {
            return {
              ...item,
              IsSelected: data.DefaultIndex === index.toString(),
            };
          })
        )
        .with("SELECTONEDROPBOX", () =>
          data.ListOption?.map((item, index) => {
            return {
              ...item,
              IsSelected: data.DefaultIndex === index.toString(),
            };
          })
        )
        .otherwise(() => {
          return data.ListOption;
        });

      const outParam = {
        ...data,
        ColOperatorType: data.ColOperatorType || "EQUAL",
        ColCodeSys: data.ColCode,
        FlagIsNotNull: data.IsRequired ? "1" : "0",
        FlagIsCheckDuplicate: data.IsUnique ? "1" : "0",
        FlagIsQuery: data.IsSearchable ? "1" : "0",
        FlagActive: "1",
        JsonListOption: listOption
          ? JSON.stringify(
              listOption.map((item, index) => {
                return {
                  ...item,
                  OrderIdx: index,
                };
              })
            )
          : "[]",
      };
      if (data.ColDataType === "MASTERDATA") {
        outParam.JsonListOption = JSON.stringify([{ Value: data.DataSource }]);
      }
      if (data.ColDataType === "MASTERDATASELECTMULTIPLE") {
        outParam.JsonListOption = JSON.stringify([{ Value: data.DataSource }]);
      }

      const response = await api.MDMetaColumn_Create({
        ...outParam,
        FlagIsCheckDuplicate:
          data.FlagIsCheckDuplicate || data.FlagIsCheckDuplicate == "1"
            ? "1"
            : "0",
        FlagIsNotNull:
          data.FlagIsNotNull || data.FlagIsNotNull == "1" ? "1" : "0",
        OrgID: auth.orgData?.Id?.toString(),
        NetworkID: auth.networkId?.toString(),
      });
      if (response.isSuccess) {
        toast.success(common("Create successfully!"));
        onSave({ ...outParam });
        reset();
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

    if (flag == "update") {
      const listOption = match(data.ColDataType)
        .with("SELECTONERADIO", () =>
          data.ListOption?.map((item, index) => {
            return {
              ...item,
              IsSelected: data.DefaultIndex === index.toString(),
            };
          })
        )
        .with("SELECTONEDROPBOX", () =>
          data.ListOption?.map((item, index) => {
            return {
              ...item,
              IsSelected: data.DefaultIndex === index.toString(),
            };
          })
        )
        .otherwise(() => {
          return data.ListOption;
        });

      const outParam = {
        ...data,
        ColOperatorType: data.ColOperatorType || "EQUAL",
        FlagIsNotNull: data.IsRequired ? "1" : "0",
        FlagIsCheckDuplicate: data.IsUnique ? "1" : "0",
        FlagIsQuery: data.IsSearchable ? "1" : "0",
        FlagActive: "1",
        JsonListOption: listOption
          ? JSON.stringify(
              listOption.map((item, index) => {
                return {
                  ...item,
                  OrderIdx: index,
                };
              })
            )
          : "[]",
      };
      if (data.ColDataType === "MASTERDATA") {
        outParam.JsonListOption = JSON.stringify([{ Value: data.DataSource }]);
      }
      if (data.ColDataType === "MASTERDATASELECTMULTIPLE") {
        outParam.JsonListOption = JSON.stringify([{ Value: data.DataSource }]);
      }

      const response = await api.MDMetaColumn_Update({
        ...outParam,
        FlagIsCheckDuplicate:
          data.FlagIsCheckDuplicate || data.FlagIsCheckDuplicate == "1"
            ? "1"
            : "0",
        FlagIsNotNull:
          data.FlagIsNotNull || data.FlagIsNotNull == "1" ? "1" : "0",
        FlagActive: data.FlagActive == "1" ? "1" : "0",
        OrgID: auth.orgData?.Id,
        NetworkID: auth.networkId,
      });
      if (response.isSuccess) {
        toast.success(common("Update successfully!"));
        onSave({
          ...data,
        });
        reset();
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
  };

  const formRef = useRef<HTMLFormElement>(null);
  const handleSaveClick = () => {
    triggerSubmit();
  };
  const refSubmitButton = useRef<HTMLButtonElement>(null);
  const triggerSubmit = () => {
    refSubmitButton?.current?.click();
  };
  const dataTypeValue = watch("ColDataType");
  const isSearchable = watch("IsSearchable");
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
    }
  }, [dataTypeValue]);

  const canAddMore = (choiceValues: any) => {
    if (flag == "detail") {
      return false;
    }

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
    isGettingMasterData
  ) {
    return <LoadPanel visible={true} />;
  }

  console.log(flag);

  return (
    <>
      {popupVisible && (
        <Popup
          position={"center"}
          showCloseButton={true}
          onHiding={handleCancel}
          title={t(`${flag.toLowerCase()} field`)}
          visible={popupVisible}
          height={500}
        >
          <ScrollView width={"100%"}>
            <form
              id={"editForm"}
              ref={formRef}
              onSubmit={handleSubmit(handleSave)}
            >
              <Controller
                name={"ColCode"}
                control={control}
                render={({ field }) => {
                  return (
                    <TextboxField
                      disabled={flag !== "add"}
                      field={field}
                      label={t("ColCode")}
                      required={true}
                      error={errors.ColCode}
                    />
                  );
                }}
                rules={{
                  required: {
                    value: true,
                    message: validateMessage("ColCode is required!"),
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_-]+$/,
                    message: validateMessage("Invalid ColCode"),
                  },
                }}
              />
              <Controller
                name={"ColCaption"}
                control={control}
                render={({ field }) => {
                  return (
                    <TextboxField
                      field={field}
                      label={t("ColCaption")}
                      required={true}
                      error={errors.ColCaption}
                      disabled={flag == "detail"}
                    />
                  );
                }}
                rules={{
                  required: {
                    value: true,
                    message: validateMessage("ColCaption is required!"),
                  },
                }}
              />
              <Controller
                name={"ColDataType"}
                control={control}
                render={({ field }) => {
                  return (
                    <SelectboxField
                      field={field}
                      label={t("ColDataType")}
                      dataSource={listDataType}
                      required={true}
                      // readonly={flag == "update" || flag !== "add"}
                      error={errors.ColDataType}
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
                      readonly={flag != "add"}
                    />
                  );
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
                  readOnly={flag == "detail"}
                />
              )}
              {(dataTypeValue === "SELECTMULTIPLEDROPDOWN" ||
                dataTypeValue === "SELECTMULTIPLESELECTBOX") && (
                <div className={"w-full ml-[200px]"}>
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
                            setValue(`ListOption.${index}.IsSelected`, e.value);
                          }}
                          readOnly={flag == "detail"}
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
                          readOnly={flag == "detail"}
                        />
                        {flag != "detail" && (
                          <Button
                            onClick={() => remove(index)}
                            stylingMode={"text"}
                          >
                            <Icon name={"trash"} size={14} color={"#ff5050"} />
                          </Button>
                        )}
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
                    <span className={"mx-2"}>{common("Add New")}</span>
                  </Button>
                </div>
              )}
              {dataTypeValue === "MASTERDATA" && (
                <Controller
                  name={"DataSource"}
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: validateMessage("DataSource is required!"),
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <SelectboxField
                        field={field}
                        label={t("DataSource")}
                        dataSource={listMasterData}
                        // defaultValue={
                        //   options.length > 0 ? options?.[0].Value : null
                        // }
                        required={true}
                        error={errors.DataSource}
                        displayExpr={"Value"}
                        valueExpr={"Key"}
                        // readonly={flag !== "add"}
                        readonly={flag == "detail"}
                      />
                    );
                  }}
                />
              )}
              {dataTypeValue === "MASTERDATASELECTMULTIPLE" && (
                <Controller
                  name={"DataSource"}
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: validateMessage("DataSource is required!"),
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <SelectboxField
                        field={field}
                        label={t("DataSource")}
                        dataSource={listMasterData}
                        required
                        error={errors.DataSource}
                        displayExpr={"Value"}
                        valueExpr={"Key"}
                        readonly={flag == "detail"}
                      />
                    );
                  }}
                />
              )}
              {flag !== "add" && (
                <Controller
                  name={"FlagActive"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <div className={`my-2 flex items-center`}>
                        <label htmlFor={"FlagActive"} className={"w-[210px]"}>
                          {t("FlagActive")}
                        </label>
                        <ToggleActive
                          readOnly={flag == "detail"}
                          field={field}
                        />
                      </div>
                    );
                  }}
                />
              )}

              <button
                hidden={true}
                ref={refSubmitButton}
                type={"submit"}
                form={"editForm"}
              />
            </form>
          </ScrollView>
          <ToolbarItem toolbar={"bottom"} location={"center"}>
            {flag != "detail" && (
              <Button
                text={common("Save")}
                type={"default"}
                stylingMode={"contained"}
                onClick={handleSaveClick}
                className={"mx-2 w-[100px]"}
              />
            )}

            <Button
              text={common("Cancel")}
              stylingMode={"outlined"}
              type={"normal"}
              onClick={handleCancel}
              className={"mx-2 w-[100px]"}
            />
          </ToolbarItem>
        </Popup>
      )}
    </>
  );
};
