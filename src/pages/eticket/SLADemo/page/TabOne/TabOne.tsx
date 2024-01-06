import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { TagBoxField } from "@/pages/admin/custom-field/components/tagbox-field";
import { useQuery } from "@tanstack/react-query";
import { forwardRef } from "react";
import { Controller } from "react-hook-form";
import { useParams } from "react-router-dom";

const TabOne = forwardRef(({ control }: any, ref: any) => {
  const { t } = useI18n("SLA_Form");

  const { type } = useParams();

  const api = useClientgateApi();

  const { data: listType } = useQuery(["listType"], async () => {
    const resp = await api.Mst_TicketEstablishInfoApi_GetAllInfo();

    const result = {
      ...resp?.Data,
      Lst_Mst_TicketCustomType:
        resp?.Data?.Lst_Mst_TicketCustomType?.filter(
          (item: any) => item.FlagActive == "1"
        ) ?? [],
      Lst_Mst_TicketType:
        resp?.Data?.Lst_Mst_TicketType?.filter(
          (item: any) => item.FlagActive == "1"
        ) ?? [],
    };

    return result;
  });

  const { data: listCustomerCN } = useQuery(["listCustomerCN"], async () => {
    const resp: any = await api.Mst_Customer_Search({
      FlagActive: 1,
      Ft_PageIndex: 0,
      Ft_PageSize: 1000,
      CustomerType: "CANHAN",
    });

    return resp?.DataList ?? [];
  });

  const { data: listCustomerDN } = useQuery(["listCustomerDN"], async () => {
    const resp: any = await api.Mst_Customer_Search({
      FlagActive: 1,
      Ft_PageIndex: 0,
      Ft_PageSize: 1000,
      CustomerType: "TOCHUC",
    });

    return resp?.DataList ?? [];
  });

  const { data: listCustomerGroup } = useQuery(
    ["listCustomerGroup"],
    api?.Mst_CustomerGroup_GetAllActive
  );

  return (
    <>
      <div className="p-2 flex flex-col gap-2">
        <div className="flex flex-col shadow-md border-[1px] rounded-[10px] p-2 hover:shadow-zinc-500 shadow-zinc-400">
          <Controller
            name={"TicketType"}
            control={control}
            render={({ field }) => {
              return (
                <TagBoxField
                  field={field}
                  label={t("TicketType")}
                  dataSource={listType?.Lst_Mst_TicketType ?? []}
                  displayExpr={"CustomerTicketTypeName"}
                  valueExpr={"TicketType"}
                  showClearButton={true}
                  readonly={type == "detail"}
                />
              );
            }}
          />
          <Controller
            name={"TicketCustomType"}
            control={control}
            render={({ field }) => {
              return (
                <TagBoxField
                  field={field}
                  label={t("TicketCustomType")}
                  dataSource={listType?.Lst_Mst_TicketCustomType ?? []}
                  displayExpr={"CustomerTicketCustomTypeName"}
                  valueExpr={"TicketCustomType"}
                  showClearButton={true}
                  readonly={type == "detail"}
                />
              );
            }}
          />
        </div>
        <div className="flex flex-col shadow-md border-[1px] rounded-[10px] p-2 hover:shadow-zinc-500 shadow-zinc-400">
          <div className="border-b-[1px] border-[#dfdfdf] text-[16px] font-semibold ">
            Cá nhân
          </div>
          <Controller
            name={"Customer"}
            control={control}
            render={({ field }) => {
              return (
                <TagBoxField
                  field={field}
                  label={t("Customer")}
                  dataSource={listCustomerCN ?? []}
                  displayExpr={"CustomerName"}
                  valueExpr={"CustomerCodeSys"}
                  showClearButton={true}
                  readonly={type == "detail"}
                />
              );
            }}
          />
          <Controller
            name={"CustomerGroup"}
            control={control}
            render={({ field }) => {
              return (
                <TagBoxField
                  field={field}
                  label={t("CustomerGroup")}
                  dataSource={listCustomerGroup?.DataList ?? []}
                  displayExpr={"CustomerGrpName"}
                  valueExpr={"CustomerGrpCode"}
                  showClearButton={true}
                  readonly={type == "detail"}
                />
              );
            }}
          />
        </div>
        <div className="flex flex-col shadow-md border-[1px] rounded-[10px] p-2 hover:shadow-zinc-500 shadow-zinc-400">
          <div className="border-b-[1px] border-[#dfdfdf] text-[16px] font-semibold ">
            Doanh nghiệp
          </div>
          <Controller
            name={"CustomerEnterprise"}
            control={control}
            render={({ field }) => {
              return (
                <TagBoxField
                  field={field}
                  label={t("CustomerEnterprise")}
                  dataSource={listCustomerDN ?? []}
                  displayExpr={"CustomerName"}
                  valueExpr={"CustomerCodeSys"}
                  showClearButton={true}
                  readonly={type == "detail"}
                />
              );
            }}
          />
          <Controller
            name={"CustomerEnterpriseGroup"}
            control={control}
            render={({ field }) => {
              return (
                <TagBoxField
                  field={field}
                  label={t("CustomerEnterpriseGroup")}
                  dataSource={listCustomerGroup?.DataList ?? []}
                  displayExpr={"CustomerGrpName"}
                  valueExpr={"CustomerGrpCode"}
                  showClearButton={true}
                  readonly={type == "detail"}
                />
              );
            }}
          />
        </div>
      </div>
    </>
  );
});

export default TabOne;
