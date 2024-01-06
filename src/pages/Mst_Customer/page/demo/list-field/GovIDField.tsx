import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { Icon } from "@/packages/ui/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  LoadPanel,
  Popup,
  SelectBox,
  TextBox,
  Validator,
} from "devextreme-react";
import { RequiredRule } from "devextreme-react/form";
import { nanoid } from "nanoid";
import React, { useState } from "react";

export const checkGovID = (list: any[]) => {
  if (!list || list.length == 0) {
    return false;
  }

  const allValid = list?.every((item) => {
    return item?.GovID && item?.GovIDType;
  });

  return allValid;
};

export const GovIDField = ({
  field,
  readOnly,
  required,
  error,
  direction = "horizontal",
  label,
}: any) => {
  const { value, onChange, ...rest } = field;

  const { t } = useI18n("StaticFieldCommon");
  const { t: placeholder } = useI18n("Placeholder");
  const { t: common } = useI18n("Common");

  const api = useClientgateApi();

  const [open, setOpen] = useState<boolean>(false);

  const [currentGovID, setCurrentGovID] = useState<any>(undefined);

  const [currentCustomer, setCurrentCustomer] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validatorRef: any = React.useRef(null);

  const { data: listGovType } = useQuery(["listGovType", value], async () => {
    const resp: any = await api.MstGovIDType_GetAllActive();

    const list = resp?.DataList ?? [];

    const result = list?.map((item: any) => {
      if (value?.some((c: any) => c?.GovIDType == item?.GovIDType)) {
        return {
          ...item,
          disabled: true,
        };
      }

      return {
        ...item,
        disabled: false,
      };
    });

    return result;
  });

  const handleRemoveItem = async (id: string) => {
    const result = value.filter((_: any, i: number) => _.id !== id);

    const check = result?.some((_: any) => _?.FlagDefault == "1");

    if (!check) {
      const expectedResult = result?.map((_: any, i: number) => {
        if (i == 0) {
          return {
            ..._,
            FlagDefault: "1",
          };
        }
        return _;
      });

      await onChange({
        target: {
          name: rest.name,
          value: expectedResult,
        },
      });
    } else {
      await onChange({
        target: {
          name: rest.name,
          value: result,
        },
      });
    }
  };

  const handleEditItem = async (id: string, val: any) => {
    const result = value.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          GovID: val,
        };
      }
      return item;
    });
    await onChange({
      target: {
        name: rest.name,
        value: result,
      },
    });
  };

  const handleChoose = async (id: string, crValue: any) => {
    const result = value.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          GovIDType: crValue,
        };
      }
      return item;
    });

    await onChange({
      target: {
        name: rest.name,
        value: result,
      },
    });
  };

  const handleRemoveGovID = async (crGovID: any) => {
    const result = value?.map((_: any, i: number) => {
      if (crGovID?.id == _.id)
        return {
          ..._,
          GovID: null,
        };

      return _;
    });

    await onChange({
      target: {
        name: rest.name,
        value: result,
      },
    });
  };

  const handleFindGovID = async (crGovID: any) => {
    if (!crGovID?.GovID || !crGovID?.GovIDType) {
      return false;
    }

    setLoading(true);

    const resp: any = await api.Mst_Customer_Search({
      FlagActive: 1,
      Ft_PageIndex: 0,
      Ft_PageSize: 1,
      GovID: crGovID.GovID,
      GovIDType: crGovID.GovIDType,
    });

    setLoading(false);

    if (resp?.isSuccess && resp?.DataList) {
      setCurrentCustomer(resp?.DataList?.[0] ?? null);
    }

    return resp?.DataList && resp?.DataList?.length > 0;
  };

  const handleFocusOut = async (id: any, e: any, type: any) => {
    const currentValue = e?.component?._changedValue;

    if (!currentValue || !type) {
      return;
    }

    const typeName = listGovType?.find(
      (item: any) => item?.GovIDType == type
    )?.GovIDTypeName;

    setCurrentGovID({
      id: id,
      GovID: currentValue,
      GovIDType: type,
      GovIDTypeName: typeName,
    });

    const result = await handleFindGovID({
      GovID: currentValue,
      GovIDType: type,
    });

    if (result) {
      handleOpen();
    }
  };

  console.log(currentGovID);

  const handleFocusOutBox = async (id: any, govid: any, e: any) => {
    const currentValue = listGovType?.find(
      (item: any) => item?.GovIDTypeName == e?.component?._changedValue
    )?.GovIDType;

    if (!currentValue || !govid) {
      return;
    }

    setCurrentGovID({
      id: id,
      GovID: govid,
      GovIDType: currentValue,
      GovIDTypeName: e?.component?._changedValue,
    });

    const result = await handleFindGovID({
      GovID: govid,
      GovIDType: currentValue,
    });

    if (result) {
      handleOpen();
    }
  };

  const handleDecline = () => {
    if (currentGovID) {
      handleRemoveGovID(currentGovID);
    }

    handleClose();
  };

  const handleAdd = async () => {
    const newValue = {
      id: nanoid(),
      GovID: null,
      GovIDType: null,
    };

    await onChange({
      target: {
        name: rest.name,
        value: [...value, newValue],
      },
    });
  };

  const renderGovID = () => {
    return (
      <div
        className={` flex ${
          direction == "vertical" ? "flex-col" : "items-center my-[6px] "
        }  ${required ? "required" : ""} ${!!error ? "mb-4" : ""}`}
      >
        <label
          className={`${
            direction == "vertical"
              ? "w-full"
              : "w-[160px] min-w-[160px] pr-[10px]"
          } break-all`}
        >
          {label}
        </label>
        <div className="flex flex-col flex-grow">
          {/* {govIDList?.length > 0 && (
          <div className="flex gap-1">
            <div className="flex-grow">{t("GovID")}</div>
            <div className="w-[200px]">{t("GovIDType")}</div>
            {editType != "detail" && <div className="w-[30px]"></div>}
          </div>
        )} */}

          <LoadPanel visible={loading} />

          <div className="flex-col flex-grow">
            {value?.map((item: any, index: any) => {
              return (
                <div key={item.id} className={"flex items-center mb-3 gap-1"}>
                  <TextBox
                    onValueChanged={async (e: any) =>
                      handleEditItem(item.id, e.value)
                    }
                    validationMessageMode={"always"}
                    value={item.GovID}
                    readOnly={readOnly}
                    onFocusOut={async (e: any) =>
                      await handleFocusOut(item.id, e, item.GovIDType)
                    }
                    className="flex-grow"
                    placeholder={placeholder("Input")}
                  >
                    <Validator ref={validatorRef}>
                      <RequiredRule message="Vui lòng nhập GovID!" />
                    </Validator>
                  </TextBox>
                  <SelectBox
                    items={listGovType}
                    valueExpr="GovIDType"
                    displayExpr="GovIDTypeName"
                    readOnly={readOnly}
                    width={200}
                    onValueChanged={async (e: any) => {
                      await handleChoose(item.id, e?.value);
                    }}
                    value={item?.GovIDType}
                    onFocusOut={async (e: any) =>
                      await handleFocusOutBox(item.id, item.GovID, e)
                    }
                  >
                    <Validator ref={validatorRef}>
                      <RequiredRule message="Vui lòng chọn GovIDType!" />
                    </Validator>
                  </SelectBox>

                  {!readOnly && (
                    <Button
                      onClick={() => handleRemoveItem(item.id)}
                      stylingMode={"text"}
                    >
                      <Icon name={"trash"} size={14} color={"#ff5050"} />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {!readOnly && (
            <Button
              text={t("Add")}
              type={"default"}
              stylingMode={"contained"}
              onClick={() => handleAdd()}
              className={"w-[100px]"}
            />
          )}

          <Popup
            visible={open}
            onHiding={handleClose}
            hideOnOutsideClick={false}
            showTitle={false}
            position="center"
            width={400}
            height={150}
            toolbarItems={[
              {
                visible: true,
                widget: "dxButton",
                toolbar: "bottom",
                location: "after",
                options: {
                  text: common("Cancel"),
                  type: "default",
                  onClick: handleDecline,
                },
              },
            ]}
          >
            <p className="text-base">
              Số giấy tờ bạn nhập đã tồn tại trong thông tin Khách hàng:{" "}
              {currentCustomer?.CustomerCode} - {currentCustomer?.CustomerName}
            </p>
          </Popup>
        </div>
      </div>
    );
  };

  const renderGovIDDetail = () => {
    return (
      <div className="font-semibold flex flex-col gap-1">
        {value?.map((item: any) => {
          return (
            <div className="flex items-center gap-1">
              <div className="w-[4px] h-[4px] bg-black rounded-[50%]"></div>
              <div>
                {item?.GovID} - {item?.mgidt_GovIDTypeName}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return <>{readOnly ? <>{renderGovIDDetail()}</> : <>{renderGovID()}</>}</>;
};
