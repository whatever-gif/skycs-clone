import { useI18n } from "@/i18n/useI18n";
import { showErrorAtom } from "@/packages/store";
import { CheckboxField } from "@/pages/admin/custom-field/components/checkbox-field";
import { SelectboxField } from "@/pages/admin/custom-field/components/selectbox-field";
import { useClientgateApi } from "@packages/api";
import { useAuth } from "@packages/contexts/auth";
import { MdMetaColGroupSpecDto } from "@packages/types";
import { useQuery } from "@tanstack/react-query";
import { CheckBox, LoadPanel } from "devextreme-react";
import Button from "devextreme-react/button";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import TextBox from "devextreme-react/text-box";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { TextboxField } from "../../custom-field/components/textbox-field";
import "./edit-form.scss";
import { findMaxIdx, handleSort } from "./handle";
import {
  currentItemAtom,
  flagAtom,
  listData,
  screenAtom,
  showPopupAtom,
} from "./store";

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

  const defaultIndexField = register("DefaultIndex", {});

  return (
    <div className={"w-full ml-[210px]"}>
      {singleChoiceValuesFields.map((field, index) => {
        const { ref, onChange, ...restField } = register(
          `ListOption.${index}.Value` as const
        );
        return (
          <div key={field.id} className={"flex items-center my-2"}>
            <input
              type={"radio"}
              className={"mr-2"}
              {...defaultIndexField}
              defaultChecked={defaultIndexValue === index}
              value={index}
              disabled
            />
            <TextBox
              ref={ref}
              value={getValues("ListOption." + index + ".Value") ?? ""}
              readOnly
            />
          </div>
        );
      })}
    </div>
  );
};

