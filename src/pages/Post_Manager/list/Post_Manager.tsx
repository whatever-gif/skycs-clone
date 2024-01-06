import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { SearchPanelV2 } from "@/packages/ui/search-panel";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import {
  ContentSearchPanelLayout,
  searchPanelVisibleAtom,
} from "@layouts/content-searchpanel-layout";
import { useConfiguration } from "@packages/hooks";
import { authAtom, showErrorAtom } from "@packages/store";
import { FlagActiveEnum, Mst_Area } from "@packages/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IPopupOptions } from "devextreme-react/popup";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { refechAtom, selectedItemsAtom } from "../components/store";
import { useBankDealerGridColumns } from "../components/use-columns";
import { useFormSettings } from "../components/use-form-settings";
import { PopupViewComponent } from "../components/use-popup-view";
import "./Post_Manager.scss";

import { Button, CheckBox, DateRangeBox } from "devextreme-react";

import PermissionContainer, {
  checkPermision,
} from "@/components/PermissionContainer";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { GridViewStandard } from "@/packages/ui/base-gridview/gridview-standard";
import {
  flattenCategories,
  getCategories,
} from "@/pages/Category_Manager/components/FormatCategoryGrid";
import { format } from "date-fns";
import { confirm } from "devextreme/ui/dialog";
import { useNavigate } from "react-router-dom";
import { match } from "ts-pattern";
import { useToolbar } from "../components/components/toolbarItem";

