import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { SelectBox } from "devextreme-react";

const OrgBox = () => {
  const api = useClientgateApi();

  const { data: nntList }: any = useQuery(
    ["nntList"],
    api.Mst_NNTController_GetAllActive
  );

  return (
    <div className="flex gap-1 items-center">
      <label htmlFor="OrgID">OrgID</label>
      <SelectBox
        dataSource={nntList?.Data?.Lst_Mst_NNT ?? []}
        valueExpr="OrgID"
        displayExpr="NNTFullName"
      />
    </div>
  );
};

export default OrgBox;
