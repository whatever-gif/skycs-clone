import { compareDates, getDateNow, getYearMonthDate } from "@/components/ulti";
import { useNetworkNavigate } from "@/components/useNavigate";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { ETICKET_REPONSE } from "@/packages/api/clientgate/ET_TicketApi";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@/packages/layouts/content-searchpanel-layout";
import { showErrorAtom } from "@/packages/store";
import { FlagActiveEnum } from "@/packages/types";
import { useSavedStateForm } from "@/packages/ui/base-gridview/components/use-saved-state-form";
import { GridViewStandard } from "@/packages/ui/base-gridview/gridview-standard";
import {
  SelectionKeyAtom,
  customizeGridSelectionKeysAtom,
  loadingColumnAtom,
} from "@/packages/ui/base-gridview/store/normal-grid-store";
import { useQuery } from "@tanstack/react-query";
import { LoadPanel } from "devextreme-react";
import { confirm } from "devextreme/ui/dialog";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import HeaderPart from "./Components/header-part";
import Eticket_Merger from "./Components/popup/Eticket_Merge";
import Eticket_Split from "./Components/popup/Eticket_Split";
import In_Charge_Of_Tranfer from "./Components/popup/In_Charge_Of_Tranfer";
import TransformCustomer from "./Components/popup/TransformCustomer";
import {
  dataRowAtom,
  popupCustomerVisibleAtom,
  popupMergeVisibleAtom,
  popupSplitVisibleAtom,
  popupVisibleAtom,
} from "./Components/popup/store";
import { SearchPanelEticket } from "./Components/search-panel-eticket";
import { useToolbar } from "./Components/toolbarItem";
import { useColumnSearch } from "./Components/use-column-search";
import { popupDescAtom, useColumn } from "./Components/use-columns";
import { DescriptionPopup } from "./Components/use-description-popup";
import "./style.scss";
interface SearchProps {
  FlagOutOfDate: boolean;
  TicketDeadline?: Date[];
  CreateDTimeUTC?: Date[];
  LogLUDTimeUTC?: Date[];
  FlagNotRespondingSLA: boolean;
  DepartmentCode: string[];
  AgentCode: string[];
  TicketStatus: string[];
  TicketPriority: string[];
  TicketType: string[];
  CustomerCodeSys: string[];
  TicketDetail: string;
  TicketName: string;
  TicketID: string;
  TicketSource: string;
  Follower: string[];
  OrgID: string[];
  NetworkID: string;
  Ft_PageIndex: number;
  Ft_PageSize: number;
  CustomerCompany: string[];
  TicketCustomType: string[];
}