export function removeDulicateData(input: any, value: any) {
  const uniqueCreateByValues = Array.from(
    new Set(input?.map((item: any) => item[value].toLowerCase()))
  );

  // Creating the output array of objects
  const output = uniqueCreateByValues?.map((item) => ({
    [value]: item,
  }));
  return output;
}
export const Post_ManagerPage = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n("Post_Manager");
  let gridRef: any = useRef(null);
  const config = useConfiguration();
  const showError = useSetAtom(showErrorAtom);

  const refechValue = useAtomValue(refechAtom);

  const searchCondition = useRef<any>({
    FlagActive: FlagActiveEnum.All,
    Ft_PageIndex: 0,
    Ft_PageSize: config.MAX_PAGE_ITEMS,
    MonthReport: [null, null],
    MonthUpdate: [null, null],
    KeyWord: "",
    CreateBy: "",
    LogLUBy: "",
    PostStatus: "",
    CategoryCode: "",
    Tag: "",
    ShareType: "",
    Title: "",
    Detail: "",
    FlagEdit: "0",
  });

  const setSelectedItems = useSetAtom(selectedItemsAtom);
  const nav = useNavigate();
  const auth = useAtomValue(authAtom);
  const api = useClientgateApi();

  // const { data, isLoading, refetch } = useQuery(
  //   ["Post_Manager", JSON.stringify(searchCondition)],
  //   () =>
  //     api.KB_Post_Search({
  //       ...searchCondition,
  //       PostStatus: searchCondition..PostStatus
  //         ? searchCondition.PostStatus.join(",")
  //         : "",
  //       CreateBy: searchCondition.CreateBy
  //         ? searchCondition.CreateBy.join(",")
  //         : "",
  //       LogLUBy: searchCondition.LogLUBy
  //         ? searchCondition.LogLUBy.join(",")
  //         : "",
  //       Tag: searchCondition.Tag ? searchCondition.Tag.join(",") : "",
  //       CategoryCode: searchCondition.CategoryCode
  //         ? searchCondition.CategoryCode.join(",")
  //         : "",
  //       ShareType: searchCondition.ShareType
  //         ? searchCondition.ShareType.join(",")
  //         : "",
  //       Detail: searchCondition.Detail ? searchCondition.Detail : "",
  //       Title: searchCondition.Title ? searchCondition.Title : "",
  //       CreateDTimeUTCFrom: searchCondition.MonthReport[0]
  //         ? format(searchCondition.MonthReport[0], "yyyy-MM-dd")
  //         : "",
  //       CreateDTimeUTCTo: searchCondition.MonthReport[1]
  //         ? format(searchCondition.MonthReport[1], "yyyy-MM-dd")
  //         : "",
  //       LogLUDTimeUTCFrom: searchCondition.MonthUpdate[0]
  //         ? format(searchCondition.MonthUpdate[0], "yyyy-MM-dd")
  //         : "",
  //       LogLUDTimeUTCTo: searchCondition.MonthUpdate[1]
  //         ? format(searchCondition.MonthUpdate[1], "yyyy-MM-dd")
  //         : "",
  //     })
  // );
  const fetchData = async () => {
    const response = await api.KB_Post_Search({
      ...searchCondition.current,
      PostStatus: searchCondition.current.PostStatus
        ? searchCondition.current.PostStatus.join(",")
        : "",
      CreateBy: searchCondition.current.CreateBy
        ? searchCondition.current.CreateBy.join(",")
        : "",
      LogLUBy: searchCondition.current.LogLUBy
        ? searchCondition.current.LogLUBy.join(",")
        : "",
      Tag: searchCondition.current.Tag
        ? searchCondition.current.Tag.join(",")
        : "",
      CategoryCode: searchCondition.current.CategoryCode
        ? searchCondition.current.CategoryCode.join(",")
        : "",
      ShareType: searchCondition.current.ShareType
        ? searchCondition.current.ShareType.join(",")
        : "",
      Detail: searchCondition.current.Detail
        ? searchCondition.current.Detail
        : "",
      Title: searchCondition.current.Title ? searchCondition.current.Title : "",
      CreateDTimeUTCFrom: searchCondition.current.MonthReport[0]
        ? format(searchCondition.current.MonthReport[0], "yyyy-MM-dd")
        : "",
      CreateDTimeUTCTo: searchCondition.current.MonthReport[1]
        ? format(searchCondition.current.MonthReport[1], "yyyy-MM-dd")
        : "",
      LogLUDTimeUTCFrom: searchCondition.current.MonthUpdate[0]
        ? format(searchCondition.current.MonthUpdate[0], "yyyy-MM-dd")
        : "",
      LogLUDTimeUTCTo: searchCondition.current.MonthUpdate[1]
        ? format(searchCondition.current.MonthUpdate[1], "yyyy-MM-dd")
        : "",
      Ft_PageIndex: gridRef.current?.instance.pageIndex() ?? 0,
      Ft_PageSize: gridRef.current?.instance.pageSize() ?? 100,
    });
    if (response?.isSuccess) {
      return {
        DataList: response?.Data?.pageInfo?.DataList.sort((a: any, b: any) => {
          const dateA = new Date(b.LogLUDTimeUTC);
          const dateB = new Date(a.LogLUDTimeUTC);
          return (dateA as any) - (dateB as any);
        }),
        PageCount: response?.Data?.pageInfo?.PageCount,
        ItemCount: response?.Data?.pageInfo?.ItemCount,
        PageSize: response?.Data?.pageInfo?.PageSize,
      };
    }
  };

  const { data: listPost } = useQuery(["listPost"], () =>
    api.KB_PostData_GetAllPostCode()
  );
  const { data: Category_Manager_GetALL } = useQuery(
    ["Category_Manager_GetALL"],
    () => api.KB_Category_GetAllActive()
  );

  const { data: listTag } = useQuery(["listTag"], () =>
    api.Mst_Tag_GetAllActive()
  );

  useEffect(() => {
    if (refechValue) {
      gridRef?.current?.refetchData();
      gridRef.current?.instance.clearSelection();
    }
  }, [refechValue]);
  const PostStatus = [
    { text: t("Published"), value: "PUBLISHED" },
    { text: t("Draft"), value: "DRAFT" },
  ];
  const shareType = [
    { text: t("Organization"), value: "ORGANIZATION" },
    { text: t("Network"), value: "NETWORK" },
    { text: t("Private"), value: "PRIVATE" },
  ];

  const columns = useBankDealerGridColumns({
    data: [],
  });

  const formItems: any[] = [
    {
      editorType: "dxTextBox",
      caption: "FlagEdit",
      label: {
        text: t("a"),
      },
      visible: true,
      cssClass: "FlagEdit",
      editorOptions: {
        placeholder: t("Input"),
      },
      render: ({ editorOptions, component: formRef }: any) => {
        return (
          <div className="flex items-center gap-1 mt-1 ml-1">
            <CheckBox
              defaultValue={
                searchCondition?.current.FlagEdit === "0" ? false : true
              }
              onValueChanged={(e: any) => {
                formRef.instance().updateData("FlagEdit", e.value);
              }}
            />
            <div className="font-bold">{t("Bài viết cần chỉnh sửa")}</div>
          </div>
        );
      },
    },
    {
      caption: t("Title"),
      dataField: "Title",
      label: {
        text: t("Title"),
      },
      visible: true,
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      caption: t("Detail"),
      label: {
        text: t("Detail"),
      },
      visible: true,
      dataField: "Detail",
      editorType: "dxTextBox",
      editorOptions: {
        placeholder: t("Input"),
      },
    },
    {
      dataField: "MonthReport",
      visible: true,
      caption: t("MonthReport"),
      label: {
        text: t("MonthReport"),
      },
      editorType: "dxDateRangeBox",
      editorOptions: {
        type: "date",
        displayFormat: "yyyy-MM-dd",
      },
      render: ({ editorOptions, component: formRef }: any) => {
        return (
          <DateRangeBox
            displayFormat=" yyyy-MM-dd"
            defaultStartDate={searchCondition?.current.MonthReport[0]}
            defaultEndDate={searchCondition?.current.MonthReport[1]}
            showClearButton={true}
            useMaskBehavior={true}
            openOnFieldClick={true}
            labelMode="hidden"
            onValueChanged={(e: any) => {
              formRef.instance().updateData("MonthReport", e.value);
            }}
          />
        );
      },
    },
    {
      dataField: "MonthUpdate",
      visible: true,
      caption: t("MonthUpdate"),
      label: {
        text: t("MonthUpdate"),
      },
      editorType: "dxDateRangeBox",
      editorOptions: {},
      render: ({ editorOptions, component: formRef }: any) => {
        return (
          <DateRangeBox
            displayFormat=" yyyy-MM-dd"
            defaultStartDate={searchCondition?.current.MonthUpdate[0]}
            defaultEndDate={searchCondition.current.MonthUpdate[1]}
            showClearButton={true}
            useMaskBehavior={true}
            openOnFieldClick={true}
            labelMode="hidden"
            onValueChanged={(e: any) => {
              formRef.instance().updateData("MonthUpdate", e.value);
            }}
          />
        );
      },
    },
    {
      caption: t("PostStatus"),
      dataField: "PostStatus",
      editorType: "dxTagBox",
      label: {
        text: t("PostStatus"),
      },
      visible: true,
      editorOptions: {
        dataSource: PostStatus,
        valueExpr: "value",
        displayExpr: "text",
        placeholder: t("Select"),
      },
    },
    {
      caption: t("CreateBy"),
      dataField: "CreateBy",
      label: {
        text: t("Người tạo"),
      },
      visible: true,
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: removeDulicateData(listPost?.Data, "CreateBy") ?? [],
        valueExpr: "CreateBy",
        displayExpr: "CreateBy",
        placeholder: t("Select"),
      },
    },
    {
      caption: t("LogLUBy"),
      dataField: "LogLUBy",
      label: {
        text: t("LogLUBy"),
      },
      visible: true,
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: removeDulicateData(listPost?.Data, "LogLUBy") ?? [],
        valueExpr: "LogLUBy",
        displayExpr: "LogLUBy",
        placeholder: t("Select"),
      },
    },
    {
      caption: t("Tag"),
      dataField: "Tag",
      label: {
        text: t("Tag"),
      },
      visible: true,
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: listTag?.Data?.Lst_Mst_Tag ?? [],
        valueExpr: "TagID",
        displayExpr: "TagName",
        placeholder: t("Select"),
      },
    },
    {
      caption: t("CategoryCode"),
      dataField: "CategoryCode",
      label: {
        text: t("Category"),
      },
      visible: true,
      editorType: "dxTagBox",
      editorOptions: {
        dataSource:
          flattenCategories(
            getCategories(Category_Manager_GetALL?.Data?.Lst_KB_Category)
          ) ?? [],
        valueExpr: "CategoryCode",
        displayExpr: "CategoryName",
        placeholder: t("Select"),
      },
    },
    {
      caption: t("ShareType"),
      dataField: "ShareType",
      label: {
        text: t("ShareType"),
      },
      visible: true,
      editorType: "dxTagBox",
      editorOptions: {
        dataSource: shareType,
        valueExpr: "value",
        displayExpr: "text",
        placeholder: t("Select"),
      },
    },
  ];

  const handleSetField = useCallback((titleButton: string, ref: any) => {
    match(titleButton)
      .with("All", () => {
        ref.instance?.clearFilter();
      })
      .with("DRAFT", () => {
        ref.instance?.filter(["PostStatus", "=", "DRAFT"]);
      })
      .with("PUBLISHED", () => {
        ref.instance?.filter(["PostStatus", "=", "PUBLISHED"]);
      })
      .otherwise(() => {});
  }, []);

  const showPopUpDelete = (data: any) => {
    let result = confirm(
      `${t("Bạn có muốn xóa bản ghi này ?")}`,
      `${t("THÔNG BÁO")}`
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        handleDeleteRows(data);
      }
    });
  };
  const toolbar = useToolbar({
    data: [],
    onSetStatus: handleSetField,
    onDelete: showPopUpDelete,
  });
  const handleDeleteRows = async (e: any) => {
    const dataDelete = {
      KB_Post: {
        PostCode: e[0].PostCode,
        OrgID: e[0].OrgID,
      },
    };
    const resp = await api.KB_PostData_Delete(dataDelete);
    if (resp.isSuccess) {
      toast.success(t("Delete Successfully"));
      // await refetch();
      gridRef.current?.instance.clearSelection();
      gridRef?.current?.refetchData();
    } else {
      showError({
        message: resp._strErrCode,
        _strErrCode: resp._strErrCode,
        _strTId: resp._strTId,
        _strAppTId: resp._strAppTId,
        _objTTime: resp._objTTime,
        _strType: resp._strType,
        _dicDebug: resp._dicDebug,
        _dicExcs: resp._dicExcs,
      });
    }
  };
  const handleSelectionChanged = (rows: string[]) => {
    setSelectedItems(rows);
  };
  // const handleAddNew = () => {
  //   console.log(271, "a");
  //   setCheckTab(true);
  //   // gridRef.current._instance.addRow();
  // };

  // toggle search panel
  const setSearchPanelVisibility = useSetAtom(searchPanelVisibleAtom);
  const handleToggleSearchPanel = () => {
    // console.log("handleToggleSearchPanel", gridRef?.instance);
    setSearchPanelVisibility((visible) => !visible);
  };

  const handleCancel = () => {
    // console.log("cancel viewing item");
    gridRef.current?.instance?.cancelEditData();
  };
  const handleEdit = (rowIndex: number) => {
    gridRef.current?.instance?.editRow(rowIndex);
  };
  const handleSubmit = () => {
    gridRef.current?.instance?.saveEditData();
  };

  const handleEditorPreparing = (e: EditorPreparingEvent) => {
    // use this function to control how the editor looks like

    if (e.dataField) {
      if (["OrgID", "AreaCode"].includes(e.dataField!)) {
        e.editorOptions.readOnly = !e.row?.isNewRow;
      }
    }
  };

  const popupSettings: IPopupOptions = {
    showTitle: true,
    title: t("Post_Manager Information"),
    className: "bank-dealer-information-popup",
    toolbarItems: [
      {
        toolbar: "bottom",
        location: "after",
        widget: "dxButton",
        options: {
          text: t("Save"),
          stylingMode: "contained",
          type: "default",
          onClick: handleSubmit,
        },
      },
      {
        toolbar: "bottom",
        location: "after",
        widget: "dxButton",
        options: {
          text: t("Cancel"),
          type: "default",
          onClick: handleCancel,
        },
      },
    ],
  };

  const formSettings = useFormSettings({
    columns,
  });

  const onModify = async (id: any, data: Partial<Mst_Area>) => {};
  // Section: CRUD operations
  const onCreate = async (data: Mst_Area & { __KEY__: string }) => {};

  const onDelete = async (id: any) => {};
  const handleSavingRow = (e: any) => {
    // console.log(e);
    // stop grid behaviour
    if (e.changes && e.changes.length > 0) {
      // we don't enable batch mode, so only 1 change at a time.
      const { type } = e.changes[0];
      if (type === "remove") {
        const id = e.changes[0].key;
        e.promise = onDelete(id);
      } else if (type === "insert") {
        const data = e.changes[0].data!;
        e.promise = onCreate(data);
      } else if (type === "update") {
        e.promise = onModify(e.changes[0].key, e.changes[0].data!);
      }
    }
    e.cancel = true;
  };
  // End Section: CRUD operations

  const handleSearch = async (data: any) => {
    const dataSearch = {
      ...data,
      FlagEdit: data?.FlagEdit === true ? "1" : "0",
      Tag: data.Tag ?? data.Tag.join(","),
      ShareType: data.ShareType ?? data.ShareType.join(","),
      LogLUBy: data.LogLUBy ?? data.LogLUBy.join(","),
      PostStatus: data.PostStatus ?? data.PostStatus.join(","),
      CreateBy: data.CreateBy ?? data.CreateBy.join(","),
      // CreateDTimeUTCTo: data?.TimeCreate.length
      //   ? data?.TimeCreate[1] !== ""
      //     ? format(data?.TimeCreate[1], "yyyy-MM-dd")
      //     : ""
      //   : "",
      // CreateDTimeUTCFrom: data?.TimeCreate.length
      //   ? data?.TimeCreate[0] !== ""
      //     ? format(data?.TimeCreate[0], "yyyy-MM-dd")
      //     : ""
      //   : "",
      // LogLUDTimeUTCTo: data?.TimeUpdate.length
      //   ? data?.TimeUpdate[1] !== ""
      //     ? format(data?.TimeUpdate[1], "yyyy-MM-dd")
      //     : ""
      //   : "",
      // LogLUDTimeUTCFrom: data?.TimeUpdate.length
      //   ? data?.TimeUpdate[0] !== ""
      //     ? format(data?.TimeUpdate[0], "yyyy-MM-dd")
      //     : ""
      //   : "",
    };
    searchCondition.current = dataSearch;
    gridRef?.current?.refetchData();
    // setSearchCondition(dataSearch);
    // console.log(dataSearch);
    // await refetch();
  };

  const handleEditRowChanges = () => {
    // console.log("a");
  };

  const handleSave = () => {
    nav(`/${auth.networkId}/admin/Post_Manager/addNew`);
  };

  return (
    <AdminContentLayout className={"Post_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderNoSearchLayout>
          <PageHeaderNoSearchLayout.Slot name={"Before"}>
            <div className="text-header font-bold dx-font-m">
              {t("Post manager")}
            </div>
          </PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot
            name={"Center"}
          ></PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot name={"After"}>
            <PermissionContainer
              permission={"BTN_ADMIN_CAMPAIGN_POSTMANAGER_CREATE"}
              children={
                <Button
                  stylingMode={"contained"}
                  type="default"
                  text={t("Add new")}
                  onClick={handleSave}
                />
              }
            />
          </PageHeaderNoSearchLayout.Slot>
        </PageHeaderNoSearchLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <ContentSearchPanelLayout searchPermissionCode="BTN_ADMIN_POST_MANAGER_SEARCH">
          <ContentSearchPanelLayout.Slot name={"SearchPanel"}>
            <PermissionContainer
              permission={"BTN_ADMIN_CAMPAIGN_POSTMANAGER _SEARCH"}
              children={
                <SearchPanelV2
                  storeKey="search-post-manager"
                  conditionFields={formItems}
                  data={searchCondition.current}
                  onSearch={handleSearch}
                />
              }
            />
          </ContentSearchPanelLayout.Slot>
          <ContentSearchPanelLayout.Slot name={"ContentPanel"}>
            <GridViewStandard
              isSingleSelection={true}
              isLoading={false}
              fetchData={fetchData}
              // dataSource={
              //   data?.Data?.pageInfo?.DataList?.sort((a: any, b: any) => {
              //     const dateA = new Date(b.LogLUDTimeUTC);
              //     const dateB = new Date(a.LogLUDTimeUTC);
              //     return (dateA as any) - (dateB as any);
              //   }) ?? []
              // }
              dataSource={[]}
              columns={columns}
              keyExpr={["PostCode", "OrgID"]}
              onReady={(ref) => {
                gridRef.current = ref;
              }}
              isHiddenCheckBox={false}
              allowSelection={true}
              onSelectionChanged={handleSelectionChanged}
              onSaveRow={handleSavingRow}
              onEditorPreparing={handleEditorPreparing}
              allowInlineEdit={false}
              onEditRowChanges={handleEditRowChanges}
              hidenTick={true}
              onDeleteRows={() => {}}
              storeKey={"Post_Manager-columns"}
              toolbarItems={[
                {
                  visible: checkPermision(
                    "BTN_ADMIN_CAMPAIGN_POSTMANAGER _SEARCH"
                  ),
                  location: "before",
                  widget: "dxButton",
                  options: {
                    icon: "search",
                    onClick: handleToggleSearchPanel,
                  },
                },
              ]}
              popupSettings={popupSettings}
              formSettings={formSettings}
              customToolbarItems={toolbar}
            />
            {/* 
            <GridViewCustomize
              isLoading={isLoading}
              dataSource={
                data?.Data?.pageInfo?.DataList?.sort(
                  (a: any, b: any) =>
                    new Date(a.CreateDTimeUTC) - new Date(b.CreateDTimeUTC)
                ) ?? []
              }
              columns={columns}
              keyExpr={["PostCode", "OrgID"]}
              popupSettings={popupSettings}
              formSettings={formSettings}
              onReady={(ref) => {
                gridRef.current = ref;
                // if (ref && dataUser) {
                //   ref.instance?.filter(function (itemData: any) {
                //     return itemData.AgentCode === dataUser?.UserCode;
                //   });
                // }
              }}
              // onReady={(ref) => (gridRef = ref)}
              allowSelection={true}
              onSelectionChanged={handleSelectionChanged}
              onSaveRow={handleSavingRow}
              onEditorPreparing={handleEditorPreparing}
              allowInlineEdit={true}
              onEditRowChanges={handleEditRowChanges}
              // onDeleteRows={handleDeleteRows}
              isSingleSelection={true}
              // inlineEditMode="row"
              // showCheck="always"
              toolbarItems={[
                {
                  visible: checkPermision("BTN_ADMIN_POST_MANAGER_SEARCH"),
                  location: "before",
                  widget: "dxButton",
                  options: {
                    icon: "search",
                    onClick: handleToggleSearchPanel,
                  },
                },
              ]}
              storeKey={"Post_Manager-columns"}
              customToolbarItems={toolbar}
            /> */}
            <PopupViewComponent
              onEdit={handleEdit}
              formSettings={formSettings}
            />
          </ContentSearchPanelLayout.Slot>
        </ContentSearchPanelLayout>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
