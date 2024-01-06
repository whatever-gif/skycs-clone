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

export const EmailField = ({ component, formData, field, editType }: any) => {
  const { t } = useI18n("StaticFieldCommon");

  const api = useClientgateApi();

  const [emails, setEmails] = useState<any>(formData["CtmEmail"] || []);

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

  const handleRemoveItem = (id: string) => {
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

      component.updateData("CtmEmail", expectedResult);
      setEmails(expectedResult);
    } else {
      component.updateData("CtmEmail", result);

      setEmails(result);
    }
  };

  const handleEditItem = (id: string, val: any) => {
    const result = emails.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          CtmEmail: val,
        };
      }
      return item;
    });
    component.updateData("CtmEmail", result);
    setEmails(result);
  };

  const handleCheck = (id: string) => {
    const result = emails.map((item: any) => {
      return {
        ...item,
        FlagDefault: item.id == id ? "1" : "0",
      };
    });

    component.updateData("CtmEmail", result);

    setEmails(result);
  };

  const handleRemoveEmail = (Email: any) => {
    const result = emails.filter((_: any, i: number) => _.CtmEmail !== Email);

    component.updateData("CtmEmail", result);

    setEmails(result);
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

  const handleDecline = () => {
    if (currentEmail) {
      handleRemoveEmail(currentEmail);
      setCurrentEmail(undefined);
    }

    handleClose();
  };

  const renderEmail = () => {
    return (
      <div className="flex items-center">
        <div>
          {emails.map((item: any, index: any) => {
            return (
              <div key={item.id} className={"flex items-center my-2"}>
                <input
                  type={"radio"}
                  className="mr-2"
                  onChange={async (e: any) => {
                    handleCheck(item.id);
                  }}
                  checked={item.FlagDefault == "1"}
                  disabled={!item.CtmEmail || editType == "detail"}
                  readOnly={editType == "detail"}
                />
                <TextBox
                  onValueChanged={async (e: any) =>
                    handleEditItem(item.id, e.value)
                  }
                  validationMessageMode={"always"}
                  value={item.CtmEmail}
                  readOnly={editType == "detail"}
                  onFocusOut={handleFocusOut}
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
              const data = formData["CtmEmail"] || [];
              component.updateData("CtmEmail", [
                ...emails,
                {
                  id: nanoid(),
                  FlagDefault: emails.length == 0 ? "1" : "0",
                  CtmEmail: null,
                },
              ]);
              setEmails([
                ...emails,
                {
                  id: nanoid(),
                  FlagDefault: emails.length == 0 ? "1" : "0",
                  CtmEmail: null,
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
            Thông tin email {currentEmail} đã tồn tại, bạn vẫn muốn lưu?
          </p>
        </Popup>
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

  return (
    <>
      {editType == "detail" ? <>{renderEmailDetail()}</> : <>{renderEmail()}</>}
    </>
  );
};
