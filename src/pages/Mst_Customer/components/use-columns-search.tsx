import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { getDMY } from "@/utils/time";
import { useQuery } from "@tanstack/react-query";
import { DateBox } from "devextreme-react";
import DataSource from "devextreme/data/data_source";
import { useAtomValue, useSetAtom } from "jotai";
import {
  countryFieldAtom,
  dateFieldAtom,
  selectFieldAtom,
  tagFieldAtom,
} from "./store";

interface Columns {
  listColumn: {
    dataField: any[];
    listMaster: any[];
  };
}

export const useColumnsSearch = ({ listColumn }: Columns) => {
  const { t } = useI18n("Mst_CustomerSearch");
  const dateField = useAtomValue(dateFieldAtom);
  const countryField = useAtomValue(countryFieldAtom);
  const tagField = useAtomValue(tagFieldAtom);
  const selectField = useAtomValue(selectFieldAtom);
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);
  const infiniteList = new DataSource({
    load: async (loadOptions: any) => {
      // Loading data objects
      const response = await api.Mst_Province_GetAllActive();
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

      return [];
    },
  });

  const { data: listCustomerType }: any = useQuery(
    ["listCustomerType"],
    api.Mst_CustomerType_GetAllCustomerType
  );

  const { data: listCountry }: any = useQuery(
    ["ListCountry"],
    api.Mst_Country_GetAllActive
  );

  const { data: listCustomerGrp }: any = useQuery(
    ["listCustomerGrp"],
    api.Mst_CustomerGroup_GetAllActive
  );

  const { data: listPartnerType }: any = useQuery(
    ["listPartnerType"],
    api.Mst_PartnerType_GetAllActive
  );

  const { data: listCustomer }: any = useQuery(
    ["listCustomer"],
    api.Mst_Customer_GetAllActive
  );

  const { data: listNNT }: any = useQuery(
    ["listNNT"],
    api.Mst_NNTController_GetAllActive
  );

  const { data: listCustomerCodeSysERP }: any = useQuery(
    ["listCustomerCodeSysERP"],
    async () => {
      const resp: any = await api.Mst_Customer_Search({
        FlagActive: 1,
        Ft_PageIndex: 0,
        Ft_PageSize: 1000,
        CustomerType: "TOCHUC",
      });

      return resp?.DataList ?? [];
    }
  );

  const { data: listCustomerSource }: any = useQuery(
    ["listCustomerSource"],
    async () => {
      const resp: any = await api.MdMetaColGroupSpec_Search(
        {},
        "ScrTplCodeSys.2023"
      );

      if (resp?.DataList && resp?.DataList?.length > 0) {
        const find = resp?.DataList?.find(
          (item: any) => item?.ColCodeSys == "C0K5"
        );

        if (find) {
          const data = JSON.parse(find?.JsonListOption ?? "[]");

          return data;
        }

        return [];
      }

      return [];
    }
  );

  const staticField = listColumn.dataField.filter(
    (item) => item.FlagIsColDynamic !== "1"
  );

  const dynamicField = listColumn.dataField.filter(
    (item) => item.FlagIsColDynamic === "1"
  );

  const searchStaticColumnSearch = staticField.map((item: any) => {
    const columnField = {
      dataField: item.ColCodeSys,
      visible: true,
      caption: item.ColCaption,
      colSpan: 2,
      label: {
        text: item.ColCaption,
      },
      editorOptions: {},
    };
    if (countryField.includes(item.ColCodeSys)) {
      return {
        ...columnField,
        editorOptions: {
          dataSource: listCountry?.DataList ?? [],
          valueExpr: "CountryCode",
          displayExpr: "CountryName",
          showClearButton: true,
        },
        editorType: "dxSelectBox",
      };
    }

    if (item.ColCodeSys === "ProvinceCodeContact") {
      return {
        ...columnField,
        label: {
          text: item.ColCaption + "123",
        },
        editorOptions: {
          dataSource: infiniteList,
          displayExpr: "ProvinceName",
          valueExpr: "ProvinceCode",
        },
        editorType: "dxSelectBox",
      };
    }

    if (item.ColCodeSys === "ProvinceCodeDelivery") {
      return {
        ...columnField,
        label: {
          text: item.ColCaption,
        },
        editorOptions: {
          dataSource: [],
          displayExpr: "ProvinceName",
          valueExpr: "ProvinceCode",
        },
        editorType: "dxSelectBox",
      };
    }

    if (item.ColCodeSys === "ProvinceCodeInvoice") {
      return {
        ...columnField,
        dataSource: [],
        displayExpr: "ProvinceName",
        valueExpr: "ProvinceCode",
        editorType: "dxSelectBox",
      };
    }

    // nhóm khách hàng
    if (item.ColCodeSys === "CustomerGrpCode") {
      return {
        ...columnField,
        editorOptions: {
          dataSource: listCustomerGrp?.DataList ?? [],
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
          dataSource: listPartnerType?.DataList ?? [],
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
          dataSource: listCustomerSource ?? [],
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
          dataSource: listCustomerCodeSysERP ?? [],
          valueExpr: "CustomerCodeSys",
          displayExpr: "CustomerName",
        },
        editorType: "dxSelectBox",
      };
    }

    // Loại khách hàng
    if (item.ColCodeSys === "CustomerTypeName") {
      return {
        ...columnField,
        editorOptions: {
          dataSource: listCustomerType?.Data?.Lst_Mst_CustomerType ?? [],
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
        },
      };
    }

    return columnField;
  });

  const searchDynamicColumnSearch = dynamicField.map((item: any) => {
    let column: any = {
      dataField: item.ColCodeSys,
      visible: false,
      caption: t(item.ColCaption),
      label: {
        text: item.ColCaption,
      },
      editorOptions: {},
    };

    if (
      tagField.includes(item.ColDataType) ||
      selectField.includes(item.ColDataType)
    ) {
      if (
        item.ColDataType !== "MASTERDATA" ||
        item.ColDataType !== "MASTERDATASELECTMULTIPLE"
      ) {
        const dataSource = JSON.parse(item.mdmc_JsonListOption || "[]");

        if (tagField.includes(item.ColDataType)) {
          column = {
            ...column,
            editorType: "dxTagBox",
            editorOptions: {
              dataSource: dataSource,
              valueExpr: "Value",
              displayExpr: "Value",
            },
          };
        }
        if (selectField.includes(item.ColDataType)) {
          column = {
            ...column,
            editorType: "dxSelectBox",
            editorOptions: {
              dataSource: dataSource,
              valueExpr: "Value",
              displayExpr: "Value",
            },
          };
        }
      }
    }
    return column;
  });

  // const searchColumns: any = [
  //   {
  //     dataField: "CustomerCode", // Mã khách hàng
  //     caption: t("CustomerCode"),
  //     visible: true,
  //     label: {
  //       text: "Mã khách hàng",
  //     },
  //     editorOptions: {},
  //   },
  //   {
  //     dataField: "CustomerName", // tên khách hàng
  //     caption: t("CustomerName"),
  //     visible: true,
  //     label: {
  //       text: "Tên khách hàng",
  //     },
  //     editorOptions: {},
  //   },
  //   {
  //     dataField: "MST", // Mã số thuế
  //     caption: t("MST"),
  //     visible: true,
  //     label: {
  //       text: "MST",
  //     },
  //     editorOptions: {},
  //   },
  //   {
  //     dataField: "CtmEmail", // Email
  //     caption: t("CtmEmail"),
  //     visible: true,
  //     label: {
  //       text: "Email",
  //     },
  //     editorOptions: {},
  //   },
  //   {
  //     dataField: "CtmPhoneNo", // Số điện thoại
  //     caption: t("CtmPhoneNo"),
  //     visible: true,
  //     label: {
  //       text: "Số điện thoại",
  //     },
  //     editorOptions: {},
  //   },
  //   {
  //     dataField: "CustomerGrpCode", // Nhóm khách hàng
  //     caption: t("CustomerGrpCode"),
  //     visible: true,
  //     label: {
  //       text: "Nhóm khách hàng",
  //     },
  //     editorOptions: {
  //       dataSource: listCustomerGrp?.DataList ?? [],
  //       valueExpr: "CustomerGrpCode",
  //       displayExpr: "CustomerGrpName",
  //     },
  //     editorType: "dxTagBox",
  //   },
  //   {
  //     dataField: "PartnerType", // Đối tượng
  //     caption: t("PartnerType"),
  //     visible: true,
  //     label: {
  //       text: "Đối tượng",
  //     },
  //     editorOptions: {
  //       dataSource: listPartnerType?.DataList ?? [],
  //       valueExpr: "PartnerType",
  //       displayExpr: "PartnerTypeName",
  //     },
  //     editorType: "dxTagBox",
  //   },
  //   {
  //     dataField: "CustomerSource", // Nguồn khách hàng
  //     caption: t("CustomerSource"),
  //     visible: true,
  //     label: {
  //       text: "Nguồn khách",
  //     },
  //     editorOptions: {
  //       dataSource: listCustomerSource ?? [],
  //       valueExpr: "Value",
  //       displayExpr: "Value",
  //     },
  //     editorType: "dxTagBox",
  //   },
  //   {
  //     dataField: "CustomerType", // Loại khách hàng
  //     caption: t("CustomerType"),
  //     visible: true,
  //     label: {
  //       text: "Loại khách hàng",
  //     },
  //     editorOptions: {
  //       dataSource: listCustomerType?.Data?.Lst_Mst_CustomerType ?? [],
  //       valueExpr: "CustomerType",
  //       displayExpr: "CustomerTypeName",
  //     },
  //     editorType: "dxSelectBox",
  //   },
  //   {
  //     dataField: "CustomerCodeSysERP", // trạng thái
  //     caption: t("CustomerCodeSysERP"),
  //     visible: true,
  //     label: {
  //       text: "Doanh nghiệp",
  //     },
  //     editorOptions: {
  //       dataSource: listCustomerCodeSysERP ?? [],
  //       valueExpr: "CustomerCodeSys",
  //       displayExpr: "CustomerName",
  //     },
  //     editorType: "dxSelectBox",
  //   },
  //   {
  //     dataField: "CreateDTimeUTC", // dealine
  //     caption: t("CreateDTimeUTC"),
  //     visible: true,
  //     label: {
  //       text: "Ngày tạo mới",
  //     },
  //     colSpan: 1,
  //     editorType: "dxDateRangeBox",
  //     editorOptions: {
  //       type: "date",
  //       displayFormat: "yyyy-MM-dd",
  //     },
  //   },
  // ];

  const result = [...searchStaticColumnSearch, ...searchDynamicColumnSearch];

  return result;
};

const CreateDTimeUTCSearch = ({ param }: any) => {
  const { component } = param;

  return (
    <div className="flex items-center gap-2">
      <DateBox
        type="date"
        pickerType="calendar"
        defaultValue={undefined}
        onValueChanged={(e: any) => {
          component?.updateData("CreateDTimeUTCFrom", getDMY(e?.value));
        }}
      ></DateBox>
      <DateBox
        type="date"
        pickerType="calendar"
        defaultValue={undefined}
        onValueChanged={(e: any) => {
          component?.updateData("CreateDTimeUTCTo", getDMY(e?.value));
        }}
      ></DateBox>
    </div>
  );
};
