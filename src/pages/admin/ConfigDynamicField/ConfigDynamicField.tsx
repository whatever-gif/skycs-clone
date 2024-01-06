import PermissionContainer from "@/components/PermissionContainer";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { BaseGridView } from "@/packages/ui/base-gridview";
import { useQuery } from "@tanstack/react-query";
import { Button, DataGrid, TextBox } from "devextreme-react";
import { useSetAtom } from "jotai";
import { useMemo, useRef, useState } from "react";
import { EditForm } from "./components/ConfigDynamicPopup";
import { currentItemAtom, flagAtom, showPopupAtom } from "./components/store";
import { useConfigDynamicFieldColumn } from "./components/use-columns";

const ConfigDynamicField = () => {
  const api = useClientgateApi();

  const { t: common } = useI18n("Common");

  const setFlag = useSetAtom(flagAtom);
  const setCurrentItem = useSetAtom(currentItemAtom);
  const setPopupVisible = useSetAtom(showPopupAtom);

  let gridRef: any = useRef<DataGrid | null>(null);

  const { data, isLoading, refetch } = useQuery(
    ["listConfigDynamicField"],
    async () => {
      const resp = await api.MDMetaColumn_Search({
        Ft_PageIndex: 0,
        Ft_PageSize: 1000,
      });

      if (resp?.isSuccess) {
        return (
          resp?.DataList?.filter((item: any) => item?.FlagIsColDynamic == "1")
            .sort((a: any, b: any) => {
              const a_time: any = new Date(a.LogLUDTimeUTC);
              const b_time: any = new Date(b.LogLUDTimeUTC);

              return b_time - a_time;
            })
            ?.map((item: any) => {
              return {
                ...item,
                FlagActive:
                  item?.FlagActive == "1" || item?.FlagActive == true
                    ? "1"
                    : "0",
              };
            }) ?? []
        );
      }
    }
  );

  const columns = useConfigDynamicFieldColumn({
    refetch: refetch,
  });

  const [search, setSearch] = useState<any>("");

  const popupSettings = {};

  const handleEditorPreparing = (e: any) => {};

  const handleSelectionChanged = (rows: string[]) => {};

  const handleEditRowChanges = () => {};

  const handleSavingRow = (e: any) => {
    if (e.changes && e.changes.length > 0) {
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

  const handleCustomerEdit = (e: any) => {};

  const handleDeleteRow = async (a: any) => {};

  const onDelete = async (id: Partial<any>) => {};

  const onCreate = async (data: any) => {};

  const onModify = async (key: Partial<any>, data: Partial<any>) => {};

  const handleAdd = async () => {
    setFlag("add");
    const resp = await api.Seq_GetColCodeSys();

    if (resp.isSuccess) {
      setCurrentItem({
        ColCode: resp.Data,
        FlagActive: "1",
        ColCaption: "",
        ColDataType: "",
        OrgID: "",
        NetworkID: "",
        JsonListOption: "",
      });
      setPopupVisible(true);
    }
  };

  const table = useMemo(() => {
    const filteredList = data?.filter((item: any) => {
      return item?.ColCaption?.includes(search);
    });

    // const f = filteredList?.filter(
    //   (item: any) => !jsonData.some((c: any) => c.ColCodeSys == item.ColCodeSys)
    // );

    // f?.map(async (item: any) => {
    //   const r = await api.MDMetaColumn_Delete(item.ColCodeSys);

    //   if (r.isSuccess) {
    //     toast.success("");
    //   } else {
    //     toast.error("");
    //   }
    // });

    return (
      <BaseGridView
        isLoading={isLoading}
        dataSource={filteredList ?? []}
        columns={columns}
        keyExpr={["ColCode"]}
        popupSettings={popupSettings}
        onReady={(ref) => (gridRef = ref)}
        allowSelection={false}
        onSelectionChanged={handleSelectionChanged}
        onSaveRow={handleSavingRow}
        onEditorPreparing={handleEditorPreparing}
        onCustomerEditing={handleCustomerEdit}
        inlineEditMode="row"
        onDeleteRows={handleDeleteRow}
        onEditRowChanges={handleEditRowChanges}
        storeKey={"Config_Dynamic_Field"}
        showCheck={false}
        editable={false}
      />
    );
  }, [search, data]);

  return (
    <div className="w-full h-full pb-[10px]">
      <AdminContentLayout className={"Mst_Customer"}>
        {/* Header */}
        <AdminContentLayout.Slot name={"Header"}>
          <PermissionContainer permission="BTN_CONFIGDYNAMICFIELD_ADD">
            <div className="flex items-center w-full">
              <Button
                onClick={handleAdd}
                style={{
                  background: "#00703C",
                  color: "white",
                  padding: "10px 20px",
                  margin: 10,
                  width: 120,
                }}
              >
                {common("Add")}
              </Button>

              <div className="self-center flex flex-grow-1 w-full justify-center relative">
                <div className="w-[400px] flex items-center relative">
                  <TextBox
                    placeholder={common("Search...")}
                    className="relative w-full"
                    onValueChanged={(e: any) => setSearch(e.value)}
                    value={search}
                  ></TextBox>
                  <img
                    src="/images/icons/search-icon.png"
                    className="w-[24px] h-[24px] absolute right-[5px]"
                  />
                </div>
              </div>
            </div>
          </PermissionContainer>
        </AdminContentLayout.Slot>
        {/* Content */}
        <AdminContentLayout.Slot name={"Content"}>
          {table}
          <EditForm
            onCancel={() => {
              setPopupVisible(false);
            }}
            onSave={refetch}
          />
        </AdminContentLayout.Slot>
      </AdminContentLayout>
    </div>
  );
};

export default ConfigDynamicField;