const Eticket = () => {
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const { t } = useI18n("Eticket_Manager");
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const navigate = useNetworkNavigate();
  let gridRef: any = useRef();

  const setDataRow = useSetAtom(dataRowAtom);
  // show visible
  const setPopupMergeVisible = useSetAtom(popupMergeVisibleAtom);
  const setPopupSplitVisible = useSetAtom(popupSplitVisibleAtom);
  const setPopupCustomerVisible = useSetAtom(popupCustomerVisibleAtom);
  const setPopupVisible = useSetAtom(popupVisibleAtom);
  const { loadStateForm, saveStateForm } = useSavedStateForm<any>({
    storeKey: `search-panel-settings-Mst_Eticket_Search`,
  });
  const setSelectionKey = useSetAtom(SelectionKeyAtom);
  const setSelectionKeysAtom = useSetAtom(customizeGridSelectionKeysAtom);
  const setLoadingColumn = useSetAtom(loadingColumnAtom);

  const [popupDesc, setPopupDesc] = useAtom(popupDescAtom);

  const { data: dataUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["GetForCurrentUser"],
    queryFn: async () => {
      const response = await api.GetForCurrentUser();
      if (response.isSuccess) {
        return response.Data?.Sys_User;
      } else {
        showError({
          message: response._strErrCode,
          _strErrCode: response._strErrCode,
          _strTId: response._strTId,
          _strAppTId: response._strAppTId,
          _objTTime: response._objTTime,
          _strType: response._strType,
          _dicDebug: response._dicDebug,
          _dicExcs: response._dicExcs,
        });
      }
    },
  });

  const defaultCondition: any = {
    Ft_PageIndex: 0,
    TicketDeadline: [null, null],
    CreateDTimeUTC: [null, null],
    LogLUDTimeUTC: [null, null],
    Ft_PageSize: 100,
    TicketCustomType: [],
  };

  const defaultValue = (): any => {
    if (loadStateForm()) {
      const newValue = {
        ...loadStateForm(),
        LogLUDTimeUTC: loadStateForm()?.LogLUDTimeUTC
          ? loadStateForm()?.LogLUDTimeUTC.map((item: any) => {
              if (item) {
                return new Date(item);
              }
              return item;
            })
          : [null, null],
        CreateDTimeUTC: loadStateForm()?.CreateDTimeUTC
          ? loadStateForm()?.CreateDTimeUTC.map((item: any) => {
              if (item) {
                return new Date(item);
              }
              return item;
            })
          : [null, null],
        TicketDeadline: loadStateForm()?.TicketDeadline
          ? loadStateForm()?.TicketDeadline.map((item: any) => {
              if (item) {
                return new Date(item);
              }
              return item;
            })
          : [null, null],
      };

      return newValue;
    }
    return defaultCondition;
  };

  const searchCondition = useRef<Partial<SearchProps>>(defaultValue());

  const { data: dataDynamic, isLoading: isLoadingDynamic } = useQuery({
    queryKey: ["Mst_TicketColumnConfig_GetAll_Eticket"],
    queryFn: async () => {
      const response = await api.Mst_TicketColumnConfig_GetAll();
      if (response.isSuccess) {
        return response.Data?.Lst_Mst_TicketColumnConfig;
      } else {
        showError({
          message: response._strErrCode,
          _strErrCode: response._strErrCode,
          _strTId: response._strTId,
          _strAppTId: response._strAppTId,
          _objTTime: response._objTTime,
          _strType: response._strType,
          _dicDebug: response._dicDebug,
          _dicExcs: response._dicExcs,
        });
      }
    },
  });

  useEffect(() => {
    return () => {
      saveStateForm(searchCondition.current);
    };
  }, []);

  const { data: getListAgent, isLoading: isLoadingListAgent } = useQuery({
    queryKey: ["Sys_User_GetAllActive_Eticket"],
    queryFn: async () => {
      const response = await api.Sys_User_GetAllActive();
      if (response.isSuccess) {
        return response.DataList;
      } else {
        showError({
          message: response._strErrCode,
          _strErrCode: response._strErrCode,
          _strTId: response._strTId,
          _strAppTId: response._strAppTId,
          _objTTime: response._objTTime,
          _strType: response._strType,
          _dicDebug: response._dicDebug,
          _dicExcs: response._dicExcs,
        });
        return [];
      }
    },
  });

  // const { data: getListCustomer, isLoading: isLoadingListCustomer } = useQuery({
  //   queryKey: ["Mst_Customer_GetAllActive"],
  //   queryFn: async () => {
  //     const response = await api.Mst_Customer_GetAllActive();
  //     if (response.isSuccess) {
  //       return response.DataList;
  //     } else {
  //       showError({
  //         message: (response._strErrCode),
  //         _strErrCode: response._strErrCode,
  //         _strTId: response._strTId,
  //         _strAppTId: response._strAppTId,
  //         _objTTime: response._objTTime,
  //         _strType: response._strType,
  //         _dicDebug: response._dicDebug,
  //         _dicExcs: response._dicExcs,
  //       });
  //       return [];
  //     }
  //   },
  // });

  const { data: getListDepart, isLoading: isLoadingListDepart } = useQuery({
    queryKey: ["Mst_DepartmentControl_GetAllActive"],
    queryFn: async () => {
      const response = await api.Mst_DepartmentControl_GetAllActive();
      if (response.isSuccess) {
        return response.DataList ?? [];
      } else {
        showError({
          message: response._strErrCode,
          _strErrCode: response._strErrCode,
          _strTId: response._strTId,
          _strAppTId: response._strAppTId,
          _objTTime: response._objTTime,
          _strType: response._strType,
          _dicDebug: response._dicDebug,
          _dicExcs: response._dicExcs,
        });
        return [];
      }
    },
  });

  const { data: getListOrg, isLoading: isLoadingListOrg } = useQuery({
    queryKey: ["Mst_NNTController_GetAllActive"],
    queryFn: async () => {
      const response = await api.Mst_NNTController_GetAllActive();
      if (response.isSuccess) {
        return response?.Data?.Lst_Mst_NNT ?? [];
      } else {
        showError({
          message: response._strErrCode,
          _strErrCode: response._strErrCode,
          _strTId: response._strTId,
          _strAppTId: response._strAppTId,
          _objTTime: response._objTTime,
          _strType: response._strType,
          _dicDebug: response._dicDebug,
          _dicExcs: response._dicExcs,
        });
        return [];
      }
    },
  });

  const { data: getEnterprise, isLoading: isLoadingEnterprise } = useQuery({
    queryKey: ["Mst_Customer_Search_Eticket_Manager"],
    queryFn: async () => {
      const response = await api.Mst_Customer_Search({
        Ft_PageIndex: 0,
        Ft_PageSize: 1000,
        FlagActive: FlagActiveEnum.Active,
        CustomerType: "TOCHUC",
      });

      if (response.isSuccess) {
        return response.DataList;
      } else {
        showError({
          message: response._strErrCode,
          _strErrCode: response._strErrCode,
          _strTId: response._strTId,
          _strAppTId: response._strAppTId,
          _objTTime: response._objTTime,
          _strType: response._strType,
          _dicDebug: response._dicDebug,
          _dicExcs: response._dicExcs,
        });
      }
    },
  });

  const { data: getEstablishInfoType, isLoading: isLoadingEstablishInfoType } =
    useQuery({
      queryKey: ["Mst_TicketEstablishInfoApi_GetAllInfo_Eticket"],
      queryFn: async () => {
        const response = await api.Mst_TicketEstablishInfoApi_GetAllInfo();
        if (response.isSuccess) {
          return response?.Data;
        } else {
          showError({
            message: response._strErrCode,
            _strErrCode: response._strErrCode,
            _strTId: response._strTId,
            _strAppTId: response._strAppTId,
            _objTTime: response._objTTime,
            _strType: response._strType,
            _dicDebug: response._dicDebug,
            _dicExcs: response._dicExcs,
          });
        }
      },
    });

  const handleSetPopUp = (title: string, data: ETICKET_REPONSE[]) => {
    match(title)
      .with("Merge", () => {
        setPopupMergeVisible(true);
        setDataRow(data);
      })
      .with("Split", () => {
        setPopupSplitVisible(true);
        setDataRow(data);
      })
      .with("UpdateAgentCode", () => {
        setPopupVisible(true);
        setDataRow(data);
      })
      .with("UpdateCustomer", () => {
        setPopupCustomerVisible(true);
        setDataRow(data);
      })
      .otherwise(() => {});
  };

  useEffect(() => {
    return () => {
      setPopupMergeVisible(false);
      setPopupSplitVisible(false);
      setPopupVisible(false);
      setPopupCustomerVisible(false);
      setDataRow([]);
    };
  }, []);

  const handleShowPopUp = (title: string, dataRow: ETICKET_REPONSE[]) => {
    if (title === "response") {
      navigate(`eticket/detail/${dataRow[0].TicketID}`);
      return;
    } else {
      handleSetPopUp(title, dataRow);
    }
  };

  const handleToggleSearchPanel = () => {
    setSearchPanelVisibility((visible) => !visible);
  };

  const handleSetField = useCallback(
    (titleButton: string, ref: any) => {
      match(titleButton)
        .with("All", () => {
          ref.instance?.clearFilter();
        })
        .with("Open", () => {
          ref.instance?.filter(["TicketStatus", "=", "OPEN"]);
        })
        .with("Process", () => {
          ref.instance?.filter(["TicketStatus", "=", "PROCESSING"]);
          console.log("___", ref.instance.getDataSource()._items);
        })
        .with("ONHOLD", () => {
          const user = dataUser?.UserCode
            ? dataUser?.UserCode.toLowerCase()
            : "";
          ref.instance?.filter((itemData: any) => {
            const create = itemData.CreateBy ?? "";
            return create.toLowerCase() === user;
          });
        })
        .with("Responsibility", () => {
          ref.instance?.filter(function (itemData: any) {
            return itemData.AgentCode === dataUser?.UserCode.toUpperCase();
          });
        })
        .with("Closed", () => {
          ref.instance?.filter(function (itemData: any) {
            return (
              itemData.TicketStatus === "CLOSED" ||
              itemData.TicketStatus === "RESOLVED"
            );
          });
        })
        .with("Follower", () => {
          ref.instance?.filter(function (itemData: any) {
            const text = itemData?.ListFollowerAgentCode ?? "";
            console.log("text", text);
            const arr = text.split(",").map((i: string) => i.toUpperCase());
            return arr.includes(dataUser?.UserCode.toUpperCase());
          });
        })
        .with("OutOfDate", () => {
          ref.instance?.filter(function (itemData: any) {
            return (
              compareDates(getDateNow(), itemData.TicketDeadline) &&
              itemData.TicketStatus !== "CLOSED"
            );
          });
        })
        .otherwise(() => {});
    },
    [isLoadingUser]
  );

  const handleDelete = async (data: ETICKET_REPONSE[]) => {
    const param = data.map((item) => {
      return {
        OrgID: item.OrgID,
        TicketID: item.TicketID,
      };
    });

    const response = await api.ET_Ticket_DeleteMultiple(param);
    if (response.isSuccess) {
      toast.success(t("Delete Success"));
      gridRef?.current?.refetchData();
      setLoadingColumn([]);
      setSelectionKey([]);
      setSelectionKeysAtom([]);
      gridRef.current.instance.clearSelection();
    } else {
      showError({
        message: response._strErrCode,
        _strErrCode: response._strErrCode,
        _strTId: response._strTId,
        _strAppTId: response._strAppTId,
        _objTTime: response._objTTime,
        _strType: response._strType,
        _dicDebug: response._dicDebug,
        _dicExcs: response._dicExcs,
      });
    }
  };

  const showPopUpClose = (data: ETICKET_REPONSE[]) => {
    let result = confirm(
      `${t("Are you sure to change eTicket's status to closed ?")}`,
      `${t("Closed Ticket")}`
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        handleClose(data);
      }
    });
  };

  const showPopUpDelete = (data: ETICKET_REPONSE[]) => {
    let result = confirm(
      `${t("Are you sure to delete eticket ?")}`,
      `${t("Delete Ticket")}`
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        handleDelete(data);
      }
    });
  };

  // useEffect(() => {
  //   if (!isLoading) {
  //     refetch();
  //   }
  // }, []);

  const handleClose = async (data: ETICKET_REPONSE[]) => {
    const param = data.map((item: ETICKET_REPONSE) => {
      return {
        OrgID: item.OrgID,
        TicketID: item.TicketID,
      };
    });
    const response = await api.ET_Ticket_CloseMultiple(param);
    if (response.isSuccess) {
      toast.success(t("Close Success"));
      gridRef?.current?.refetchData();
    } else {
      showError({
        message: response._strErrCode,
        _strErrCode: response._strErrCode,
        _strTId: response._strTId,
        _strAppTId: response._strAppTId,
        _objTTime: response._objTTime,
        _strType: response._strType,
        _dicDebug: response._dicDebug,
        _dicExcs: response._dicExcs,
      });
    }
  };

  const handleExportExcel = async (data: any) => {
    let conditionParam: any = {
      ...searchCondition?.current,
      FlagOutOfDate:
        searchCondition?.current?.FlagOutOfDate === undefined
          ? ""
          : searchCondition?.current?.FlagOutOfDate === true
          ? "1"
          : "",
      FlagNotRespondingSLA:
        searchCondition?.current?.FlagNotRespondingSLA === undefined
          ? ""
          : searchCondition?.current?.FlagNotRespondingSLA === true
          ? "1"
          : "",
      TicketID: data.map((item: any) => item.TicketID).join(","),
    };

    const response = await api.ET_Ticket_Export(conditionParam);
    if (response.isSuccess) {
      toast.success(t("Export Excel success"));
      if (response.Data) {
        window.location.href = response.Data ? response.Data.toString() : "";
      }
    } else {
      showError({
        message: response._strErrCode,
        _strErrCode: response._strErrCode,
        _strTId: response._strTId,
        _strAppTId: response._strAppTId,
        _objTTime: response._objTTime,
        _strType: response._strType,
        _dicDebug: response._dicDebug,
        _dicExcs: response._dicExcs,
      });
    }
  };

  const columns = useColumn({
    ticketDynamic: dataDynamic ?? [],
  });
  const toolbar = useToolbar({
    data: [],
    onClose: showPopUpClose,
    onDelete: showPopUpDelete,
    onSetStatus: handleSetField,
    onShowPopUp: handleShowPopUp,
    onExportExcel: handleExportExcel,
    dataUser: dataUser,
  });

  const columnSearch = useColumnSearch({
    listAgent: getListAgent ?? [],
    listDepart: getListDepart ?? [],
    listOrg: getListOrg ?? [],
    listEnterprise: getEnterprise ?? [],
    getEstablishInfoType: getEstablishInfoType ?? {
      Lst_Mst_TicketStatus: [],
      Lst_Mst_TicketPriority: [],
      Lst_Mst_TicketType: [],
      Lst_Mst_TicketSource: [],
      Lst_Mst_ReceptionChannel: [],
      Lst_Mst_ContactChannel: [],
      Lst_Mst_TicketCustomType: [],
    },
  });

  const isLoadingAll = () => {
    return (
      isLoadingListAgent ||
      isLoadingListDepart ||
      isLoadingListOrg ||
      isLoadingUser ||
      isLoadingEnterprise ||
      isLoadingDynamic ||
      isLoadingEstablishInfoType
    );
  };

  useEffect(() => {
    if (gridRef.current && dataUser?.UserCode) {
      gridRef.instance?.filter(function (itemData: any) {
        return itemData.AgentCode === dataUser?.UserCode;
      });
    }
  }, [gridRef?.current, dataUser?.UserCode, isLoadingAll()]);

  const handleSearch = async (data: any) => {
    searchCondition.current = {
      ...searchCondition.current,
      ...data,
      LogLUDTimeUTC: data?.LogLUDTimeUTC
        ? data?.LogLUDTimeUTC.map((item: any) => {
            if (item) {
              return new Date(item);
            }
            return item;
          })
        : [null, null],
      CreateDTimeUTC: data?.CreateDTimeUTC
        ? data?.CreateDTimeUTC.map((item: any) => {
            if (item) {
              return new Date(item);
            }
            return item;
          })
        : [null, null],
      TicketDeadline: data?.TicketDeadline
        ? data?.TicketDeadline.map((item: any) => {
            if (item) {
              return new Date(item);
            }
            return item;
          })
        : [null, null],
    };

    gridRef?.current?.refetchData();
  };
  const hanldeAdd = () => {
    navigate("eticket/Add");
  };

  const refetchData = useCallback(async () => {
    if (isLoadingAll()) {
      return null;
    } else {
      let conditionParam: any = {
        ...searchCondition.current,
        Ft_PageIndex: gridRef.current?.instance.pageIndex() ?? 0,
        Ft_PageSize: gridRef.current?.instance.pageSize() ?? 100,
        FlagOutOfDate: searchCondition?.current?.FlagOutOfDate ? "1" : "",
        FlagNotRespondingSLA: searchCondition?.current?.FlagNotRespondingSLA
          ? "1"
          : "",
        CustomerCompany: searchCondition?.current?.CustomerCompany
          ? searchCondition?.current?.CustomerCompany.join(",")
          : "",
        TicketStatus: searchCondition?.current?.TicketStatus
          ? searchCondition?.current?.TicketStatus.join(",")
          : "",
        Follower: searchCondition?.current?.Follower
          ? searchCondition?.current?.Follower.join(",")
          : "",
        TicketDeadlineFrom: searchCondition?.current?.TicketDeadline?.[0]
          ? getYearMonthDate(searchCondition?.current?.TicketDeadline[0])
          : "",
        TicketDeadlineTo: searchCondition?.current?.TicketDeadline?.[1]
          ? getYearMonthDate(searchCondition?.current?.TicketDeadline[1])
          : "",
        CreateDTimeUTCFrom: searchCondition?.current?.CreateDTimeUTC?.[0]
          ? getYearMonthDate(searchCondition?.current?.CreateDTimeUTC[0])
          : "",
        CreateDTimeUTCTo: searchCondition?.current?.CreateDTimeUTC?.[1]
          ? getYearMonthDate(searchCondition?.current?.CreateDTimeUTC[1])
          : "",
        LUDTimeUTCFrom: searchCondition?.current?.LogLUDTimeUTC?.[0]
          ? getYearMonthDate(searchCondition?.current?.LogLUDTimeUTC[0])
          : "",
        LUDTimeUTCTo: searchCondition?.current?.LogLUDTimeUTC?.[1]
          ? getYearMonthDate(searchCondition?.current?.LogLUDTimeUTC[1])
          : "",
        CustomerCodeSys: searchCondition?.current?.CustomerCodeSys
          ? searchCondition?.current?.CustomerCodeSys.join(",")
          : "",
        TicketType: searchCondition?.current?.TicketType
          ? searchCondition?.current?.TicketType.join(",")
          : "",
        DepartmentCode: searchCondition?.current?.DepartmentCode
          ? searchCondition?.current?.DepartmentCode.join(",")
          : "",
        AgentCode: searchCondition?.current?.AgentCode
          ? searchCondition?.current?.AgentCode.join(",")
          : "",
        TicketPriority: searchCondition?.current?.TicketPriority
          ? searchCondition?.current?.TicketPriority.join(",")
          : "",
        OrgID: searchCondition?.current?.OrgID
          ? searchCondition?.current?.OrgID.join(",")
          : "",
        TicketCustomType: searchCondition?.current?.TicketCustomType
          ? searchCondition?.current?.TicketCustomType.join(",")
          : "",
      };
      delete conditionParam.TicketDeadline;
      delete conditionParam.LogLUDTimeUTC;
      delete conditionParam.CreateDTimeUTC;

      const response = await api.ET_Ticket_Search(conditionParam);
      if (response.isSuccess) {
        const newResponse = {
          ...response,
        };
        const dataList = response.DataList ?? [];
        const newDataList = dataList.map((item: any) => {
          if (item.TicketJsonInfo) {
            const ticketJSON = JSON.parse(item.TicketJsonInfo);
            const ticket = Object.keys(ticketJSON)
              .map((item: string, index: number) => {
                return {
                  [`${item.split(".").join("")}`]:
                    Object.values(ticketJSON)[index],
                };
              })
              .reduce((acc: any, item: any) => {
                return {
                  ...acc,
                  ...item,
                };
              }, {});

            return {
              ...item,
              ...ticket,
            };
          }
          return {
            ...item,
          };
        });
        console.log("gridRef ", gridRef.current);
        gridRef.current.instance.option("dataSource", newDataList);
        console.log("gridRef ", gridRef.current.instance.option("dataSource"));
        // newResponse.DataList = newDataList;
        return newResponse;
      } else {
        showError({
          message: response._strErrCode,
          _strErrCode: response._strErrCode,
          _strTId: response._strTId,
          _strAppTId: response._strAppTId,
          _objTTime: response._objTTime,
          _strType: response._strType,
          _dicDebug: response._dicDebug,
          _dicExcs: response._dicExcs,
        });
      }
    }
  }, [isLoadingAll()]);

  return (
    <AdminContentLayout className={"Category_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <HeaderPart
          searchCondition={searchCondition.current}
          onAddNew={hanldeAdd}
        />
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout searchPermissionCode="BTN_ETICKET_LIST_SEARCH">
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <SearchPanelEticket
              conditionFields={columnSearch}
              storeKey="Mst_Eticket_Column_Search"
              data={searchCondition.current}
              onSearch={handleSearch}
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <LoadPanel
              container={".dx-viewport"}
              shadingColor="rgba(0,0,0,0.4)"
              position={"center"}
              visible={isLoadingAll()}
              showIndicator={true}
              showPane={true}
            />
            <div className="eticket-manager">
              <GridViewStandard
                isLoading={isLoadingAll()}
                fetchData={refetchData}
                dataSource={[]}
                columns={columns}
                keyExpr={"TicketID"}
                onReady={(ref) => {
                  gridRef.current = ref;
                }}
                isHiddenCheckBox={false}
                allowSelection={true}
                onSelectionChanged={([]) => {
                  [];
                }}
                hidenTick={true}
                onSaveRow={() => {}}
                onEditorPreparing={() => {}}
                onEditRowChanges={() => {}}
                onDeleteRows={() => {}}
                storeKey={"Eticket-manager"}
                toolbarItems={[
                  {
                    location: "before",
                    widget: "dxButton",
                    options: {
                      icon: "search",
                      onClick: handleToggleSearchPanel,
                    },
                  },
                ]}
                customToolbarItems={toolbar}
              />
            </div>
            {/* Gộp */}
            <Eticket_Merger
              onCancel={() => {
                setPopupMergeVisible(false);
                setDataRow([]);
                // gridRef?.current?.refetchData();
              }}
              onSave={() => {
                gridRef?.current?.refetchData();
              }}
            />

            {/* Tách */}
            <Eticket_Split
              onCancel={() => {
                setPopupSplitVisible(false);
                setDataRow([]);
              }}
              onSave={() => {
                gridRef?.current?.refetchData();
              }}
            />

            {/* Chuyển phụ trách */}
            <In_Charge_Of_Tranfer
              onCancel={() => {
                setPopupVisible(false);
                setDataRow([]);
              }}
              onSave={() => {
                gridRef?.current?.refetchData();
              }}
            />

            {/* Chuyển Khách hàng */}
            <TransformCustomer
              onCancel={() => {
                setPopupCustomerVisible(false);
                setDataRow([]);
              }}
              onSave={() => {
                gridRef?.current?.refetchData();
              }}
            />

            {popupDesc && <DescriptionPopup />}
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

export default Eticket;
