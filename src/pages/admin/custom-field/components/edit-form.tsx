import { useI18n } from "@/i18n/useI18n";
import { showErrorAtom } from "@/packages/store";
import { CheckboxField } from "@/pages/admin/custom-field/components/checkbox-field";
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
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "./edit-form.scss";
import { currentItemAtom, flagAtom, showPopupAtom } from "./store";

interface EditFormProps {
  onCancel: () => void;
  onSave: (data: MdMetaColGroupSpecDto) => void;
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

  // console.log(singleChoiceValuesFields, defaultIndexValue);

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
  const { t } = useI18n("CustomField");
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
  } = useForm<MdMetaColGroupSpecDto>({
    defaultValues: {
      Enabled: true,
      FlagActive: "1",
      IsRequired: true,
      FlagIsNotNull: "1",
      IsSearchable: true,
      FlagIsQuery: "1",
      IsUnique: true,
      FlagIsCheckDuplicate: "1",
      ListOption: currentItem ? currentItem.ListOption : [{}],
      ...currentItem,
    },
    values: currentItem as MdMetaColGroupSpecDto,
  });
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

  useEffect(() => {
    if (flag !== "add") {
      const getKey = Object.keys(currentItem);
      const getValue = Object.values(currentItem);
    } else {
      // console.log("else =======================================");
      reset();
      setValue("ListOption", []);
      setValue("DefaultIndex", "0");
      setValue("ColOperatorType", "");
    }
  }, [currentItem]);

  const handleSave = async (data: MdMetaColGroupSpecDto) => {
    if (Object.keys(errors).length === 0) {
      if (!data.ColDataType) {
        setError("ColDataType", {
          message: "Please select at least one option",
        });
        return;
      }
      if (
        ["SELECTONERADIO", "SELECTONEDROPBOX", "SELECTONEDROPDOWN"].includes(
          data.ColDataType
        ) &&
        (!data.ListOption || data.ListOption.length === 0)
      ) {
        setError("ColDataType", {
          message: "Please select at least one option",
        });
        return;
      }
      if (data.IsSearchable && !data.ColOperatorType) {
        setError("ColOperatorType", {
          message: "Please select at least one option",
        });
        return;
      }
      if (flag === "add") {
        const response = await api.MDMetaColGroupSpec_Create({
          ...data,
          OrgID: auth.orgData?.Id,
          NetworkID: auth.networkId,
          OrderIdx: 0,
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
        const response = await api.MDMetaColGroupSpec_Update({
          ...data,
          OrgID: auth.orgData?.Id,
          NetworkID: auth.networkId,
          OrderIdx: 0,
        });
        if (response.isSuccess) {
          toast.success("Edit success");
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
      title={t(`${flag.toLocaleUpperCase()} Field`)}
      visible={popupVisible}
    >
      <ScrollView width={"100%"} height={600}>
        <form id={"editForm"} ref={formRef} onSubmit={handleSubmit(handleSave)}>
          <Controller
            name={"ColGrpCodeSys"}
            control={control}
            render={({ field }) => {
              return (
                <SelectboxField
                  field={field}
                  label={"Column Group"}
                  dataSource={listGroup}
                  valueExpr={"ColGrpCodeSys"}
                  displayExpr={"ColGrpName"}
                  error={errors.ColGrpCodeSys}
                  required={true}
                  readonly={
                    flag !== "add" && currentItem.FlagIsColDynamic != "1"
                  }
                />
              );
            }}
            rules={{
              required: { value: true, message: "ColumnGroupIsRequired" },
            }}
          />
          <Controller
            name={"ColCode"}
            control={control}
            render={({ field }) => {
              return (
                <TextboxField
                  disabled={flag !== "add"}
                  field={field}
                  label={t("Field Code")}
                  required={true}
                  error={errors.ColCode}
                />
              );
            }}
            rules={{
              required: { value: true, message: "FieldCodeIsRequired" },
              pattern: {
                value: /^[a-zA-Z0-9_-]+$/,
                message: "Invalid Field Code",
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
                  label={t("Field Name")}
                  required={true}
                  error={errors.ColCaption}
                  disabled={
                    flag !== "add" && currentItem.FlagIsColDynamic != "1"
                  }
                />
              );
            }}
            rules={{
              required: { value: true, message: "FieldNameIsRequired" },
            }}
          />
          <Controller
            name={"IsRequired"}
            control={control}
            render={({ field }) => {
              return (
                <CheckboxField
                  field={field}
                  label={t("Is Required")}
                  readonly={
                    flag !== "add" && currentItem.FlagIsColDynamic != "1"
                  }
                />
              );
            }}
          />
          <Controller
            name={"IsUnique"}
            control={control}
            render={({ field }) => {
              return (
                <CheckboxField
                  field={field}
                  label={t("Is Unique")}
                  readonly={
                    flag !== "add" && currentItem.FlagIsColDynamic != "1"
                  }
                />
              );
            }}
          />
          <Controller
            name={"ColDataType"}
            control={control}
            render={({ field }) => {
              return (
                <SelectboxField
                  field={field}
                  label={t("Data Type")}
                  dataSource={listDataType}
                  required={true}
                  readonly={
                    flag == "update" ||
                    (flag !== "add" && currentItem.FlagIsColDynamic != "1")
                  }
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
                <span className={"mx-2"}>Add New</span>
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
                  message: "Data Source is required!",
                },
              }}
              render={({ field }) => {
                const jsonListOption = getValues("JsonListOption");
                const options = JSON.parse(jsonListOption ?? "[]");
                return (
                  <SelectboxField
                    field={field}
                    label={"Data Source"}
                    dataSource={listMasterData}
                    // defaultValue={
                    //   options.length > 0 ? options?.[0].Value : null
                    // }
                    required={true}
                    error={errors.DataSource}
                    displayExpr={"Value"}
                    valueExpr={"Key"}
                    readonly={
                      flag !== "add" && currentItem.FlagIsColDynamic != "1"
                    }
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
                  message: "Data Source is required!",
                },
              }}
              render={({ field }) => {
                const jsonListOption = getValues("JsonListOption");
                const options = JSON.parse(jsonListOption ?? "[]");
                // console.log(jsonListOption, options, listMasterData);
                return (
                  <SelectboxField
                    field={field}
                    label={"Data Source"}
                    dataSource={listMasterData}
                    // defaultValue={
                    //   options.length > 0 ? options?.[0].Value : null
                    // }
                    required
                    error={errors.DataSource}
                    displayExpr={"Value"}
                    valueExpr={"Key"}
                    readonly={
                      flag !== "add" && currentItem.FlagIsColDynamic != "1"
                    }
                  />
                );
              }}
            />
          )}
          {isSearchableType(dataTypeValue) && (
            <Controller
              name={"IsSearchable"}
              control={control}
              render={({ field }) => {
                return (
                  <CheckboxField
                    field={field}
                    label={"Can search"}
                    readonly={
                      flag !== "add" && currentItem.FlagIsColDynamic != "1"
                    }
                  />
                );
              }}
            />
          )}
          {isSearchable && isSearchableType(dataTypeValue) && (
            <Controller
              name={"ColOperatorType"}
              control={control}
              render={({ field }) => {
                return (
                  <SelectboxField
                    field={field}
                    required
                    label={"Search Type"}
                    defaultValue={undefined}
                    error={errors.ColOperatorType}
                    dataSource={listOperators}
                    valueExpr={"ColOperatorType"}
                    displayExpr={"ColOperatorTypeDesc"}
                    readonly={
                      flag !== "add" && currentItem.FlagIsColDynamic != "1"
                    }
                  />
                );
              }}
            />
          )}
          <Controller
            name={"Enabled"}
            control={control}
            render={({ field }) => {
              return (
                <CheckboxField
                  field={field}
                  label={t("IsActive")}
                  readonly={
                    flag !== "add" && currentItem.FlagIsColDynamic != "1"
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
        {(flag === "add" || currentItem.FlagIsColDynamic == "1") && (
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
