import data from "@packages/common/Validation_Rules";
import { BaseGridView, ColumnOptions } from "@/packages/ui/base-gridview";
// import d from "@/packages/common/Validation_Rules";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, DataGrid } from "devextreme-react";
import { useI18n } from "@/i18n/useI18n";
import { StatusButton } from "@/packages/ui/status-button";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { EditorPreparingEvent } from "devextreme/ui/data_grid";
import { nanoid } from "nanoid";
import { useQuery } from "@tanstack/react-query";
import { useClientgateApi } from "@/packages/api";
import { useConfiguration } from "@/packages/hooks";

export interface DataField {
  CodeField: string;
  NameField: string;
  TypeField: string;
  GroupInfo: string;
  IndexShow: 1 | 0;
  FlagActive: 1 | 0;
  FlagChange: 1 | 0;
  validationRules: [];
}

export const Skycs = () => {
  const { t } = useI18n("test");
  const ref = useRef<DataGrid | null>();

  const windowSize = useWindowSize();
  const [changing, setChanging] = useState("");
  const [loading, setLoading] = useState(false);
  const api = useClientgateApi();
  const config = useConfiguration();
  //call api CarModel
  const {
    data: dataCarModel,
    isLoading,
    refetch,
  } = useQuery(["Skycs_CarModel"], () => api.Mst_CarModel_GetAllActive());

  // const dataValue = [
  //   {
  //     CodeField: "Test",
  //     NameField: "test name",
  //     TypeField: "text",
  //     GroupInfo: "Group Info",
  //     IndexShow: 0,
  //     FlagActive: 1,
  //     FlagChange: 0,
  //     validationRules: [],
  //   },
  //   {
  //     CodeField: "Test 2",
  //     NameField: "test name 2",
  //     TypeField: "text",
  //     GroupInfo: "Group Info 2",
  //     IndexShow: 0,
  //     FlagActive: 1,
  //     FlagChange: 0,
  //     validationRules: [],
  //   },
  // ];

  const getValue = useCallback(() => {
    if (dataCarModel?.DataList) {
      const firstChild = dataCarModel?.DataList[0];
      const newColumn = Object.keys(firstChild).map(
        (i: string, index: number) => {
          return {
            CodeField: i,
            NameField: i,
            TypeField: "dxTextBox",
            GroupInfo: "",
            IndexShow: index,
            FlagActive: 1,
            FlagChange: 0,
            validationRules: [],
          };
        }
      );
      return newColumn;
    } else {
      return [];
    }
  }, [isLoading]);

  const getLocal: any = () => {
    const value = localStorage.getItem("Skycs_DataField");
    if (value && typeof value === "string" && value !== "undefined") {
      return JSON.parse(value);
    } else {
      return [];
    }
  };

  const handleSetLocal = (data: any[]): void => {
    localStorage.setItem("Skycs_DataField", JSON.stringify(data));
  };

  // console.log("data ", dataCarModel);

  // useEffect(() => {
  //   if (getLocal().length) {
  //     setListItemColumn(getLocal());
  //   }
  //   if (getValue() && !getLocal() !== null) {
  //     console.log("getValue ", getValue(), "getLocal ", getLocal());
  //     if (getValue()?.length) {
  //       console.log("getValue() ", getValue());
  //       handleSetLocal(getValue());
  //       setListItemColumn(getValue());
  //       return;
  //     }
  //   }
  // }, [isLoading]);

  // useEffect(() => {
  //   const dataLocal = localStorage.getItem("Skycs_DataField");
  //   if (
  //     dataLocal &&
  //     typeof dataLocal === "string" &&
  //     dataLocal !== "undefined"
  //   ) {
  //     const parse = JSON.parse(dataLocal);
  //     if (Array.isArray(parse)) {
  //       console.log("127");
  //       setListItemColumn(JSON.parse(dataLocal));
  //       return;
  //     } else {
  //       console.log("131");
  //       setListItemColumn([JSON.parse(dataLocal)]);
  //       return;
  //     }
  //   } else {
  //     if (dataCarModel?.DataList) {
  //       console.log("137");
  //       setListItemColumn(getValue());
  //     } else {
  //       console.log("140");
  //       setListItemColumn(dataValue);
  //     }
  //   }

  //   return () => {};
  // }, [changing, isLoading]);

  useEffect(() => {
    if (getLocal().length) {
      setListItemColumn(getLocal());
      return;
    }
    if (dataCarModel?.DataList) {
      setListItemColumn(getValue());
      handleSetLocal(getValue());
      return;
    }
  }, [isLoading]);

  const [listItemColumn, setListItemColumn] = useState(() => {
    const dataLocal = localStorage.getItem("Skycs");
    if (dataLocal) {
      if (Array.isArray(dataLocal)) {
        return JSON.parse(dataLocal);
      } else {
        return [JSON.parse(dataLocal)];
      }
    } else {
      return [];
    }
  });

  const groundList = [
    "Thông tin cơ bản",
    "Thông tin liên hệ",
    "Thông tin hóa đơn",
    "Thông tin thanh toán",
  ];

  const listType = useMemo(() => {
    return [
      {
        name: "Text",
        value: "dxTextBox",
      },
      {
        name: "Number",
        value: "dxNumberBox",
      },
      {
        name: "Switch",
        value: "dxSwitch",
      },
      {
        name: "Date",
        value: "dxDateBox",
      },
      {
        name: "DateTime",
        value: "dxDateTimeBox",
      },
      {
        name: "Time",
        value: "dxTimeBox",
      },
      {
        name: "CheckBox",
        value: "dxCheckBox",
      },
      {
        name: "SelectBox",
        value: "dxSelectBox",
      },
      {
        name: "Select Multiple",
        value: "dxTagBox",
      },
      {
        name: "Select Radio",
        value: "dxSelectRadioBox",
      },
      {
        name: "Select Check",
        value: "dxSelectMultipleCheckBox",
      },
    ];
  }, []);

  const columns: ColumnOptions[] = useMemo(() => {
    return [
      {
        dataField: "CodeField",
        caption: t("Mã trường"),
        editorOptions: {},
        editorType: "dxTextBox",
        visible: true,
        validationRules: [data.requiredType],
      },
      {
        dataField: "NameField",
        caption: t("Tên Trường"),
        editorOptions: {},
        editorType: "dxTextBox",
        visible: true,
        validationRules: [data.requiredType],
      },
      {
        dataField: "TypeField",
        caption: t("Kiểu dữ liệu"),
        editorType: "dxSelectBox",
        validationRules: [data.requiredType],
        editorOptions: {
          dataSource: listType,
          displayExpr: "name",
          valueExpr: "value",
        },
      },
      {
        dataField: "GroupInfo",
        caption: t("Nhóm thông tin"),
        editorOptions: {
          dataSource: groundList,
        },
        editorType: "dxSelectBox",
      },
      {
        dataField: "IndexShow",
        caption: t("Thứ tự hiển thị"),
        editorOptions: {},
        editorType: "dxNumberBox",
      },
      {
        dataField: "RefNoList",
        caption: t("RefNoList"), // giới thiệu không có danh sách
        editorOptions: {},
        editorType: "dxTextBox",
        setCellValue: (newValue: any, value: string) => {
          newValue.RefNoList = value;
          newValue.FlagUser = true;
        },
      },
      {
        dataField: "FlagActive",
        caption: t("Trạng thái sử dụng"),
        editorOptions: {},
        alignment: "center",
        editorType: "dxSwitch",
        cellRender: ({ data }: any) => {
          return <StatusButton isActive={data.FlagActive} />;
        },
      },
      {
        dataField: "FlagChange",
        caption: t("Trường động"),
        editorOptions: {
          readOnly: true,
        },
        alignment: "center",
        editorType: "dxSwitch",
        cellRender: ({ data }: any) => {
          return <StatusButton isActive={data.FlagChange} />;
        },
      },
      {
        dataField: "FlagUser",
        caption: t("Flag User"),
        editorOptions: {
          readOnly: true,
        },
        alignment: "center",
        editorType: "dxSwitch",
        cellRender: ({ data }: any) => {
          return <StatusButton isActive={data.FlagChange} />;
        },
      },
    ];
  }, []);

  const handleAdd = useCallback(() => {
    ref?.current?.instance.addRow();
  }, []);

  const handleSavingRow = async (e: any) => {
    if (e.changes && e.changes.length > 0) {
      const { type } = e.changes[0];
      if (type === "remove") {
        const id = e.changes[0].key;
        e.promise = onDelete(id);
      } else if (type === "insert") {
        const data: any = e.changes[0].data!;
        e.promise = onCreate(data);
      } else if (type === "update") {
        const { key, data } = e.changes[0];
        e.promise = onUpdate(data, key);
      }
    }
    e.cancel = true;
  };

  const onDelete = async (id: string) => {
    const newData = listItemColumn.filter((item: any) => item.CodeField !== id);
    handleSetLocal(newData);
    setListItemColumn(newData);
  };

  const onCreate = async (data: any) => {
    console.log("listItemColumn ", listItemColumn);
    console.log("getLocal", getLocal());
    const newData = {
      ...data,
      FlagChange: 1,
      FlagActive: data?.FlagActive ? 1 : 0,
    };
    const newValue = [...getLocal(), newData];
    console.log("newValue ", newValue, "listItemColumn 123", listItemColumn);
    setLoading(true);
    setTimeout(() => {
      setChanging(nanoid());
      setListItemColumn(newValue);
      handleSetLocal(newValue);
      setLoading(false);
    }, 1000);
  };

  const onUpdate = async (data: any, key: string) => {
    const newData = listItemColumn.map((item: any) => {
      if (item.CodeField === key) {
        return {
          ...item,
          ...data,
        };
      }
      return item;
    });
    handleSetLocal(newData);
    setListItemColumn(newData);
  };

  const handleEditorPreparing = (e: EditorPreparingEvent<any, any>) => {
    if (e.dataField) {
      if (["NameField", "CodeField", "TypeField"].includes(e.dataField)) {
        e.editorOptions.readOnly = !e.row?.isNewRow;
      }
    }
  };

  const handleGridReady = useCallback((grid: any) => {
    ref.current = grid;
  }, []);

  return (
    <>
      <Button onClick={handleAdd}> {t("Add")} </Button>
      <h3>Thiếp lập thông tin khách hàng</h3>
      {loading ? (
        "Loading..."
      ) : (
        <BaseGridView
          isLoading={isLoading || loading}
          defaultPageSize={config.PAGE_SIZE}
          dataSource={listItemColumn}
          columns={columns}
          keyExpr="CodeField"
          allowSelection={true}
          allowInlineEdit={true}
          onReady={handleGridReady}
          onEditorPreparing={handleEditorPreparing}
          onSelectionChanged={() => {}}
          onSaveRow={handleSavingRow}
          inlineEditMode={"row"}
          storeKey="Skycs"
        />
      )}
    </>
  );
};
