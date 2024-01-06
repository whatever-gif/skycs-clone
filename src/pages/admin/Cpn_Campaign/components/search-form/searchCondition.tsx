import { useCallback, useRef } from "react";

import { useI18n } from "@/i18n/useI18n";
import { useAtomValue, useSetAtom } from "jotai";

import { useClientgateApi } from "@/packages/api";
import { showErrorAtom } from "@/packages/store";
import { mapEditorOption, mapEditorType } from "@/utils/customer-common";
import { useQuery } from "@tanstack/react-query";
import DataSource from "devextreme/data/data_source";
import { uniqBy } from "lodash-es";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import {
  countryFieldAtom,
  dateFieldAtom,
  districtFieldAtom,
  provinceFieldAtom,
  selectFieldAtom,
  tagFieldAtom,
  wardFieldAtom,
} from "../store";
import { SearchPaneCustomize } from "./search-panel-customize";
// import {
//   countryFieldAtom,
//   dateFieldAtom,
//   districtFieldAtom,
//   provinceFieldAtom,
//   selectFieldAtom,
//   tagFieldAtom,
//   wardFieldAtom,
// } from "@/pages/Mst_Customer/components/store";

interface Props {
  onSearch: (data: any) => void;
  formData: any;
  listColumn: any;
}

const SearchCondition = ({ onSearch, formData, listColumn }: Props) => {
  const formRef: any = useRef(null);
  const { t } = useI18n("Mst_CustomerSearch");
  const dateField = useAtomValue(dateFieldAtom);
  const countryField = useAtomValue(countryFieldAtom);
  const provinceField = useAtomValue(provinceFieldAtom);
  const districtField = useAtomValue(districtFieldAtom);
  const wardField = useAtomValue(wardFieldAtom);
  const tagField = useAtomValue(tagFieldAtom);
  const selectField = useAtomValue(selectFieldAtom);
  const api = useClientgateApi();
  const showError = useSetAtom(showErrorAtom);

  let dynamicFieldAll: any[] = [];

  // province
  const getListProvinceFollowCountryContact = new DataSource({
    load: async (loadOptions: any) => {
      // Loading data objects
      const formValue = formRef.current.instance.option("formData");
      if (formValue.CountryCodeContact) {
        const response = await api.Mst_Province_GetByCountryCode({
          CountryCode: formValue.CountryCodeContact,
        });
        if (response.isSuccess) {
          return response.Data ?? [];
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
      } else {
        toast.error(t("Please Input CountryCodeContact"));
        return [];
      }
    },
    loadMode: "raw",
  });

  const getListProvinceFollowCountryInvoice = new DataSource({
    load: async (loadOptions: any) => {
      // Loading data objects
      const formValue = formRef.current.instance.option("formData");
      if (formValue.CountryCodeInvoice) {
        const response = await api.Mst_Province_GetByCountryCode({
          CountryCode: formValue.CountryCodeInvoice,
        });
        if (response.isSuccess) {
          return response.Data ?? [];
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
      } else {
        toast.error(t("Please Input CountryCodeInvoice"));
        return [];
      }
    },
    loadMode: "raw",
  });

  const getListProvinceFollowCountryDelivery = new DataSource({
    load: async (loadOptions: any) => {
      // Loading data objects
      const formValue = formRef.current.instance.option("formData");
      if (formValue.CountryCodeDelivery) {
        const response = await api.Mst_Province_GetByCountryCode({
          CountryCode: formValue.CountryCodeDelivery,
        });
        if (response.isSuccess) {
          return response.Data ?? [];
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
      } else {
        toast.error(t("Please Input CountryCodeDelivery"));
        return [];
      }
    },
    loadMode: "raw",
  });

  // district
  const getListDistrictFollowProvinceContact = new DataSource({
    load: async (loadOptions: any) => {
      // Loading data objects
      const formValue = formRef.current.instance.option("formData");
      if (formValue.ProvinceCodeContact) {
        const response = await api.Mst_District_GetByProvinceCode({
          ProvinceCode: formValue.ProvinceCodeContact,
        });
        if (response.isSuccess) {
          return response.Data ?? [];
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
      } else {
        toast.error(t("Please Input ProvinceCodeContact"));
        return [];
      }
    },
    loadMode: "raw",
  });

  const getListDistrictFollowProvinceInvoice = new DataSource({
    load: async (loadOptions: any) => {
      // Loading data objects
      const formValue = formRef.current.instance.option("formData");
      if (formValue.ProvinceCodeInvoice) {
        const response = await api.Mst_District_GetByProvinceCode({
          ProvinceCode: formValue.ProvinceCodeInvoice,
        });
        if (response.isSuccess) {
          return response.Data ?? [];
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
      } else {
        toast.error(t("Please Input ProvinceCodeInvoice"));
        return [];
      }
    },
    loadMode: "raw",
  });

  const getListDistrictFollowProvinceDelivery = new DataSource({
    load: async (loadOptions: any) => {
      // Loading data objects
      const formValue = formRef.current.instance.option("formData");
      if (formValue.ProvinceCodeDelivery) {
        const response = await api.Mst_District_GetByProvinceCode({
          ProvinceCode: formValue.ProvinceCodeDelivery,
        });
        if (response.isSuccess) {
          return response.Data ?? [];
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
      } else {
        toast.error(t("Please Input ProvinceCodeDelivery"));
        return [];
      }
    },
    loadMode: "raw",
  });

  // ward
  const getLisWardFollowDistrictContact = new DataSource({
    load: async (loadOptions: any) => {
      // Loading data objects
      const formValue = formRef.current.instance.option("formData");
      if (formValue.ProvinceCodeContact && formValue.DistrictCodeContact) {
        const response = await api.Mst_Ward_GetByProvinceCode({
          ProvinceCode: formValue.ProvinceCodeContact,
          DistrictCode: formValue.DistrictCodeContact,
        });
        if (response.isSuccess) {
          return response.Data ?? [];
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
      } else {
        toast.error(
          t("Please Input ProvinceCodeContact And Input DistrictCodeContact")
        );
        return [];
      }
    },
    loadMode: "raw",
  });

  const getLisWardFollowDistrictInvoice = new DataSource({
    load: async (loadOptions: any) => {
      // Loading data objects
      const formValue = formRef.current.instance.option("formData");
      if (formValue.ProvinceCodeInvoice) {
        const response = await api.Mst_Ward_GetByProvinceCode({
          ProvinceCode: formValue.ProvinceCodeInvoice,
          DistrictCode: formValue.DistrictCodeInvoice,
        });
        if (response.isSuccess) {
          return response.Data ?? [];
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
      } else {
        toast.error(
          t("Please Input ProvinceCodeInvoice And Input DistrictCodeInvoice")
        );
        return [];
      }
    },
    loadMode: "raw",
  });

  const getListWardFollowDistrictDelivery = new DataSource({
    load: async (loadOptions: any) => {
      // Loading data objects
      const formValue = formRef.current.instance.option("formData");
      if (formValue.ProvinceCodeDelivery) {
        const response = await api.Mst_Ward_GetByProvinceCode({
          ProvinceCode: formValue.ProvinceCodeDelivery,
          DistrictCode: formValue.DistrictCodeDelivery,
        });
        if (response.isSuccess) {
          return response.Data ?? [];
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
      } else {
        toast.error(
          t("Please Input ProvinceCodeDelivery And Input DistrictCodeDelivery")
        );
        return [];
      }
    },
    loadMode: "raw",
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
    return match(colCodeSys)
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
      .with("C0RR", () => {
        // Nguồn khách
        return 7;
      })
      .with("PartnerType", () => {
        // Đối tượng
        return 8;
      })
      .with("C048", () => {
        // Công ty ( mst org )
        return 9;
      })
      .with("CreateDTimeUTC", () => {
        // Thời gian tạo
        return 10;
      })
      .otherwise(() => {
        return 99999999999;
      });
  };

  const checkVisible = (colCodeSys: string) => {
    return [
      "CustomerCode",
      "CustomerName",
      "MST",
      "CtmEmail",
      "CtmPhoneNo",
      "CustomerGrpCode",
      "CustomerType",
      "C048",
      "C0RR",
      "PartnerType",
      "CreateDTimeUTC",
    ].includes(colCodeSys);
  };

  const searchStaticColumnSearch = staticField.map((item: any) => {
    const columnField = {
      dataField: item.ColCodeSys,
      visible: true,
      caption: item.ColCaption,
      colSpan: 2,
      label: {
        text: item.ColCaption,
      },
      editorOptions: {
        showClearButton: true,
      },
    };
    if (countryField.includes(item.ColCodeSys)) {
      let column = {
        ...columnField,
        editorOptions: {
          dataSource: listCountry?.DataList ?? [],
          valueExpr: "CountryCode",
          displayExpr: "CountryName",
          showClearButton: true,
        },
        editorType: "dxSelectBox",
      };

      if (item.ColCodeSys === "CountryCodeDelivery") {
        return {
          ...column,
          editorOptions: {
            ...column.editorOptions,
            onValueChanged: (e: any) => {
              getListProvinceFollowCountryDelivery.reload();
            },
          },
        };
      }
      if (item.ColCodeSys === "CountryCodeContact") {
        return {
          ...column,
          editorOptions: {
            ...column.editorOptions,
            onValueChanged: (e: any) => {
              getListProvinceFollowCountryContact.reload();
            },
          },
        };
      }
      if (item.ColCodeSys === "CountryCodeInvoice") {
        return {
          ...column,
          editorOptions: {
            ...column.editorOptions,
            onValueChanged: (e: any) => {
              getListProvinceFollowCountryInvoice.reload();
            },
          },
        };
      }
    }
    if (provinceField.includes(item.ColCodeSys)) {
      let column = {
        ...columnField,
        editorOptions: {
          dataSource: [],
          valueExpr: "ProvinceCode",
          displayExpr: "ProvinceName",
          showClearButton: true,
        },
        editorType: "dxSelectBox",
      };
      //done
      if (item.ColCodeSys === "ProvinceCodeContact") {
        return {
          ...column,
          editorOptions: {
            ...column.editorOptions,
            dataSource: getListProvinceFollowCountryContact,
            onValueChanged: (e: any) => {
              getListDistrictFollowProvinceContact.reload();
            },
          },
        };
      }
      // done
      if (item.ColCodeSys === "ProvinceCodeDelivery") {
        return {
          ...column,
          editorOptions: {
            ...column.editorOptions,
            dataSource: getListProvinceFollowCountryDelivery,
            onValueChanged: (e: any) => {
              getListDistrictFollowProvinceDelivery.reload();
            },
          },
        };
      }
      // done
      if (item.ColCodeSys === "ProvinceCodeInvoice") {
        return {
          ...column,
          editorOptions: {
            ...column.editorOptions,
            dataSource: getListProvinceFollowCountryInvoice,
            onValueChanged: (e: any) => {
              getListDistrictFollowProvinceInvoice.reload();
            },
          },
        };
      }
    }
    if (districtField.includes(item.ColCodeSys)) {
      let column = {
        ...columnField,
        editorOptions: {
          dataSource: [],
          valueExpr: "DistrictCode",
          displayExpr: "DistrictName",
          showClearButton: true,
        },
        editorType: "dxSelectBox",
      };

      if (item.ColCodeSys === "DistrictCodeContact") {
        return {
          ...column,
          editorOptions: {
            ...column.editorOptions,
            dataSource: getListDistrictFollowProvinceContact,
            onValueChanged: (e: any) => {
              getLisWardFollowDistrictContact.reload();
            },
          },
        };
      }
      if (item.ColCodeSys === "DistrictCodeInvoice") {
        return {
          ...column,
          editorOptions: {
            ...column.editorOptions,
            dataSource: getListDistrictFollowProvinceInvoice,
            onValueChanged: (e: any) => {
              getLisWardFollowDistrictInvoice.reload();
            },
          },
        };
      }
      if (item.ColCodeSys === "DistrictCodeDelivery") {
        return {
          ...column,
          editorOptions: {
            ...column.editorOptions,
            dataSource: getListDistrictFollowProvinceDelivery,

            onValueChanged: (e: any) => {
              getListWardFollowDistrictDelivery.reload();
            },
          },
        };
      }
    }
    if (wardField.includes(item.ColCodeSys)) {
      let column = {
        ...columnField,
        editorOptions: {
          dataSource: [],
          valueExpr: "WardCode",
          displayExpr: "WardName",
          showClearButton: true,
        },
        editorType: "dxSelectBox",
      };

      if (item.ColCodeSys === "WardCodeDelivery") {
        return {
          ...column,
          editorOptions: {
            ...column.editorOptions,
            dataSource: getListWardFollowDistrictDelivery,
          },
        };
      }
      if (item.ColCodeSys === "WardCodeInvoice") {
        return {
          ...column,
          editorOptions: {
            ...column.editorOptions,
            dataSource: getLisWardFollowDistrictInvoice,
          },
        };
      }
      if (item.ColCodeSys === "WardCodeContact") {
        return {
          ...column,
          editorOptions: {
            ...column.editorOptions,
            dataSource: getLisWardFollowDistrictContact,
          },
        };
      }
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
    if (item.ColCodeSys === "CustomerType") {
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
      },
    };

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
    [...searchStaticColumnSearch, ...dynamicFieldAll].map((item) => {
      return {
        ...item,
        idx: mapIdx(item.dataField),
        visible: !!checkVisible(item.dataField),
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

  const customizeItem = useCallback(
    (e: any) => {
      if (e.dataField === "CountryCodeContact") {
        e.editorOptions.dataSource = listCountry?.DataList ?? []; // done
        e.editorOptions.onValueChanged = (e: any) => {
          getListProvinceFollowCountryContact.reload();
        };
      }
      if (e.dataField === "CountryCodeDelivery") {
        e.editorOptions.dataSource = listCountry?.DataList ?? []; // done
        e.editorOptions.onValueChanged = (e: any) => {
          getListProvinceFollowCountryDelivery.reload();
        };
      }
      if (e.dataField === "CountryCodeInvoice") {
        e.editorOptions.dataSource = listCountry?.DataList ?? []; // done
        e.editorOptions.onValueChanged = (e: any) => {
          getListProvinceFollowCountryInvoice.reload();
        };
      }
      if (e.dataField === "ProvinceCodeContact") {
        e.editorOptions.dataSource = getListProvinceFollowCountryContact; // done
      }
      if (e.dataField === "ProvinceCodeDelivery") {
        e.editorOptions.dataSource = getListProvinceFollowCountryDelivery; // done
      }
      if (e.dataField === "ProvinceCodeInvoice") {
        e.editorOptions.dataSource = getListProvinceFollowCountryInvoice; // done
      }
      if (e.dataField === "DistrictCodeContact") {
        e.editorOptions.dataSource = getListDistrictFollowProvinceContact; // done
      }
      if (e.dataField === "DistrictCodeInvoice") {
        e.editorOptions.dataSource = getListDistrictFollowProvinceInvoice; // done
      }
      if (e.dataField === "DistrictCodeDelivery") {
        e.editorOptions.dataSource = getListDistrictFollowProvinceDelivery; // done
      }
      if (e.dataField === "WardCodeContact") {
        e.editorOptions.dataSource = getLisWardFollowDistrictContact; // done
      }
      if (e.dataField === "WardCodeInvoice") {
        e.editorOptions.dataSource = getLisWardFollowDistrictInvoice; // done
      }
      if (e.dataField === "WardCodeDelivery") {
        e.editorOptions.dataSource = getListWardFollowDistrictDelivery; // done
      }
    },
    [listCountry]
  );

  return (
    <SearchPaneCustomize
      ref={formRef}
      colCount={2}
      conditionFields={listField}
      storeKey="Mst_Customer_Panel_Search"
      data={formData}
      onSearch={onSearch}
      customizeItem={customizeItem}
    />
  );
};

export default SearchCondition;
