import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { Icon } from "@/packages/ui/icons";
import { Button, Popup, TextBox, Validator } from "devextreme-react";
import { CustomRule, RequiredRule } from "devextreme-react/form";
import { nanoid } from "nanoid";
import React, { useState } from "react";

export const checkPhone = (list: any[]) => {
  if (!list || list.length == 0) {
    return false;
  }

  const numberRegex = /^[0-9]*$/;

  const allValid = list?.every((item) => {
    return (
      numberRegex.test(item?.CtmPhoneNo) &&
      item?.CtmPhoneNo &&
      item?.CtmPhoneNo != null &&
      item?.CtmPhoneNo.length >= 10 &&
      item?.CtmPhoneNo.length <= 11
    );
  });

  return allValid;
};

export const PhoneField = ({
  field,
  readOnly,
  direction = "horizontal",
  error,
  label,
  required,
}: any) => {
  const { value: phones, onChange, ...rest } = field;

  const { t } = useI18n("StaticFieldCommon");

  const api = useClientgateApi();

  const validatorRef: any = React.useRef(null);

  const numberRegex = /^[0-9]*$/;

  const [open, setOpen] = useState<boolean>(false);

  const [currentPhone, setCurrentPhone] = useState<any>(undefined);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemoveItem = async (id: string) => {
    const result = phones.filter((_: any, i: number) => _.id !== id);

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
    const result = phones.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          CtmPhoneNo: val,
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
  // setFormValue(formData);

  const handleCheck = async (id: string) => {
    const result = phones.map((item: any) => {
      return {
        ...item,
        FlagDefault: item.id == id ? "1" : "0",
      };
    });

    await onChange({
      target: {
        name: rest.name,
        value: result,
      },
    });
  };

  const handleFindPhoneNo = async (phoneNo: any) => {
    if (!phoneNo) {
      return false;
    }

    const resp: any = await api.Mst_Customer_Search({
      FlagActive: 1,
      Ft_PageIndex: 0,
      Ft_PageSize: 1000,
      CtmPhoneNo: phoneNo,
    });

    return resp?.DataList && resp?.DataList?.length > 0;
  };

  const handleRemovePhone = async (phoneNo: any) => {
    const result = phones.filter(
      (_: any, i: number) => _.CtmPhoneNo !== phoneNo
    );

    await onChange({
      target: {
        name: rest.name,
        value: result,
      },
    });
  };

  const handleFocusOut = async (e: any) => {
    const currentValue = e?.component?._changedValue;

    if (
      !currentValue ||
      currentValue?.length < 10 ||
      currentValue?.length > 11 ||
      !numberRegex.test(currentValue)
    ) {
      return;
    }

    setCurrentPhone(currentValue);

    const result = await handleFindPhoneNo(currentValue);

    if (result) {
      handleOpen();
    }
  };

  const handleDecline = async () => {
    if (currentPhone) {
      await handleRemovePhone(currentPhone);
      setCurrentPhone(undefined);
    }

    handleClose();
  };

  const handleAdd = async () => {
    const result = [
      ...phones,
      {
        id: nanoid(),
        FlagDefault: phones.length == 0 ? "1" : "0",
        CtmPhoneNo: null,
      },
    ];

    await onChange({
      target: {
        name: rest.name,
        value: result,
      },
    });
  };

  const renderPhone = () => {
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

        <div className="flex items-center gap-[20px]">
          <div className="flex flex-col gap-[6px]">
            {phones.map((item: any, index: any) => {
              return (
                <div key={item.id} className={"flex items-center "}>
                  <input
                    type={"radio"}
                    className={"mr-2"}
                    onChange={async (e: any) => {
                      await handleCheck(item.id);
                    }}
                    checked={item.FlagDefault == "1"}
                    disabled={!item.CtmPhoneNo || readOnly}
                  />
                  <TextBox
                    onValueChanged={async (e: any) =>
                      handleEditItem(item.id, e.value)
                    }
                    placeholder="Nhập"
                    validationMessageMode={"always"}
                    value={item.CtmPhoneNo}
                    readOnly={readOnly}
                    onFocusOut={handleFocusOut}
                    maxLength={11}
                    className="w-full"
                  >
                    <Validator ref={validatorRef}>
                      {/* Add any other validation rules if needed */}
                      <RequiredRule message="Vui lòng nhập Số điện thoại!" />
                      <CustomRule
                        message="Vui lòng nhập đúng định dạng Số điện thoại!"
                        validationCallback={(options) => {
                          const value: any = options.value;
                          return numberRegex.test(value);
                        }}
                      />
                      <CustomRule
                        message="Vui lòng nhập đúng định dạng Số điện thoại!"
                        validationCallback={(options: any) => {
                          const value = options.value;
                          return numberRegex.test(value) && value.length >= 10;
                        }}
                      />
                    </Validator>
                  </TextBox>
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
              onClick={handleAdd}
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
                  text: "Đồng ý",
                  type: "primary",
                  style: {
                    padding: "10px 20px",
                    marginRight: 5,
                    background: "green",
                    color: "white",
                  },
                  onClick: handleClose,
                },
              },
              {
                visible: true,
                widget: "dxButton",
                toolbar: "bottom",
                location: "after",
                options: {
                  text: "Hủy",
                  type: "default",
                  onClick: handleDecline,
                },
              },
            ]}
          >
            <p className="text-base">
              Thông tin số điện thoại {currentPhone} đã tồn tại, bạn vẫn muốn
              lưu?
            </p>
          </Popup>
        </div>
      </div>
    );
  };

  const renderPhoneDetail = () => {
    const result =
      phones?.find((item: any) => item?.FlagDefault == "1")?.CtmPhoneNo ??
      "---";
    return (
      <div className="font-semibold flex flex-col gap-1">
        {phones?.map((item: any) => {
          return (
            <div className="flex items-center gap-1">
              <div className="w-[4px] h-[4px] bg-black rounded-[50%]"></div>
              <div>{item?.CtmPhoneNo}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return <>{readOnly ? <>{renderPhoneDetail()}</> : <>{renderPhone()}</>}</>;
};
