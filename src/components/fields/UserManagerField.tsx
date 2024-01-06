import { useClientgateApi } from "@/packages/api";
import { useAuth } from "@/packages/contexts/auth";
import { useQuery } from "@tanstack/react-query";
import { TagBox } from "devextreme-react";
import { useEffect, useState } from "react";

const UserManagerField = ({ param, customOptions }: any) => {
  const { component, formData } = param;

  const api = useClientgateApi();

  const { auth } = useAuth();

  const [value, setValue] = useState<any>([]);

  const { data: agentList } = useQuery(["agentList"], async () => {
    const resp: any = await api.Sys_User_GetAllActive();

    const list =
      resp?.DataList?.map((item: any) => {
        return {
          ...item,
          UserCode: String(item?.UserCode).toUpperCase(),
        };
      }) ?? [];

    return [{ UserCode: "", UserName: "All" }, ...list];
  });

  useEffect(() => {
    if (formData["UserCodeMng"]) {
      setValue(formData["UserCodeMng"]);
    } else {
      const currentMng = String(auth?.currentUser?.Email).toUpperCase();
      setValue([currentMng]);
      component.updateData("UserCodeMng", [currentMng]);
    }
  }, []);

  const handleRenderTags = () => {
    const result =
      agentList
        ?.map((item: any) => {
          if (value?.find((c: any) => c == item?.UserCode)) {
            return item;
          }
        })
        .filter((item: any) => item) ?? [];

    return (
      <div className="flex gap-2 flex-wrap">
        {result?.map((item: any) => {
          return (
            <div className="bg-[#EAF9F2] p-[5px] rounded-[5px] font-semibold">
              {item?.UserName}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {customOptions?.editType == "detail" ? (
        <div className="font-semibold">{handleRenderTags() ?? ""}</div>
      ) : (
        <TagBox
          dataSource={agentList ?? []}
          valueExpr="UserCode"
          displayExpr="UserName"
          onValueChanged={(e: any) => {
            component.updateData("UserCodeMng", e.value);
            setValue(e.value);
          }}
          value={value}
          readOnly={customOptions?.editType == "detail"}
          name="UserCode"
          validationMessagePosition="bottom"
        ></TagBox>
      )}
    </>
  );
};

export default UserManagerField;
