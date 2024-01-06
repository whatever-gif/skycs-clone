import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import {
  Button,
  Popup,
  ScrollView,
  SelectBox,
  TextBox,
} from "devextreme-react";
import CustomStore from "devextreme/data/custom_store";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { defaultAvatar } from "./AvatarField";

export const CustomerCodeInvoiceField = ({
  component,
  formData,
  field,
  editType,
}: any) => {
  const { t } = useI18n("StaticFieldCommon");

  const { t: common } = useI18n("Common");

  const { t: validate } = useI18n("Validate");

  const [value, setValue] = useState<any>(
    formData["CustomerCodeInvoice"] ?? undefined
  );

  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const [currentCustomer, setCurrentCustomer] = useState<any>(null);

  const handleOpen = () => {
    setOpenPopup(true);
  };

  const handleClose = () => {
    setOpenPopup(false);
  };

  const ref: any = useRef();

  const api = useClientgateApi();

  const store = new CustomStore({
    key: "CustomerCode",

    load: async (loadOptions) => {
      const resp: any = await api.Mst_Customer_Search({
        Keyword: loadOptions?.searchValue,
        FlagActive: 1,
        Ft_PageIndex: 0,
        Ft_PageSize: 100,
      });
      return resp?.DataList ?? [];
    },

    byKey: async (key) => {
      return [];
    },
  });

  const handleChoose = () => {
    const data = ref?.current?.instance?.option("value");

    if (!data) {
      toast.error(validate("Please select a customer!"));
    }

    component.updateData("CustomerCodeInvoice", data?.CustomerCode);

    setValue(data?.CustomerCode);

    handleClose();
  };

  const renderItem = (data: any) => {
    return (
      <div className="flex gap-3 items-center">
        <div>
          <img
            src={data?.CustomerAvatarPath ?? defaultAvatar}
            alt=""
            className="h-[50px] w-[50px] rounded-[50%] shadow-lg"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-semibold text-sm">{data?.CustomerName}</div>
          <div className="text-xs italic">
            {t("CustomerCode")}: {data?.CustomerCode}
          </div>
        </div>
      </div>
    );
  };

  const renderListZalo = () => {
    return (
      <>
        <SelectBox
          dataSource={store}
          ref={ref}
          // valueExpr="user_id"
          showClearButton
          itemRender={renderItem}
          dropDownOptions={{
            minHeight: 300,
          }}
          searchEnabled
          displayExpr="CustomerName"
          onValueChanged={(e: any) => {
            setCurrentCustomer(e.value);
          }}
        ></SelectBox>

        {currentCustomer?.CustomerCode && currentCustomer?.CustomerName && (
          <div className="flex gap-3 items-center mt-2">
            <div>
              <img
                src={currentCustomer?.CustomerAvatarPath ?? defaultAvatar}
                alt=""
                className="h-[50px] w-[50px] rounded-[50%] shadow-lg"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-sm">
                {currentCustomer?.CustomerName}
              </div>
              <div className="text-xs italic">
                {t("CustomerCode")}: {currentCustomer?.CustomerCode}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderZalo = () => {
    return (
      <div className="flex items-center gap-2">
        <TextBox className="flex-grow" readOnly value={value} />

        {editType != "detail" && (
          <Button
            text={t("Choose")}
            type={"default"}
            stylingMode={"contained"}
            onClick={() => {
              handleOpen();
            }}
            className={"w-[100px]"}
          />
        )}

        <Popup
          visible={openPopup}
          hideOnOutsideClick={true}
          onHiding={handleClose}
          showCloseButton
          width={500}
          height={300}
          title={t("Choose Customer")}
          toolbarItems={[
            {
              visible: true,
              widget: "dxButton",
              toolbar: "bottom",
              location: "after",
              options: {
                text: common("Choose"),
                type: "default",
                onClick: handleChoose,
              },
            },
          ]}
          contentRender={() => (
            <ScrollView showScrollbar="always" width="100%" height="100%">
              <div>{renderListZalo()}</div>
            </ScrollView>
          )}
        ></Popup>
      </div>
    );
  };

  const renderZaloDetail = () => {
    return <div className="font-semibold">{value ?? "---"}</div>;
  };

  return (
    <>
      {editType == "detail" ? <>{renderZaloDetail()}</> : <>{renderZalo()}</>}
    </>
  );
};
