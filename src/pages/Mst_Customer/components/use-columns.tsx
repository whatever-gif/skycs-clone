import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useNetworkNavigate } from "@/packages/hooks";
import { LinkCell } from "@/packages/ui/link-cell";
import { StatusButton } from "@/packages/ui/status-button";
import { useQuery } from "@tanstack/react-query";
import { sortBy, uniqBy } from "lodash-es";
import { nanoid } from "nanoid";
import { match } from "ts-pattern";
import CustomTagColumn from "./customize-columns/CustomTagColumn";
import PopoverCustomerContact from "./popover-customer-contact";
interface UseDealerGridColumnsProps {
  data: any[];
  dataField: any;
  dataGroup: any[];
}
export const useColumn = ({
  dataField,
  dataGroup,
}: UseDealerGridColumnsProps) => {
  // const setFlagCustomer = useSetAtom(flagCustomer);
  const navigate = useNetworkNavigate();

  const api = useClientgateApi();

  const { data: agentDataSource } = useQuery(["agentDataSource"], async () => {
    const resp: any = await api.Sys_User_GetAllActive();

    return resp?.DataList ?? [];
  });

  const { data: areaDataSource } = useQuery(["areaDataSource"], async () => {
    const resp: any = await api.Mst_Area_GetAllActive();

    return resp?.DataList ?? [];
  });

  const { data: countryDataSource } = useQuery(
    ["countryDataSource"],
    async () => {
      const resp: any = await api.Mst_Country_GetAllActive();

      return resp?.DataList ?? [];
    }
  );

  const { data: provinceDataSource } = useQuery(
    ["provinceDataSource"],
    async () => {
      const resp: any = await api.Mst_Province_GetAllActive();

      return resp?.DataList ?? [];
    }
  );

  const { data: districtDataSource } = useQuery(
    ["districtDataSource"],
    async () => {
      const resp: any = await api.Mst_District_GetAllActive();

      return resp?.DataList ?? [];
    }
  );

  const { data: wardDataSource } = useQuery(["wardDataSource"], async () => {
    const resp: any = await api.Mst_Ward_GetAllActive();

    return resp?.DataList ?? [];
  });

  const { data: customerDataSource } = useQuery(
    ["customerDataSource"],
    async () => {
      const resp: any = await api.Mst_Customer_GetAllActive();

      return resp?.DataList ?? [];
    }
  );

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

  const listColumn = dataGroup
    .map((item: any) => {
      const listField = dataField?.dataField.filter(
        (itemField: any) => itemField.ColGrpCodeSys === item.ColGrpCodeSys
      );
      return {
        group: item.ColGrpCodeSys,
        list: listField,
      };
    })
    .reduce((acc: any[], item: any) => {
      return [...acc, ...item.list];
    }, []);

  const findContractColumn = listColumn?.find(
    (item: any) => item?.ColCodeSys == "MST"
  );

  const customerContactColumn = {
    ...findContractColumn,
    ColCodeSys: "CustomerNameContact",
    ColCode: "CustomerNameContact",
    ColCaption: "Người liên hệ",
  };

  const getColumnFieldByGroup = [...listColumn, customerContactColumn];

  const { t } = useI18n("Mst_Customer");
  const handleNavigate = (param: any) => {
    navigate(`/customer/detail/${param?.data?.CustomerCodeSys}`);
  };

  const selectType = ["SELECTONERADIO", "SELECTONEDROPDOWN"];

  const defaultVisible = [
    "CustomerCode",
    "CustomerName",
    "C01J",
    "CtmPhoneNo",
    "CtmEmail",
    "CustomerNameContact",
    "C00H",
  ];

  //

  const resultColumn = getColumnFieldByGroup.map((item) => {
    const idx = defaultVisible.findIndex((itemFind) => {
      return itemFind === item.ColCodeSys;
    });

    if (selectType.includes(item.ColDataType)) {
      const dataSouce = JSON.parse(item.mdmc_JsonListOption);
      return {
        dataField: item.ColCodeSys,
        visible: idx !== -1,
        caption: t(`${item.ColCaption}`),
        editorType: "dxSelectBox",
        idx: idx !== -1 ? idx + 1 : 9999,
        editorOption: {
          dataSource: dataSouce,
          valueExpr: "OrderIdx",
          displayExpr: "Value",
        },
      };
    }
    if (item.ColCodeSys === "CustomerCode") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        cellRender: (param: any) => {
          return (
            <LinkCell
              value={param.displayValue}
              onClick={() => handleNavigate(param)}
            ></LinkCell>
          );
        },
      };
    }

    if (item.ColCodeSys === "CustomerNameContact") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        cellRender: (param: any) => {
          // const code =
          const lstContact = JSON.parse(
            param?.data?.CustomerContactJson ?? "[]"
          );

          const result = lstContact[0]?.CustomerCodeSysContact ?? null;

          const handleCustomer = (code: any) => {
            navigate(`/customer/detail/${code}`);
          };

          if (param?.data?.CustomerNameContact?.includes("Nhiều liên hệ")) {
            return <PopoverCustomerContact param={param} />;
          }

          return (
            <div
              className="hover:text-[#00703c] hover:underline cursor-pointer"
              onClick={() => handleCustomer(result)}
            >
              {param?.data?.CustomerNameContact}
            </div>
          );
        },
      };
    }

    if (item.ColCodeSys === "CustomerName") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        width: 200,
      };
    }

    if (item.ColCaption === "Địa chỉ") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        width: 150,
      };
    }

    if (item.ColCaption === "Ghi chú") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        width: 100,
      };
    }

    if (item.ColCaption === "Vùng thị trường") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        width: 100,
        cellRender: ({ data }: any) => {
          const result = areaDataSource?.find(
            (c: any) => c?.AreaCode == String(data[item.ColCodeSys])
          )?.AreaName;

          return result;
        },
      };
    }

    if (item.ColCaption === "Điều khoản bán hàng") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        width: 100,
        cellRender: ({ data }: any) => {
          const result = paymentSaleDataSource?.sale?.find(
            (c: any) => c?.PaymentTermCode == String(data[item.ColCodeSys])
          )?.PaymentTermName;

          return result;
        },
      };
    }

    if (item.ColCaption === "Điều khoản mua hàng") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        width: 100,
        cellRender: ({ data }: any) => {
          const result = paymentSaleDataSource?.purchase?.find(
            (c: any) => c?.PaymentTermCode == String(data[item.ColCodeSys])
          )?.PaymentTermName;

          // return `${result} - ${data[item.ColCodeSys]}`;
          return result;
        },
      };
    }

    if (item.ColCodeSys === "CustomerType") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        width: 100,
        cellRender: ({ data }: any) => {
          return match(data?.CustomerType)
            .with("CANHAN", () => "Cá nhân")
            .with("TOCHUC", () => "Tổ chức")
            .otherwise(() => "");
        },
      };
    }

    if (item.ColCodeSys === "CtmEmail") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        width: 150,
      };
    }

    if (item.ColCodeSys?.includes("Country")) {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        width: 150,
        cellRender: ({ data }: any) => {
          const result = countryDataSource?.find(
            (c: any) => c?.CountryCode == String(data[item.ColCodeSys])
          )?.CountryName;

          return result;
        },
      };
    }

    if (item.ColCodeSys?.includes("Province")) {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        width: 150,
        cellRender: ({ data }: any) => {
          const result = provinceDataSource?.find(
            (c: any) => c?.ProvinceCode == String(data[item.ColCodeSys])
          )?.ProvinceName;

          return result;
        },
      };
    }

    if (item.ColCodeSys?.includes("District")) {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        width: 150,
        cellRender: ({ data }: any) => {
          const result = districtDataSource?.find(
            (c: any) => c?.DistrictCode == String(data[item.ColCodeSys])
          )?.DistrictName;

          return result;
        },
      };
    }

    if (item.ColCodeSys?.includes("Ward")) {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        width: 150,
        cellRender: ({ data }: any) => {
          const result = wardDataSource?.find(
            (c: any) => c?.WardCode == String(data[item.ColCodeSys])
          )?.WardName;

          return result;
        },
      };
    }

    if (item.ColCodeSys === "GovID") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        cellRender: ({ data }: any) => {
          const crList = JSON.parse(data?.CustomerGovIDJson ?? "[]");

          if (!crList || Array(crList).length == 0) {
            return <></>;
          }

          return (
            <div className="flex flex-col gap-1">
              {crList?.map((c: any) => {
                const type = c?.k?.[0]?.GovIDTypeName ?? "";

                return (
                  <div className="flex gap-1">
                    <div>{type}</div>
                    <div>-</div>
                    <div>{c?.GovID}</div>
                  </div>
                );
              })}
            </div>
          );
        },
      };
    }

    if (item.ColCodeSys === "FlagActive") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        cellRender: (param: any) => {
          return (
            <StatusButton
              key={nanoid()}
              isActive={param?.data?.FlagActive == "1"}
            />
          );
        },
      };
    }

    if (item.ColCodeSys === "CreateBy") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        cellRender: ({ data }: any) => {
          const result = agentDataSource?.find(
            (item: any) =>
              item?.UserCode == String(data?.CreateBy).toUpperCase()
          )?.UserName;

          return result;
        },
      };
    }

    if (item.ColCodeSys === "CustomerCodeSysERP") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        cellRender: ({ data }: any) => {
          const result = customerDataSource?.find(
            (item: any) =>
              item?.CustomerCodeSys == String(data?.CustomerCodeSysERP)
          )?.CustomerName;

          return result;
        },
      };
    }

    if (item.ColCodeSys === "UserCodeMng") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        cellRender: (param: any) => {
          const list = JSON.parse(param?.data?.CustomerUserManagerJson ?? "[]");

          return (
            <CustomTagColumn
              list={list}
              display={"UserName"}
              object={"Sys_User"}
            />
          );
        },
      };
    }

    if (item.ColCodeSys === "PartnerType") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        cellRender: (param: any) => {
          const list = JSON.parse(
            param?.data?.CustomerInPartnerTypeJson ?? "[]"
          );

          return (
            <CustomTagColumn
              list={list}
              display={"PartnerTypeName"}
              object={"Mst_PartnerType"}
            />
          );
        },
      };
    }

    if (item.ColCodeSys === "CustomerGrpCode") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        cellRender: (param: any) => {
          const list = JSON.parse(
            param?.data?.CustomerInCustomerGroupJson ?? "[]"
          );

          return (
            <CustomTagColumn
              list={list}
              display={"CustomerGrpName"}
              object={"Mst_CustomerGroup"}
            />
          );
        },
      };
    }

    if (item.ColCodeSys === "CustomerAvatarPath") {
      return {
        dataField: item.ColCodeSys,
        caption: t(`${item.ColCaption}`),
        visible: idx !== -1,
        idx: idx !== -1 ? idx + 1 : 9999,
        editorType: "dxTextBox",
        cellRender: (param: any) => {
          return (
            <div className="w-full flex items-center justify-center">
              <div
                className="overflow-hidden h-[60px] w-[60px] rounded-lg shadow-xl mt-[10px] ml-[10px] cursor-pointer"
                style={{
                  borderRadius: "50%",
                  pointerEvents: "none",
                }}
              >
                <div className="h-full w-full">
                  <img
                    alt=""
                    className="w-full h-full object-cover"
                    src={
                      param.displayValue ??
                      "https://tse2.mm.bing.net/th?id=OIP.udoq18uxDpu6UHi2H__97gAAAA&pid=Api&P=0&h=180"
                    }
                  />
                </div>
              </div>
            </div>
          );
        },
      };
    }

    return {
      dataField: item.ColCodeSys,
      visible: idx !== -1,
      idx: idx !== -1 ? idx + 1 : 9999,
      caption: t(`${item.ColCaption}`),
      editorType: "dxTextBox",
    };
  });
  // .filter((item) => item.visible);

  const uniqueColumn = sortBy(uniqBy(resultColumn, "dataField"), "idx").map(
    (item) => {
      return {
        ...item,
        allowSearch: true,
      };
    }
  );

  const result = [
    {
      dataField: "STT",
      caption: t("Idx"),
      cellRender: (data: any) => {
        return <>{data.rowIndex + 1}</>;
      },
    },
    ...uniqueColumn,
  ];

  return result;
};
