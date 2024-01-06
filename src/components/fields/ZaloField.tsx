import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { Icon } from "@/packages/ui/icons";
import { Button, Popup, ScrollView, SelectBox } from "devextreme-react";
import CustomStore from "devextreme/data/custom_store";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

export const ZaloField = ({ component, formData, field, editType }: any) => {
  const { t } = useI18n("StaticFieldCommon");

  const { t: common } = useI18n("Common");

  const [zaloList, setZaloList] = useState<any>(
    formData["ZaloUserFollowerId"] || []
  );

  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const [currentId, setCurrentId] = useState<any>(undefined);

  const [openPopupWarning, setOpenPopupWarning] = useState<boolean>(false);

  const handleOpen = () => {
    setOpenPopup(true);
  };

  const handleClose = () => {
    setOpenPopup(false);
  };

  const handleOpenPopupWarning = () => {
    setOpenPopupWarning(true);
  };

  const handleClosePopupWarning = () => {
    setOpenPopupWarning(false);
  };

  const handleRemoveItem = (id: string) => {
    const result = zaloList.filter(
      (_: any, i: number) => _.ZaloUserFollowerId !== id
    );

    component.updateData("ZaloUserFollowerId", result);

    setZaloList(
      zaloList.filter((_: any, i: number) => _.ZaloUserFollowerId !== id)
    );
  };
  const handleEditItem = (id: string, val: any) => {
    /// edit item at `index` from `ZaloUserFollowerId` list
    const result = zaloList.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          value: val,
        };
      }
      return item;
    });
    component.updateData("ZaloUserFollowerId", result);

    setZaloList(result);
  };
  // setFormValue(formData);

  const handleCheck = (id: string) => {
    const result = zaloList.map((item: any) => {
      return {
        ...item,
        FlagDefault: item.id == id ? "1" : "0",
      };
    });

    component.updateData("ZaloUserFollowerId", result);

    setZaloList(result);
  };

  const handleAdd = (value: any) => {
    component.updateData("ZaloUserFollowerId", [
      ...zaloList,
      {
        id: zaloList.length + 1,
        ZaloUserFollowerId: value?.user_id,
        Avatar: value?.avatar,
        Name: value?.display_name,
        FlagDefault: zaloList.length == 0 ? "1" : "0",
        SolutionCode: "SKYCS",
      },
    ]);
    setZaloList([
      ...zaloList,
      {
        id: zaloList.length + 1,
        ZaloUserFollowerId: value?.user_id,
        Avatar: value?.avatar,
        Name: value?.display_name,
        FlagDefault: zaloList.length == 0 ? "1" : "0",
        SolutionCode: "SKYCS",
      },
    ]);
    handleClose();
  };

  const ref: any = useRef();

  const api = useClientgateApi();

  const store = new CustomStore({
    key: "user_id",

    load: async (loadOptions) => {
      const resp: any = await api.Zalo_SearchZaloUser({
        ZaloUserName: loadOptions?.searchValue,
      });
      return resp?.Data ?? [];
    },

    byKey: async (key) => {
      return [];
    },
  });

  const handleChoose = async () => {
    const value = ref?.current?.instance?.option("value");

    if (!value) {
      return;
    }

    if (
      value &&
      !zaloList?.find((item: any) => item?.ZaloUserFollowerId == value?.user_id)
    ) {
      setCurrentId(value?.user_id);

      handleAdd(value);

      const result = await handleFindZalo(value?.user_id);

      if (result) {
        handleOpenPopupWarning();
      }
    } else {
      toast.error("Người dùng đã tồn tại!");
    }
  };

  const renderItem = (data: any) => {
    return (
      <div className="flex gap-3 items-center">
        <div>
          <img
            src={data?.avatar}
            alt=""
            className="h-[50px] w-[50px] rounded-[50%] shadow-lg"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-semibold text-sm">{data?.display_name}</div>
          <div className="text-xs italic">ID: {data?.user_id}</div>
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
          displayExpr="display_name"
        ></SelectBox>

        <div className="mt-[10px] flex justify-end">
          <Button
            style={{
              padding: 10,
              background: "#00703c",
              color: "white",
            }}
            onClick={handleChoose}
          >
            {common("Choose")}
          </Button>
        </div>
      </>
    );
  };

  const renderZalo = () => {
    return (
      <div className="flex items-center gap-2">
        {zaloList?.length > 0 && (
          <div className="flex flex-col gap-1">
            {zaloList.map((item: any, index: any) => {
              return (
                <div key={item.id} className={"flex items-center"}>
                  <input
                    type={"radio"}
                    className={"mr-2"}
                    onChange={async (e: any) => {
                      handleCheck(item.id);
                    }}
                    checked={item.FlagDefault == "1"}
                    disabled={!item.ZaloUserFollowerId || editType == "detail"}
                  />

                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-md">
                    {item.Avatar && (
                      <div
                        className="w-[50px] h-[50px] overflow-hidden flex items-center justify-center shadow-lg"
                        style={{ borderRadius: "50%" }}
                      >
                        <img
                          src={item.Avatar}
                          alt=""
                          className="w-full h-full"
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      {item.Name && (
                        <div className="font-semibold text-sm">{item.Name}</div>
                      )}
                      <div className="text-xs italic">
                        ID: {item?.ZaloUserFollowerId}
                      </div>
                    </div>

                    {editType != "detail" && (
                      <Button
                        onClick={() =>
                          handleRemoveItem(item.ZaloUserFollowerId)
                        }
                        stylingMode={"text"}
                      >
                        <Icon name={"trash"} size={14} color={"#ff5050"} />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {editType != "detail" && (
          <Button
            text={t("Add")}
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
          title="ZaloUserFollowerId"
          contentRender={() => (
            <ScrollView showScrollbar="always" width="100%" height="100%">
              <div>{renderListZalo()}</div>
            </ScrollView>
          )}
        ></Popup>

        {renderPopupWarning()}
      </div>
    );
  };

  const renderZaloDetail = () => {
    const result =
      zaloList?.find((item: any) => item?.FlagDefault == "1")
        ?.ZaloUserFollowerId ?? "---";

    return (
      <div className="font-semibold flex flex-col gap-1">
        {zaloList?.map((item: any) => {
          return (
            <div className="flex items-center gap-1">
              <div className="w-[4px] h-[4px] bg-black rounded-[50%]"></div>
              <div>{item?.ZaloUserFollowerId}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleFindZalo = async (id: any) => {
    if (!id) {
      return false;
    }

    const resp: any = await api.Mst_Customer_Search({
      FlagActive: 1,
      Ft_PageIndex: 0,
      Ft_PageSize: 1000,
      ZaloUserFollowerId: id,
    });

    return resp?.DataList && resp?.DataList?.length > 0;
  };

  const handleDecline = () => {
    if (currentId) {
      handleRemoveItem(currentId);
      setCurrentId(undefined);
    }

    handleClosePopupWarning();
  };

  const renderPopupWarning = () => {
    return (
      <Popup
        visible={openPopupWarning}
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
              onClick: handleClosePopupWarning,
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
          Thông tin ZaloUserFollowerId {currentId} đã tồn tại, bạn vẫn muốn lưu?
        </p>
      </Popup>
    );
  };

  return (
    <>
      {editType == "detail" ? <>{renderZaloDetail()}</> : <>{renderZalo()}</>}
    </>
  );
};
