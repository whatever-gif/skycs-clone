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

  const numberRegex = /^[-+()0-9]*$/;

  const allValid = list?.every((item) => {
    return (
      numberRegex.test(item?.CtmPhoneNo) &&
      item?.CtmPhoneNo &&
      item?.CtmPhoneNo != null &&
      item?.CtmPhoneNo.length >= 10 &&
      item?.CtmPhoneNo.length <= 20
    );
  });

  return allValid;
};

export const PhoneField = ({ component, formData, field, editType }: any) => {
  const { t } = useI18n("StaticFieldCommon");

  const api = useClientgateApi();

  const validatorRef: any = React.useRef(null);

  const [phones, setPhones] = useState<any>(
    formData["CtmPhoneNo"] || [
      {
        id: nanoid(),
        FlagDefault: "1",
        CtmPhoneNo: null,
      },
    ]
  );

  const numberRegex = /^[-+()0-9]*$/;

  const [open, setOpen] = useState<boolean>(false);

  const [currentPhone, setCurrentPhone] = useState<any>(undefined);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemoveItem = (id: string) => {
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

      component.updateData("CtmPhoneNo", expectedResult);
      setPhones(expectedResult);
    } else {
      component.updateData("CtmPhoneNo", result);

      setPhones(result);
    }
  };
  const handleEditItem = (id: string, val: any) => {
    const result = phones.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          CtmPhoneNo: val,
        };
      }
      return item;
    });

    component.updateData("CtmPhoneNo", result);
    setPhones(result);
  };
  // setFormValue(formData);

  const handleCheck = (id: string) => {
    const result = phones.map((item: any) => {
      return {
        ...item,
        FlagDefault: item.id == id ? "1" : "0",
      };
    });
    component.updateData("CtmPhoneNo", result);

    setPhones(result);
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

  const handleRemovePhone = (phoneNo: any) => {
    const result = phones.filter(
      (_: any, i: number) => _.CtmPhoneNo !== phoneNo
    );

    component.updateData("CtmPhoneNo", result);

    setPhones(result);
  };

  const handleFocusOut = async (e: any) => {
    const currentValue = e?.component?._changedValue;

    if (
      !currentValue ||
      currentValue?.length < 10 ||
      currentValue?.length > 20 ||
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

  const handleDecline = () => {
    if (currentPhone) {
      handleRemovePhone(currentPhone);
      setCurrentPhone(undefined);
    }

    handleClose();
  };

  const renderPhone = () => {
    return (
      <div className="flex items-center">
        <div>
          {phones.map((item: any, index: any) => {
            return (
              <div key={item.id} className={"flex items-center my-4"}>
                <input
                  type={"radio"}
                  className={"mr-2"}
                  onChange={async (e: any) => {
                    handleCheck(item.id);
                  }}
                  checked={item.FlagDefault == "1"}
                  disabled={!item.CtmPhoneNo || editType == "detail"}
                />
                <TextBox
                  onValueChanged={async (e: any) =>
                    handleEditItem(item.id, e.value)
                  }
                  validationMessageMode={"always"}
                  value={item.CtmPhoneNo}
                  readOnly={editType == "detail"}
                  onFocusOut={handleFocusOut}
                  maxLength={20}
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
                {editType != "detail" && (
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

        {editType != "detail" && (
          <Button
            text={t("Add")}
            type={"default"}
            stylingMode={"contained"}
            onClick={() => {
              const formData = component.option("formData");
              const data = formData["CtmPhoneNo"] || [];
              component.updateData("CtmPhoneNo", [
                ...phones,
                {
                  id: nanoid(),
                  FlagDefault: phones.length == 0 ? "1" : "0",
                  CtmPhoneNo: null,
                },
              ]);
              setPhones([
                ...phones,
                {
                  id: nanoid(),
                  FlagDefault: phones.length == 0 ? "1" : "0",
                  CtmPhoneNo: null,
                },
              ]);
              // setFormValue(formData);
              // console.log(formData);
            }}
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
            Thông tin số điện thoại {currentPhone} đã tồn tại, bạn vẫn muốn lưu?
          </p>
        </Popup>
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

  return (
    <>
      {editType == "detail" ? <>{renderPhoneDetail()}</> : <>{renderPhone()}</>}
    </>
  );
};
