import { useHub } from "@/packages/hooks/useHub";
import { Button, ContextMenu, Popup } from "devextreme-react";
import "./notification.scss";
import { useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { Position } from "devextreme-react/popup";
import { NotificationList } from "./notification-list";
import { notifApi, notifyApi } from "@/packages/api/notification-api";
import { useAuth } from "@/packages/contexts/auth";
import { ToastContainer, toast } from "react-toastify";
import { useI18n } from "@/i18n/useI18n";

export function NotificationButton() {
  const notify = notifyApi();
  const { t } = useI18n("Notification");
  const myId = useMemo(() => {
    return `toggle-notif-${nanoid()}`;
  }, []);

  const [isPopupVisible, setPopupVisibility] = useState(false);
  const togglePopup = () => {
    setPopupVisibility(!isPopupVisible);
  };

  const StatusAll = 99;
  const StatusUnread = 0;

  const { auth } = useAuth();

  const [readStatus, setReadStatus] = useState(StatusAll);
  const [reload, setReload] = useState(0);
  const [hasNew, setHasNew] = useState(false);

  const menuItems_Status = useMemo(
    () => [
      {
        text: "Tất cả",
        //icon: 'user',
        onClick: () => {
          setReadStatus(StatusAll);
        },
      },
      {
        text: "Chưa đọc",
        //icon: 'user',
        onClick: () => {
          setReadStatus(StatusUnread);
        },
      },
    ],
    []
  );

  const [data, setData] = useState<any>();
  const toastWhenGetNotify = (c: string) => {
    toast(
      <div className="p-[2px]" style={{ color: "#DEDEDE" }}>
        <p className="pb-[10px]">{t("New Notify")} </p>
        <div className="flex" style={{ alignItems: "start", color: "#DEDEDE" }}>
          <img
            className="sl-img mr-[12px] "
            src="/images/solutions/igoss.svg"
          ></img>
          <div>
            <p className="detail">{c}</p>
            {/* <p className="time pt-[6px]">
              <i className="dx-icon-clock" /> {"2 giây trước"}
            </p> */}
          </div>
        </div>
      </div>,
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        className: "toast-notify",
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      }
    );
  };

  const viewItem = (item: any) => {
    notify.markAsRead(auth.networkId, [{ Id: item.Id }]).then((resp: any) => {
      //console.log(resp);
      if (resp.Success) {
        setReload((r) => {
          return r + 1;
        });
      }
    });
    //alert(item.Id);
  };

  const markAllAsRead = () => {
    if (!!data && data.List && data.List.length > 0) {
      let pdata = data.List.filter((i: any) => i.Status == 0).map((it: any) => {
        return { Id: it.Id };
      });

      if (pdata.length > 0) {
        notify.markAsRead(auth.networkId, pdata).then((resp: any) => {
          if (resp.Success) {
            setReload((r) => {
              return r + 1;
            });
          }
        });
      }
    }
  };

  useEffect(() => {
    notify
      .searchNotification(auth.networkId, {
        pageIndex: 0,
        pageSize: 100,
        status: readStatus,
        solutionCode: "",
      })
      .then((resp: any) => {
        if (resp.Success) {
          var d = resp.InosNotificationResult;
          setData(d);
          if (d.UnreadCount > 0) setHasNew(true);
          else setHasNew(false);
        } else {
          setHasNew(false);
        }
      });
  }, [readStatus, reload]);

  const hub = useHub("global");

  useEffect(() => {
    hub.onReceiveMessage("NewNotification", (c) => {
      setReload((r) => {
        return r + 1;
      });
      toastWhenGetNotify(c);
    });
  }, []);

  const NotifItem = ({ item }: { item: any }) => {
    return (
      <>
        <div
          className={`w-full notification-item p-1 cursor-pointer ${
            item.Status == 0 ? "unread" : ""
          }`}
          onClick={() => {
            viewItem(item);
          }}
        >
          <div className="flex w-full">
            <img
              className="sl-img mr-1 mt-1"
              src={`/images/solutions/${item.SolutionCode.toLowerCase()}.svg`}
            />
            <div>
              <span className="detail">{item.DetailRemoveTagsHtml}</span>
              <br></br>
              <span className="time">
                <i className="dx-icon-clock" /> {item.CreateDTime}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  };

  const NotifList = () => {
    return (
      <>
        <div className="notifications w-full">
          <div className="w-full head p-1">
            <div className="flex float-right" style={{ textAlign: "right" }}>
              <i
                className="dx-icon-custom-markasread mr-1 mt-1 cursor-pointer"
                onClick={() => {
                  if (confirm("Đánh dấu tất cả đã đọc")) markAllAsRead();
                }}
              />
              <span className="sep mt-1 mr-2"></span>
              <i className="dx-icon-preferences mt-1 cursor-pointer" />
            </div>
            <div className="flex" style={{ width: "60%" }}>
              <span className="notif-read-status mr-5 mn-dropdown">
                {readStatus == StatusAll && <>Tất cả</>}
                {readStatus == StatusUnread && <>Chưa đọc</>}
                <i className="dx-icon-chevrondown ml-1" />
              </span>

              <ContextMenu
                items={menuItems_Status}
                target={`.notif-read-status`}
                showEvent={"dxclick"}
                cssClass={""}
                width={100}
              >
                <Position
                  at={`left top`}
                  my={`left top`}
                  //of={`#${myId}`}
                  offset={{ x: 0, y: 10 }}
                />
              </ContextMenu>
            </div>
          </div>

          <div className="w-full  d-list">
            {!!data && data.List && data.List.length > 0 ? (
              <>
                {data.List.map((item: any) => {
                  return <NotifItem item={item} key={nanoid()} />;
                })}
              </>
            ) : (
              <center className="p-3">Không có dữ liệu</center>
            )}
          </div>
          <div className="w-full foot cursor-pointer" onClick={() => {}}>
            <center>Xem tất cả</center>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="flex notifications">
        {/* <img src="/images/icons/call.png" onClick={togglePopup} id={myId} /> */}
        {!hasNew && (
          <Button icon="custom-bell" onClick={togglePopup} id={myId}></Button>
        )}
        {hasNew && (
          <div className="relative">
            <Button
              icon="custom-bell-hasnew"
              onClick={togglePopup}
              id={myId}
            ></Button>
            <div
              className="absolute"
              style={{
                top: 0,
                right: 0,
                fontSize: "8px",
                background: "#E96024",
                border: "1px solid white",
                borderRadius: "50%",
                padding: "2px 3px",
                color: "white",
              }}
            >
              {data ? data?.UnreadCount : ""}
            </div>
          </div>
        )}

        <Popup
          visible={isPopupVisible}
          hideOnOutsideClick={true}
          onHiding={togglePopup}
          width={350}
          height={"auto"}
          showTitle={false}
          wrapperAttr={{ class: "phone-popup" }}
        >
          <Position
            at={`right top`}
            my={`right top`}
            of={`#${myId}`}
            offset={{ x: 0, y: 40 }}
          />
          <NotifList />
        </Popup>

        <span className="sep mr-3 mt-1"></span>
      </div>
    </>
  );
}
