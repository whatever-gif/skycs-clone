
import { useClientgateApi } from "@/packages/api";
import { notifApi, notifyApi } from "@/packages/api/notification-api";
import { useAuth } from "@/packages/contexts/auth"
import { Button, ContextMenu, ScrollView } from "devextreme-react";
import { Position } from "devextreme-react/context-menu";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useState } from "react";

export const NotificationList = () => {
    const notify = notifyApi();

    const StatusAll = 99;
    const StatusUnread = 0;

    const { auth } = useAuth();

    const [readStatus, setReadStatus] = useState(StatusAll);
    const [reload, setReload] = useState(0);
    const menuItems_Status = useMemo(() => ([
        {
            text: 'Tất cả',
            //icon: 'user',
            onClick: () => {
                setReadStatus(StatusAll);
            }

        },
        {
            text: 'Chưa đọc',
            //icon: 'user',
            onClick: () => {
                setReadStatus(StatusUnread);
            }

        },

    ]), []);

    const [data, setData] = useState<any>();


    const viewItem = (item: any) => {

        notify.markAsRead(auth.networkId, [{ Id: item.Id }]).then((resp: any) => {
            //console.log(resp);
            if (resp.Success) {
                setReload((r) => { return r + 1; });
            }

        });
        //alert(item.Id);

    }

    const markAllAsRead = () => {

        if (!!data && data.List && data.List.length > 0) {


            let pdata = data.List.filter((i: any) => i.Status == 0).map((it: any) => { return { Id: it.Id } });

            if (pdata.length > 0) {

                notify.markAsRead(auth.networkId, pdata).then((resp: any) => {
                    //console.log(resp);
                    if (resp.Success) {
                        setReload((r) => { return r + 1; });
                    }

                });
            }
        }

    }

    // const fetchData = async () => {
    //     var response: any = await api.Notification_Search({ networkId: auth.networkId, pageIndex: 0, pageSize: 100, status: readStatus, solutionCode: '' });

    //     var resp= response;
    //     console.log(resp);
    //     if (resp._objResult && resp._objResult.Success) {
    //         var retData = resp._objResult.Data;
    //         console.log(retData);
    //         setData(retData);
    //     }


    // }
    useEffect(() => {
        notify.searchNotification(auth.networkId, { pageIndex: 0, pageSize: 100, status: readStatus, solutionCode: '' }).then((resp: any) => {
            //console.log(resp);
            if (resp.Success) {
                setData(resp.InosNotificationResult);
            }

        });

        //fetchData();



    }, [readStatus, reload]);

    const NotifItem = ({ item }: { item: any }) => {
        return <>
            <div className={`w-full notification-item p-1 cursor-pointer ${item.Status == 0 ? 'unread' : ''}`} onClick={() => { viewItem(item); }}>
                <div className="flex w-full">
                    <img className="sl-img mr-1 mt-1" src={`/images/solutions/${item.SolutionCode.toLowerCase()}.svg`} />
                    <div>
                        <span className="detail">{item.DetailRemoveTagsHtml}</span><br></br>
                        <span className="time"><i className="dx-icon-clock" /> {item.CreateDTime}</span>
                    </div>
                </div>
            </div>

        </>
    }

    return <>

        <div className="notifications w-full">

            <div className="w-full head p-1">
                <div className="flex float-right" style={{ textAlign: "right" }}>
                    <i className="dx-icon-activefolder mr-1 mt-1 cursor-pointer" onClick={() => {
                        if (confirm('Đánh dấu tất cả đã đọc'))
                            markAllAsRead();
                    }} />
                    <span className="sep mt-1 mr-2"></span>
                    <i className="dx-icon-preferences mt-1 cursor-pointer" />

                </div>
                <div className="flex" style={{ width: '60%' }}>
                    <span className="notif-read-status mr-5 mn-dropdown" >
                        {readStatus == StatusAll && <>Tất cả</>}
                        {readStatus == StatusUnread && <>Chưa đọc</>}
                        <i className="dx-icon-chevrondown ml-1" />
                    </span>

                    <ContextMenu
                        items={menuItems_Status}
                        target={`.notif-read-status`}

                        showEvent={'dxclick'}
                        cssClass={''}
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
                {!!data && data.List && data.List.length > 0 ? <>

                    {data.List.map((item: any) => {
                        return <NotifItem item={item} key={nanoid()} />;
                    })}


                </> : <center className="p-3">Không có dữ liệu</center>}
            </div>
            <div className="w-full float-left p-1">
                <p>Xem tất cả</p>
            </div>
        </div>
    </>
}