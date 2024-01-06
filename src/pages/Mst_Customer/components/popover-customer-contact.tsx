import { defaultAvatar } from "@/components/fields/AvatarField";
import { useI18n } from "@/i18n/useI18n";
import { useNetworkNavigate } from "@/packages/hooks";
import { Popup } from "devextreme-react";
import { useState } from "react";

const PopoverCustomerContact = ({ param }: any) => {
  const { t } = useI18n("PopupCustomerContact");

  const navigate = useNetworkNavigate();

  const [open, setOpen] = useState<boolean>(false);

  const listContact = JSON.parse(param?.data?.CustomerContactJson ?? "[]");

  const handleOpenPopup = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCustomer = (code: any) => {
    navigate(`/customer/detail/${code}`);
  };

  const handleRender = () => {
    return (
      <>
        {listContact?.length > 0 && (
          <div className="popover-list rounded-lg">
            <div className="flex flex-col gap-2">
              {listContact?.map((item: any, index: any) => {
                return (
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-[#00703c] hover:text-white p-1 rounded-[10px] duration-100 group"
                    onClick={() => handleCustomer(item?.CustomerCodeSysContact)}
                  >
                    <div className="w-[20px] h-[20px] group-hover:bg-rose-500 flex items-center justify-center rounded-[50%] group-hover:shadow-lg">
                      {index + 1}
                    </div>
                    <img
                      src={
                        item?.Mst_Customer[0]?.CustomerAvatarPath ??
                        defaultAvatar
                      }
                      alt=""
                      className="w-[30px] h-[30px] rounded-[50%] shadow-md"
                    />
                    <div className="">
                      {item?.Mst_Customer[0]?.CustomerName}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="popover-container">
      <div
        className="hover:text-[#00703c] hover:underline cursor-pointer"
        onClick={handleOpenPopup}
      >
        {param?.displayValue}
      </div>
      <Popup
        visible={open}
        onHidden={handleClose}
        hideOnOutsideClick
        width={400}
        height={400}
        title={t("List Contact")}
        showCloseButton
        contentRender={handleRender}
      ></Popup>
    </div>
  );
};

export default PopoverCustomerContact;