export const EditForm = ({ onCancel, onSave }: EditFormProps) => {
  const { t } = useI18n("CustomField");
  const { t: common } = useI18n("Common");
  const { t: validateMessage } = useI18n("Validate");

  const popupVisible = useAtomValue(showPopupAtom);
  const currentItem = useAtomValue(currentItemAtom);
  const { auth } = useAuth();
  const api = useClientgateApi();
  const flag = useAtomValue(flagAtom);

  const currentScreen = useAtomValue(screenAtom);

  const showError = useSetAtom(showErrorAtom);

  const { data: listGroup, isLoading: isGettingGroups } = useQuery({
    queryFn: async () => {
      const resp = await api.MdMetaColGroupApi_Search({
        ScrTplCodeSys: currentScreen,
      });
      if (resp.isSuccess) {
        return resp.DataList;
      }
      return [];
    },
    queryKey: ["MdMetaColGroupApi", currentScreen],
  });

  const { data: listColumn, isLoading: loadingListColumn } = useQuery({
    queryFn: async () => {
      const resp = await api.MDMetaColumn_GetAllActive();
      if (resp.isSuccess) {
        return resp.DataList;
      }
      return [];
    },
    queryKey: ["MDMetaColumnGetAllActive"],
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

  const { data: listMasterData, isLoading: isGettingMasterData }: any =
    useQuery({
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
      OrderIdx: 0,
      FlagActive: "1",
      FlagIsNotNull: flag == "add" ? "1" : currentItem?.FlagIsNotNull,
      IsSearchable: true,
      FlagIsQuery: "1",
      FlagIsCheckDuplicate:
        flag == "add" ? "1" : currentItem?.FlagIsCheckDuplicate,
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
    } else {
      reset();
      setValue("ColCode", "");
      setValue("ListOption", []);
      setValue("DefaultIndex", "0");
      setValue("ColOperatorType", "");
    }
  }, [currentItem]);

  const [currentListData, setCurrentListData] = useAtom(listData);

  const handleSave = async (data: MdMetaColGroupSpecDto) => {
    const result = {
      ...data,
      // JsonListOption: JSON.stringify(data?.ListOption ?? []),
      FlagIsCheckDuplicate: data.FlagIsCheckDuplicate == "1" ? "1" : "0",
      FlagIsNotNull: data.FlagIsNotNull == "1" ? "1" : "0",
      OrgID: auth.orgData?.Id,
      NetworkID: auth.networkId,
    };

    if (flag == "add") {
      setCurrentListData([...currentListData, result]);
    } else {
      const result = currentListData?.map((item: any) => {
        if (
          data?.ColGrpCodeSys == item?.ColGrpCodeSys &&
          item?.OrderIdx == data?.OrderIdx
        ) {
          return data;
        }
        return item;
      });

      const sortedList = handleSort(result);

      setCurrentListData(sortedList);
    }

    onCancel();
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
  const watchColGrpCodeSys = watch("ColGrpCodeSys");

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

  const handleChange = (e: any) => {
    const currentField = listColumn?.find(
      (item: any) => item.ColCode == e.value
    );

    setValue("ColCaption", currentField?.ColCaption);
    setValue("ColDataType", currentField?.ColDataType);
    setValue("ListOption", JSON?.parse(currentField?.JsonListOption ?? "[]"));
    setValue("FlagActive", currentField?.FlagActive);
    setValue("FlagIsNotNull", currentField?.FlagIsNotNull ?? "0");
    setValue("FlagIsCheckDuplicate", currentField?.FlagIsCheckDuplicate ?? "0");
    setValue("ColCodeSys", currentField?.ColCodeSys);

    const currentDataSource = JSON.parse(currentField?.JsonListOption ?? "[]");

    if (
      currentDataSource &&
      currentDataSource[0] &&
      currentDataSource[0]?.Value
    ) {
      const result = listMasterData?.find(
        (item: any) => item?.Key == currentDataSource[0]?.Value
      );

      setValue("DataSource", result?.Value);
    }
  };

  const handleFindIdx = (e: any) => {
    const idx = findMaxIdx(currentListData, e.value);
    setValue("OrderIdx", idx + 1);
  };

  return (
    <>
      {popupVisible && (
        <Popup
          position={"center"}
          showCloseButton={true}
          onHiding={handleCancel}
          title={t(`${flag.toLocaleUpperCase()} Field`)}
          visible={popupVisible}
        >
          <ScrollView width={"100%"} height={600}>
            <form
              id={"editForm"}
              ref={formRef}
              onSubmit={handleSubmit(handleSave)}
            >
              <Controller
                name={"ColGrpCodeSys"}
                control={control}
                render={({ field }) => {
                  return (
                    <SelectboxField
                      field={field}
                      label={t("ColGrpCodeSys")}
                      dataSource={listGroup}
                      valueExpr={"ColGrpCodeSys"}
                      displayExpr={"ColGrpName"}
                      error={errors.ColGrpCodeSys}
                      required={true}
                      readonly={
                        flag !== "add" && currentItem.FlagIsColDynamic != "1"
                      }
                      customFunction={handleFindIdx}
                    />
                  );
                }}
                rules={{
                  required: {
                    value: true,
                    message: validateMessage("ColGrpCodeSys is required!"),
                  },
                }}
              />
              <Controller
                name={"ColCode"}
                control={control}
                render={({ field }) => {
                  return (
                    <SelectboxField
                      field={field}
                      label={t("ColCaption")}
                      dataSource={listColumn}
                      valueExpr={"ColCode"}
                      displayExpr={"ColCaption"}
                      readonly={
                        flag !== "add" && currentItem.FlagIsColDynamic != "1"
                      }
                      required
                      customFunction={handleChange}
                      error={errors.ColCode}
                    />
                  );
                }}
                rules={{
                  required: {
                    value: true,
                    message: validateMessage("ColCode is required!"),
                  },
                }}
              />
              <Controller
                name={"ColCode"}
                control={control}
                render={({ field }) => {
                  return (
                    <TextboxField
                      field={field}
                      label={t("ColCode")}
                      disabled={true}
                    />
                  );
                }}
              />

              <Controller
                name={"ColDataType"}
                control={control}
                render={({ field }) => {
                  return (
                    <TextboxField
                      field={field}
                      label={t("ColDataType")}
                      disabled={true}
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
                <div className={"w-full ml-[210px]"}>
                  {singleChoiceValuesFields.map((field: any, index: any) => {
                    const { ref, onChange, ...restField } = register(
                      `ListOption.${index}.Value` as const
                    );
                    const { onChange: onDefaultChange, ...restDefaultField } =
                      register(`ListOption.${index}.IsSelected` as const, {});
                    return (
                      <div key={field.id} className={"flex items-center my-2"}>
                        <CheckBox
                          className={"mr-2"}
                          {...restDefaultField}
                          value={getValues(`ListOption.${index}.IsSelected`)}
                          readOnly
                        />
                        <TextBox
                          ref={ref}
                          {...restField}
                          defaultValue={field?.Value ?? ""}
                          readOnly
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              {(dataTypeValue === "MASTERDATA" ||
                dataTypeValue === "MASTERDATASELECTMULTIPLE") && (
                <>
                  <Controller
                    name={"DataSource"}
                    control={control}
                    render={({ field }) => {
                      return (
                        <TextboxField
                          field={field}
                          label={t("DataSource")}
                          disabled={true}
                        />
                      );
                    }}
                  />
                </>
              )}

              <Controller
                name={"OrderIdx"}
                control={control}
                render={({ field }) => {
                  return (
                    <TextboxField
                      field={field}
                      label={t("OrderIdx")}
                      disabled={true}
                    />
                  );
                }}
              />

              {isSearchable && isSearchableType(dataTypeValue) && (
                <Controller
                  name={"ColOperatorType"}
                  control={control}
                  render={({ field }) => {
                    return (
                      <SelectboxField
                        field={field}
                        required
                        label={t("ColOperatorType")}
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
                  rules={{
                    required: {
                      value: true,
                      message: validateMessage("ColOperatorType is required!"),
                    },
                  }}
                />
              )}

              <Controller
                name={"FlagIsNotNull"}
                control={control}
                render={({ field }) => {
                  return (
                    <CheckboxField field={field} label={t("FlagIsNotNull")} />
                  );
                }}
              />

              <Controller
                name={"FlagIsCheckDuplicate"}
                control={control}
                render={({ field }) => {
                  return (
                    <CheckboxField
                      field={field}
                      label={t("FlagIsCheckDuplicate")}
                    />
                  );
                }}
              />

              <Controller
                name={"FlagActive"}
                control={control}
                render={({ field }) => {
                  return (
                    <CheckboxField
                      field={field}
                      label={t("FlagActive")}
                      readonly={flag != "update"}
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
            {
              <Button
                text={common("Save")}
                type={"default"}
                stylingMode={"contained"}
                onClick={handleSaveClick}
                className={"mx-2 w-[100px]"}
              />
            }

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
