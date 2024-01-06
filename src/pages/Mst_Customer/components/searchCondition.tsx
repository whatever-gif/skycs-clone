import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { mapEditorOption, mapEditorType } from "@/utils/customer-common";
import { useQuery } from "@tanstack/react-query";
import DataSource from "devextreme/data/data_source";
import { useAtomValue, useSetAtom } from "jotai";
import { uniqBy } from "lodash-es";
import { useCallback, useRef } from "react";
import { match } from "ts-pattern";
import { SearchPaneCustomize } from "./search-panel-customize";
import {
  countryFieldAtom,
  dateFieldAtom,
  districtFieldAtom,
  provinceFieldAtom,
  wardFieldAtom,
} from "./store";

interface Props {
  onSearch: (data: any) => void;
  formData: any;
  listColumn: any;
  data: any;
}

const SearchCondition = ({ onSearch, formData, listColumn, data }: Props) => {
  const formRef: any = useRef(null);
  const { t } = useI18n("Mst_CustomerSearch");
  const dateField = useAtomValue(dateFieldAtom);
  const api = useClientgateApi();

  let dynamicFieldAll: any[] = [];

  const countryDataSource = new DataSource({
    load: async (loadOptions) => {
      if (!loadOptions?.searchValue) {
        return [];
      }
      const resp: any = await api.Mst_Country_Search({
        KeyWord: loadOptions.searchValue,
        FlagActive: 1,
        Ft_PageIndex: 0,
        Ft_PageSize: 1000,
      });

      return resp?.DataList ?? [];
    },
    byKey: async (key: any) => {
      if (!key) {
        return [];
      }

      const resp: any = await api.Mst_Country_Search({
        KeyWord: key,
        FlagActive: 1,
        Ft_PageIndex: 0,
        Ft_PageSize: 1000,
      });

      return resp?.DataList ?? [];
    },
  });

  const provinceDataSource = new DataSource({
    load: async (loadOptions) => {
      if (!loadOptions?.searchValue) {
        return [];
      }

      const resp: any = await api.Mst_Province_Search({
        KeyWord: loadOptions.searchValue,
        FlagActive: 1,
        Ft_PageIndex: 0,
        Ft_PageSize: 1000,
      });

      return resp?.DataList ?? [];
    },
    byKey: async (key: any) => {
      if (!key) {
        return [];
      }

      const resp: any = await api.Mst_Province_Search({
        KeyWord: key,
        FlagActive: 1,
        Ft_PageIndex: 0,
        Ft_PageSize: 1000,
      });

      return resp?.DataList ?? [];
    },
  });

  const districtDataSource = new DataSource({
    load: async (loadOptions) => {
      if (!loadOptions?.searchValue) {
        return [];
      }

      const resp: any = await api.Mst_District_Search({
        KeyWord: loadOptions.searchValue,
        FlagActive: 1,
        Ft_PageIndex: 0,
        Ft_PageSize: 1000,
      });

      return resp?.DataList ?? [];
    },
    byKey: async (key: any) => {
      if (!key) {
        return [];
      }

      const resp: any = await api.Mst_District_Search({
        KeyWord: key,
        FlagActive: 1,
        Ft_PageIndex: 0,
        Ft_PageSize: 1000,
      });

      return resp?.DataList ?? [];
    },
  });

  const wardDataSource = new DataSource({
    load: async (loadOptions) => {
      if (!loadOptions?.searchValue) {
        return [];
      }

      const resp: any = await api.Mst_Ward_Search({
        KeyWord: loadOptions.searchValue,
        FlagActive: 1,
        Ft_PageIndex: 0,
        Ft_PageSize: 1000,
      });

      return resp?.DataList ?? [];
    },
    byKey: async (key: any) => {
      if (!key) {
        return [];
      }

      const resp: any = await api.Mst_Ward_Search({
        KeyWord: key,
        FlagActive: 1,
        Ft_PageIndex: 0,
        Ft_PageSize: 1000,
      });

      return resp?.DataList ?? [];
    },
  });

  const { data: paymentSaleDataSource } = useQuery(
    ["paymentSaleDataSource"],
    async () => {
      const resp: any = await api.Mst_PaymentTermController_GetAllActive();

      const resultSale = resp?.DataList?.filter(
        (item: any) => item?.PTType == "SALE"
      );

      const resultPurchase = resp?.DataList?.filter(
        (item: any) => item?.PTType == "PURCHASE"
      );

      return {
        sale: resultSale ?? [],
        purchase: resultPurchase ?? [],
      };
    }
  );

  const { data: areaDataSource } = useQuery(["areaDataSource"], async () => {
    const resp: any = await api.Mst_Area_GetAllActive();

    return resp?.DataList ?? [];
  });

  const { data: agentDataSource } = useQuery(["agentDataSource"], async () => {
    const resp: any = await api.Sys_User_GetAllActive();

    return resp?.DataList ?? [];
  });

  const staticField = listColumn.dataField.filter(
    (item: any) => item.FlagIsColDynamic !== "1"
  );

  const dynamicField = listColumn.dataField.filter(
    (item: any) => item.FlagIsColDynamic === "1"
  );

  // Mã khách hàng

  // Tên khách hàng

  // MST

  // Email

  // Điện thoại

  // Nhóm khách hàng

  // Loại khách hàng (Cá nhân/Tổ chức)

  // Nguồn khách

  // Đối tượng

  // Công ty ( mst org )

  // Thời gian tạo
  // (FromDate)

  const mapIdx = (colCodeSys: string) => {
    return (
      match(colCodeSys)
        .with("CustomerCode", () => {
          // Mã khách hàng
          return 0;
        })
        .with("CustomerName", () => {
          // Tên khách hàng
          return 1;
        })
        .with("MST", () => {
          // MST
          return 2;
        })
        .with("CtmEmail", () => {
          // Email
          return 3;
        })
        .with("CtmPhoneNo", () => {
          // Điện thoại
          return 4;
        })
        .with("CustomerGrpCode", () => {
          // Nhóm khách hàng
          return 5;
        })
        .with("CustomerType", () => {
          // Loại khách hàng (Cá nhân/Tổ chức)
          return 6;
        })
        .with("CustomerCodeSysERP", () => {
          // Loại khách hàng (Cá nhân/Tổ chức)
          return 7;
        })
        .with("C0RR", () => {
          // Nguồn khách
          return 8;
        })
        .with("PartnerType", () => {
          // Đối tượng
          return 9;
        })
        // .with("C048", () => {
        //   // Công ty ( mst org )
        //   return 10;
        // })
        .with("CreateDTimeUTC", () => {
          // Thời gian tạo
          return 11;
        })
        .otherwise(() => {
          return 99999999999;
        })
    );
  };

  const checkVisible = (colCodeSys: string) => {
    return [
      "CustomerCode",
      "CustomerName",
      "MST",
      "CtmEmail",
      "CtmPhoneNo",
      "CustomerGrpCode",
      "CustomerCodeSysERP",
      "CustomerType",
      "C0RR",
      "PartnerType",
      "CreateDTimeUTC",
    ].includes(colCodeSys);
  };

  const searchStaticColumnSearch = staticField.map((item: any) => {
    const columnField = {
      dataField: item.ColCodeSys,
      caption: t(item.ColCaption),
      colSpan: 2,
      label: {
        text: t(item.ColCaption),
      },
      visible: checkVisible(item.ColCodeSys),
      editorOptions: {
        showClearButton: true,
      },
    };

    // nhóm khách hàng
    if (item.ColCodeSys === "CustomerGrpCode") {
      return {
        ...columnField,
        editorOptions: {
          dataSource: data.listCustomerGrp?.DataList ?? [],
          valueExpr: "CustomerGrpCode",
          displayExpr: "CustomerGrpName",
        },
        editorType: "dxTagBox",
      };
    }

    //Đối tượng
    if (item.ColCodeSys === "PartnerType") {
      return {
        ...columnField,
        editorOptions: {
          dataSource: data.listPartnerType?.DataList ?? [],
          valueExpr: "PartnerType",
          displayExpr: "PartnerTypeName",
        },
        editorType: "dxTagBox",
      };
    }

    // nguồn khách hàng
    if (item.ColCodeSys === "CustomerSource") {
      return {
        ...columnField,
        editorOptions: {
          dataSource: data.listCustomerSource ?? [],
          valueExpr: "Value",
          displayExpr: "Value",
        },
        editorType: "dxTagBox",
      };
    }

    // trạng thái
    if (item.ColCodeSys === "CustomerCodeSysERP") {
      return {
        ...columnField,
        editorOptions: {
          dataSource: data.listCustomerCodeSysERP ?? [],
          valueExpr: "CustomerCodeSys",
          displayExpr: "CustomerName",
        },
        editorType: "dxSelectBox",
      };
    }

    // Loại khách hàng
    if (item.ColCodeSys === "CustomerType") {
      return {
        ...columnField,
        editorOptions: {
          dataSource: data.listCustomerType?.Data?.Lst_Mst_CustomerType ?? [],
          valueExpr: "CustomerType",
          displayExpr: "CustomerTypeName",
        },
        editorType: "dxSelectBox",
      };
    }

    // type date
    if (dateField.includes(item.ColCodeSys)) {
      return {
        ...columnField,
        editorType: "dxDateRangeBox",
        editorOptions: {
          type: "date",
          displayFormat: "yyyy-MM-dd",
          showClearButton: true,
        },
      };
    }

    if (item?.ColCodeSys?.includes("Country")) {
      return {
        ...columnField,
        editorOptions: {
          dataSource: countryDataSource,
          valueExpr: "CountryCode",
          displayExpr: "CountryName",
          showClearButton: true,
          searchEnabled: true,
        },
        editorType: "dxSelectBox",
      };
    }

    if (item?.ColCodeSys?.includes("ProvinceCode")) {
      return {
        ...columnField,
        editorOptions: {
          dataSource: provinceDataSource,
          valueExpr: "ProvinceCode",
          displayExpr: "ProvinceName",
          showClearButton: true,
          searchEnabled: true,
        },
        editorType: "dxSelectBox",
      };
    }

    if (item?.ColCodeSys?.includes("DistrictCode")) {
      return {
        ...columnField,
        editorOptions: {
          dataSource: districtDataSource,
          valueExpr: "DistrictCode",
          displayExpr: "DistrictName",
          showClearButton: true,
          searchEnabled: true,
        },
        editorType: "dxSelectBox",
      };
    }

    if (item?.ColCodeSys?.includes("WardCode")) {
      return {
        ...columnField,
        editorOptions: {
          dataSource: wardDataSource,
          valueExpr: "WardCode",
          displayExpr: "WardName",
          showClearButton: true,
          searchEnabled: true,
        },
        editorType: "dxSelectBox",
      };
    }

    if (item?.ColCodeSys == "FlagActive") {
      return {
        ...columnField,
        editorOptions: {
          dataSource: [
            {
              value: "",
              text: "All",
            },
            {
              value: "1",
              text: "Active",
            },
            {
              value: "0",
              text: "Inactive",
            },
          ],
          valueExpr: "value",
          displayExpr: "text",
          showClearButton: true,
          searchEnabled: true,
        },
        editorType: "dxSelectBox",
      };
    }

    if (item?.ColCodeSys == "UserCodeMng") {
      return {
        ...columnField,
        editorOptions: {
          dataSource: agentDataSource,
          valueExpr: "UserCode",
          displayExpr: "UserName",
          showClearButton: true,
          searchEnabled: true,
        },
        editorType: "dxTagBox",
      };
    }

    if (item?.ColCodeSys == "CreateBy") {
      return {
        ...columnField,
        editorOptions: {
          dataSource: agentDataSource,
          valueExpr: "UserCode",
          displayExpr: "UserName",
          showClearButton: true,
          searchEnabled: true,
        },
        editorType: "dxSelectBox",
      };
    }

    return columnField;
  });

  const searchDynamicColumnSearch = dynamicField.map((item: any) => {
    let column: any = {
      ColOperatorType: item.ColOperatorType,
      dataField: item.ColCodeSys,
      visible: false,
      colSpan: 2,
      editorType: mapEditorType(item.ColDataType),
      caption: t(item.ColCaption),
      label: {
        text: item.ColCaption,
      },
      editorOptions: {
        ...mapEditorOption({
          field: item,
          listDynamic: listColumn.listMaster,
        }),
        showClearButton: true,
        searchEnabled: true,
      },
    };

    if (item.ColCaption == "Điều khoản bán hàng") {
      column.editorOptions = {
        dataSource: paymentSaleDataSource?.sale,
        valueExpr: "PaymentTermName",
        displayExpr: "PaymentTermName",
        searchEnabled: true,
        showClearButton: true,
      };
    }

    if (item.ColCaption == "Điều khoản mua hàng") {
      column.editorOptions = {
        dataSource: paymentSaleDataSource?.purchase,
        valueExpr: "PaymentTermName",
        displayExpr: "PaymentTermName",
        searchEnabled: true,
        showClearButton: true,
      };
    }

    if (item.ColCaption == "Vùng thị trường") {
      column.editorOptions = {
        dataSource: areaDataSource,
        valueExpr: "AreaCode",
        displayExpr: "AreaName",
        searchEnabled: true,
        showClearButton: true,
      };
    }

    return column;
  });

  searchDynamicColumnSearch.forEach((element: any) => {
    if (element.ColOperatorType === "RANGE") {
      const obj = [
        {
          ...element,
          colSpan: 1,
          visible: false,
        },
        {
          ...element,
          colSpan: 1,
          dataField: element.dataField + "_To",
          caption: element.caption + " " + t("To"),
          label: {
            text: element.label.text + " " + t("To"),
          },
          visible: false,
        },
      ];
      dynamicFieldAll = [...dynamicFieldAll, ...obj];
    } else {
      dynamicFieldAll = [...dynamicFieldAll, element];
    }
  });

  const listField = uniqBy(
    [...searchStaticColumnSearch, ...searchDynamicColumnSearch].map((item) => {
      return {
        ...item,
        idx: mapIdx(item.dataField),
      };
    }),
    "dataField"
  )
    .sort((a, b) => a.idx - b.idx)
    .map((item) => {
      const obj = item;
      delete obj.idx;
      return obj;
    });
  const customizeItem = useCallback((e: any) => {}, []);

  return (
    <>
      <SearchPaneCustomize
        ref={formRef}
        colCount={2}
        conditionFields={listField}
        storeKey="Mst_Customer_Panel_Search"
        data={formData}
        onSearch={onSearch}
        customizeItem={customizeItem}
      />
    </>
  );
};

export default SearchCondition;
