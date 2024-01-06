import { checkPermision } from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useConfiguration } from "@/packages/hooks";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { PageHeaderLayout } from "@/packages/layouts/page-header-layout";
import { authAtom, showErrorAtom } from "@/packages/store";
import { StatusButton } from "@/packages/ui/status-button";
import { Icon } from "@packages/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { LoadPanel } from "devextreme-react";
import DataGrid, {
  Column,
  ColumnFixing,
  Button as DxButton,
  Editing,
  HeaderFilter,
  Pager,
  Paging,
  Search,
  Selection,
} from "devextreme-react/data-grid";
import { confirm } from "devextreme/ui/dialog";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { HeaderPart, PopupView } from "../components";
import {
  flattenCategories,
  getCategories,
} from "../components/FormatCategoryGrid";
import {
  bottomAtom,
  dataFormAtom,
  flagEditAtom,
  keywordAtom,
  showDetail,
  showPopup,
} from "../components/store";
import { useFormSettings } from "../components/use-form-settings";

export const Category_ManagerPage = () => {
  const { t } = useI18n("Category_Manager");
  const config = useConfiguration();
  const auth = useAtomValue(authAtom);
  const keyword = useAtomValue(keywordAtom);
  const setPopupVisible = useSetAtom(showPopup);
  const setflagEdit = useSetAtom(flagEditAtom);
  const setDataFrom = useSetAtom(dataFormAtom);
  const setShowDetail = useSetAtom(showDetail);
  const setBottom = useSetAtom(bottomAtom);
  const showError = useSetAtom(showErrorAtom);
  const windowSize = useWindowSize();

  const api = useClientgateApi();

  const { data, isLoading, refetch } = useQuery(
    ["Category_Manager", keyword],
    () =>
      api.KB_Category_Search({
        Ft_PageIndex: 0,
        Ft_PageSize: config.MAX_PAGE_ITEMS,
        KeyWord: keyword,
      } as any)
  );
  const { data: Category_Manager_GetALL } = useQuery(
    ["Category_Manager_GetALL", keyword],
    () => api.KB_Category_GetAllActive()
  );

  console.log(
    84,
    flattenCategories(getCategories(data?.Data?.Lst_KB_Category))
  );
  const columns = [
    {
      dataField: "CategoryName",
      caption: t("CategoryName"),
      filterType: "exclude",
      cellRender: ({ row: { data }, value }: any) => {
        return (
          <div
            className={"flex items-center"}
            onClick={() => handleShowDetail(data)}
          >
            {data.level > 1 && (
              <span style={{ marginLeft: `${(data.level - 1) * 20}px` }}></span>
            )}
            <div className={"flex items-center"}>
              {data.hasChildren && <Icon className={""} name="expandDown" />}
              <span
                className={
                  data.hasChildren
                    ? "ml-1 text-green-600 cursor-pointer"
                    : "text-green-600 cursor-pointer"
                }
              >
                {data.CategoryName}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      dataField: "CategoryDesc",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("CategoryDesc"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      filterType: "exclude",
      visible: true,
    },
    {
      dataField: "QtyPost",
      editorOptions: {
        placeholder: t("Input"),
      },
      caption: t("QtyPost"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      filterType: "exclude",
    },
    {
      dataField: "FlagActive",
      editorOptions: {
        placeholder: t("Input"),
      },
      headerFilter: {
        dataSource: [
          {
            text: t(`Active`),
            value: ["FlagActive", "=", "1"],
          },
          {
            text: t(`InActive`),
            value: ["FlagActive", "=", "0"],
          },
        ],
      },
      caption: t("FlagActive"),
      columnIndex: 1,
      groupKey: "BASIC_INFORMATION",
      visible: true,
      filterType: "exclude",
      cellRender: ({ data }: any) => {
        return (
          <StatusButton key={nanoid()} isActive={data.FlagActive === "1"} />
        );
      },
    },
  ];
  const handleCreate = async (data: any) => {
    // const check =
    //   flattenCategories(
    //     getCategories(Category_Manager_GetALL?.Data?.Lst_KB_Category)
    //   ).filter(
    //     (val: any) =>
    //       val?.CategoryName?.toUpperCase() === data.CategoryName.toUpperCase()
    //   )?.length === 0;
    // if (check === false) {
    //   toast.warning("Tên danh mục đã tồn tại");
    // }
    if (data.CategoryName !== "") {
      const resp = await api.KB_Category_Create({
        ...data,
        FlagActive: data.FlagActive === "true" ? "1" : "0",
        OrgID: auth.orgId?.toString(),
        CategoryCode: "",
      });
      if (resp.isSuccess) {
        toast.success(t("Create Successfully"));
        setPopupVisible(false);
        await refetch();
        return true;
      }
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
      throw new Error(resp._strErrCode);
    } else {
      toast.warning("Tên danh mục không được để trống");
    }
  };
  const handleEdit = async (data: any) => {
    // const resp = await api.KB_Category_GetByCategoryCode(
    //   data.CategoryCode,
    //   auth.orgId?.toString()
    // );

    // const check =
    //   flattenCategories(
    //     getCategories(Category_Manager_GetALL?.Data?.Lst_KB_Category)
    //   ).filter(
    //     (val: any) =>
    //       val?.CategoryName?.toUpperCase() === data.CategoryName.toUpperCase()
    //   )?.length === 0;
    // if (check === false) {
    //   toast.warning("Tên danh mục đã tồn tại");
    // }

    if (true) {
      const response = await api.KB_Category_update({
        ...data,
        FlagActive: data.FlagActive === "true" ? "1" : "0",
        OrgID: auth.orgId?.toString(),
      });
      if (response.isSuccess) {
        toast.success(t("Update Successfully"));
        setPopupVisible(false);
        await refetch();
        return true;
      }
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
      throw new Error(response._strErrCode);
    }
  };
  const formSettings = useFormSettings({
    data: flattenCategories(getCategories(data?.Data?.Lst_KB_Category)),
  });
  const handleShowDetail = (data: any) => {
    setPopupVisible(true);
    setShowDetail(true);
    setDataFrom(data);
    setBottom(true);
  };
  const handleAddNew = () => {
    setDataFrom({});
    setPopupVisible(true);
    setflagEdit(false);
    setShowDetail(false);
    setBottom(false);
  };
  const handleOnEditRow = () => {};
  // const onDeleteMultiple = (e: any) => {
  //   console.log(172, e);
  // };
  const onCancelDelete = () => {};
  const OnEditRow = (e: any) => {
    setflagEdit(true);
    setShowDetail(false);
    setBottom(false);
    setDataFrom(e.row.data);
    setPopupVisible(true);
  };

  const onDeleteMultiple = async (keys: string[]) => {
    let result = confirm(
      `<div>${t("Bạn có muốn xóa bản ghi này?")}</div>`,
      `${t("Xác nhận")}`
    );
    result.then(async (dialogResult) => {
      if (dialogResult) {
        const resp = await api.KB_Category_Delete({
          OrgID: auth.orgId?.toString(),
          CategoryCode: keys,
        });
        if (resp.isSuccess) {
          toast.success(t("Delete Successfully"));
          await refetch();
          return true;
        }
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
        throw new Error(resp._strErrCode);
      }
    });
  };
  const innerSavingRowHandler = useCallback((e: any) => {
    if (e.changes && e.changes.length > 0) {
      // we don't enable batch mode, so only 1 change at a time.
      const { type } = e.changes[0];
      if (type === "insert" || type === "update") {
        // pass handle to parent page
      } else {
        onDeleteMultiple(e?.changes[0]?.key);
      }
    }
    e.cancel = true;
  }, []);
  return (
    <AdminContentLayout className={"Content_Managent"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderLayout>
          <PageHeaderLayout.Slot name={"Before"}>
            <div className="text-header font-bold dx-font-m">
              {t("Category manager")}
            </div>
          </PageHeaderLayout.Slot>
          <PageHeaderLayout.Slot name={"Center"}>
            <HeaderPart
              refetch={refetch}
              onAddNew={handleAddNew}
              handleOnEditRow={handleOnEditRow}
            />
          </PageHeaderLayout.Slot>
          <PageHeaderLayout.Slot name={"After"}></PageHeaderLayout.Slot>
        </PageHeaderLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div
          className="mt-5 categoryGrid"
          style={{ height: `${windowSize.height - 170}px` }}
        >
          <LoadPanel
            container={".dx-viewport"}
            shadingColor="rgba(0,0,0,0.4)"
            position={"center"}
            visible={isLoading}
            showIndicator={true}
            showPane={true}
          />
          <DataGrid
            className="dataGridCategory"
            dataSource={
              flattenCategories(getCategories(data?.Data?.Lst_KB_Category)) ??
              []
            }
            id="gridContainer"
            showBorders
            height={`${windowSize.height - 170}px`}
            width={"100%"}
            showColumnLines
            showRowLines
            onSaving={innerSavingRowHandler}
            keyExpr={"CategoryCode"}
            allowColumnResizing
            columnResizingMode={"widget"}
          >
            <Selection mode={"none"} selectAllMode={"page"} />
            <Paging
              enabled={true}
              defaultPageSize={9999999999999999999999999999999999}
            />
            <Pager visible={false} />
            <ColumnFixing enabled={true} />
            <HeaderFilter
              visible={true}
              dataSource={
                flattenCategories(getCategories(data?.Data?.Lst_KB_Category)) ??
                []
              }
            >
              <Search enabled={true}></Search>
            </HeaderFilter>
            <Editing
              mode={"row"}
              useIcons={true}
              allowUpdating={true}
              allowDeleting={true}
              // allowUpdating={false}
              // allowDeleting={false}
              // allowAdding={false}

              confirmDelete={true} // custom confirm delete dialog
            >
              {/* <Texts
                confirmDeleteMessage={t(
                  "Are you sure to delete those records?"
                )}
                ok={t("OK")}
                cancel={t("Cancel")}
              /> */}
            </Editing>
            <Column
              visible
              type="buttons"
              width={100}
              fixed={false}
              allowResizing={false}
            >
              <DxButton
                visible={checkPermision(
                  "BTN_ADMIN_CAMPAIGN_CATEGORYMANAGER_UPDATE"
                )}
                cssClass={"mx-1 cursor-pointer"}
                name="edit"
                icon={"/images/icons/edit.svg"}
                onClick={(e: any) => {
                  OnEditRow?.(e);
                }}
              />
              <DxButton
                visible={checkPermision(
                  "BTN_ADMIN_CAMPAIGN_CATEGORYMANAGER_DELETE"
                )}
                cssClass={"mx-1 cursor-pointer"}
                name="delete"
                icon={"/images/icons/trash.svg"}
                onClick={(e) => onDeleteMultiple?.(e.row.key)}
              />
              <DxButton
                cssClass={"mx-1 cursor-pointer"}
                name="save"
                icon={"/images/icons/save.svg"}
              />
              <DxButton
                cssClass={"mx-1 cursor-pointer"}
                name="cancel"
                icon={"/images/icons/refresh.svg"}
              />
            </Column>

            {columns.map((column: any) => {
              return <Column key={column.dataField} {...column} />;
            })}
          </DataGrid>
          {/* <DeleteMultipleConfirmationBox
            title={t("Delete")}
            message={t("DeleteMultipleConfirmationMessage")}
            onYesClick={onDeleteMultiple}
            onNoClick={onCancelDelete}
          /> */}
        </div>
        {/* <DeleteSingleConfirmationBox
          title={t("Delete")}
          message={t("DeleteSingleItemConfirmationMessage")}
          onYesClick={onDeleteSingle}
          onNoClick={onCancelDelete}
        /> */}
        <PopupView
          onEdit={handleEdit}
          formSettings={formSettings}
          title={"Thông tin danh mục"}
          onCreate={handleCreate}
        />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
