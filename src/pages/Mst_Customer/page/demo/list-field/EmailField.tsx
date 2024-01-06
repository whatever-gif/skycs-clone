import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { Icon } from "@/packages/ui/icons";
import { Button, Popup, TextBox, Validator } from "devextreme-react";
import { CustomRule, RequiredRule } from "devextreme-react/form";
import { nanoid } from "nanoid";
import React, { useState } from "react";

export const checkEmail = (list: any[]) => {
  if (!list) {
    return true;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const allValid = list?.every((item) => {
    return emailRegex.test(item?.CtmEmail);
  });

  return allValid;
};

export const EmailField = ({
  field,
  readOnly,
  label,
  required,
  direction = "horizontal",
  error,
}: any) => {
  const { t } = useI18n("StaticFieldCommon");

  const { value: emails, onChange, ...rest } = field;

  const api = useClientgateApi();

  const [open, setOpen] = useState<boolean>(false);

  const [currentEmail, setCurrentEmail] = useState<any>(undefined);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validatorRef: any = React.useRef(null);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleRemoveItem = async (id: string) => {
    const result = emails.filter((_: any, i: number) => _.id !== id);

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
    const result = emails.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          CtmEmail: val,
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

  const handleCheck = async (id: string) => {
    const result = emails.map((item: any) => {
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

  const handleRemoveEmail = async (Email: any) => {
    const result = emails.filter((_: any, i: number) => _.CtmEmail !== Email);

    const r = emails.every((item: any) => item?.FlagDefault == 0);

    console.log(result, r);

    if (r && result && result[0]) {
    }

    await onChange({
      target: {
        name: rest.name,
        value: result,
      },
    });
  };

  const handleFindEmail = async (Email: any) => {
    if (!Email) {
      return false;
    }

    const resp: any = await api.Mst_Customer_Search({
      FlagActive: 1,
      Ft_PageIndex: 0,
      Ft_PageSize: 1000,
      CtmEmail: Email,
    });

    return resp?.DataList && resp?.DataList?.length > 0;
  };

  const handleFocusOut = async (e: any) => {
    const currentValue = e?.component?._changedValue;

    if (!currentValue || !emailRegex.test(currentValue)) {
      return;
    }

    setCurrentEmail(currentValue);

    const result = await handleFindEmail(currentValue);

    if (result) {
      handleOpen();
    }
  };

  const handleDecline = async () => {
    if (currentEmail) {
      await handleRemoveEmail(currentEmail);
      setCurrentEmail(undefined);
    }

    handleClose();
  };

  const handleAdd = async () => {
    const result = [
      ...emails,
      {
        id: nanoid(),
        FlagDefault: emails.length == 0 ? "1" : "0",
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

  const renderEmail = () => {
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
            {emails.map((item: any, index: any) => {
              return (
                <div key={item.id} className={"flex items-center"}>
                  <input
                    type={"radio"}
                    className="mr-2"
                    onChange={async (e: any) => {
                      handleCheck(item.id);
                    }}
                    checked={item.FlagDefault == "1"}
                    disabled={!item.CtmEmail || readOnly}
                    readOnly={readOnly}
                  />
                  <TextBox
                    onValueChanged={async (e: any) =>
                      handleEditItem(item.id, e.value)
                    }
                    validationMessageMode={"always"}
                    value={item.CtmEmail}
                    readOnly={readOnly}
                    onFocusOut={handleFocusOut}
                    placeholder="Nhập"
                  >
                    <Validator ref={validatorRef}>
                      <RequiredRule message="Vui lòng nhập Email!" />
                      <CustomRule
                        message="Vui lòng nhập đúng định dạng Email!"
                        validationCallback={(options) => {
                          const value: any = options.value;
                          return emailRegex.test(value);
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
              Thông tin email {currentEmail} đã tồn tại, bạn vẫn muốn lưu?
            </p>
          </Popup>
        </div>
      </div>
    );
  };

  const renderEmailDetail = () => {
    const result =
      emails?.find((item: any) => item?.FlagDefault == "1")?.CtmEmail ?? "---";

    return (
      <div className="font-semibold flex flex-col gap-1">
        {emails?.map((item: any) => {
          return (
            <div className="flex items-center gap-1">
              <div className="w-[4px] h-[4px] bg-black rounded-[50%]"></div>
              <div>{item?.CtmEmail}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return <>{readOnly ? <>{renderEmailDetail()}</> : <>{renderEmail()}</>}</>;
};
