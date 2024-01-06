import { useClientgateApi } from "@/packages/api";
import { getFullTime } from "@/utils/time";
import { useQuery } from "@tanstack/react-query";
import { DateBox } from "devextreme-react";
import { useEffect, useState } from "react";

const CreateDTimeUTCField = ({ param, customOptions }: any) => {
  const { component, formData } = param;

  const api = useClientgateApi();

  const [value, setValue] = useState<any>(undefined);

  const { data: currentTime }: any = useQuery(["currentTime"], async () => {
    const resp: any = await api.Api_GetDTime();

    const crTimeZone = (new Date().getTimezoneOffset() / 60) * -1;

    const data = new Date(resp?.Data?.DTimeServer);

    data.setHours(new Date(resp?.Data?.DTimeServer).getHours() + crTimeZone);

    return data;
  });

  function isValidDate(dateString: string) {
    const date: any = new Date(dateString);

    return !isNaN(date) && date.toISOString() !== "Invalid Date";
  }

  useEffect(() => {
    if (isValidDate(formData["CreateDTimeUTC"])) {
      setValue(formData["CreateDTimeUTC"]);
    } else {
      component.updateData("CreateDTimeUTC", getFullTime(currentTime));
      setValue(getFullTime(currentTime));
    }
  }, [currentTime]);

  return (
    <>
      {customOptions?.editType == "detail" ? (
        <div className="font-semibold">{value ?? "---"}</div>
      ) : (
        <DateBox
          readOnly
          value={new Date(value)}
          type="datetime"
          displayFormat="yyyy-MM-dd HH:mm:ss"
        ></DateBox>
      )}
    </>
  );
};

export default CreateDTimeUTCField;
