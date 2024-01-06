interface Props {
  objJSON: any;
  dataDynamic: any[];
}

export const convertData = ({ objJSON, dataDynamic }: Props) => {
  const convertToArray = Object.keys(objJSON).map((key) => {
    return {
      [`${key}`]: objJSON[key],
    };
  });

  const getValue = convertToArray.map((item) => {
    if (item?.CtmPhoneNo) {
      return {
        ...item,
        caption: "CtmPhoneNo",
        value: item?.CtmPhoneNo.reduce(
          (acc: any, itemReduce: any, index: number) => {
            if (index === item?.CtmPhoneNo.length - 1) {
              return acc + itemReduce.CtmPhoneNo;
            }

            return acc + itemReduce.CtmPhoneNo + ",";
          },
          ""
        ),
      };
    }

    if (item?.ZaloUserFollowerId) {
      return {
        ...item,
        caption: "ZaloUserFollowerId",
        // value: item?.ZaloUserFollowerId.reduce((acc, item) => {
        //   return acc + item.ZaloUserFollowerId + ",";
        // }, ""),
        value: item?.ZaloUserFollowerId.reduce(
          (acc: any, itemReduce: any, index: number) => {
            if (index === item?.ZaloUserFollowerId.length - 1) {
              return acc + itemReduce.ZaloUserFollowerId;
            }
            return acc + itemReduce.ZaloUserFollowerId + ", ";
          },
          ""
        ),
      };
    }

    if (item?.CtmEmail) {
      return {
        ...item,
        caption: "CtmEmail",
        // value: item?.CtmEmail.reduce((acc, item, index: number) => {
        //   return acc + item.CtmEmail + ",";
        // }, ""),
        value: item?.CtmEmail.reduce(
          (acc: any, itemReduce: any, index: number) => {
            if (index === item?.CtmEmail.length - 1) {
              return acc + itemReduce.CtmEmail;
            }

            return acc + itemReduce.CtmEmail + ", ";
          },
          ""
        ),
      };
    }

    // const array = dataDynamic ?? [];
    const check = dataDynamic.find(
      (itemData) => itemData?.TicketColCfgCodeSys === Object.keys(item)[0]
    );

    if (check) {
      if (check.TicketColCfgDataType === "FILE") {
        const result = {
          ...check,
          caption: check.TicketColCfgName,
          value: item[Object.keys(item)[0]],
          type: check.TicketColCfgDataType,
        };
        return result;
      }

      if (check.TicketColCfgDataType === "CUSTOMERGROUP") {
      }

      if (
        check.TicketColCfgDataType === "MASTERDATA" ||
        check.TicketColCfgDataType === "MASTERDATASELECTMULTIPLE"
      ) {
        let dataSource = check.dataSource ?? [];
        const result = {
          ...check,
          type: check.TicketColCfgDataType,
          caption: check.TicketColCfgName,
          value: dataSource
            .filter((itemData: any) => {
              return itemData.Key === Object.values(item)[0];
            })
            .map((item) => item.Value)
            .join(", "),
        };

        return result;
      }
      if (check.TicketColCfgDataType === "SELECTONEDROPDOWN") {
        const parseJSON = JSON.parse(check.JsonListOption);

        return {
          ...check,
          caption: check.TicketColCfgName,
          // value:  parseJSON.filter((itemData) => {
          //   return itemData.Value === Object.values(item)[0];
          // }),
          value: Object.values(item)[0],
        };
      }
      if (
        check.TicketColCfgDataType === "SELECTMULTIPLEDROPDOWN" ||
        check.TicketColCfgDataType === "SELECTMULTIPLESELECTBOX"
      ) {
        return {
          ...check,
          type: check.TicketColCfgDataType,
          caption: check.TicketColCfgName,
          value: Object.values(item)[0].join(",").length
            ? Object.values(item)[0].join(",")
            : "--------------",
        };
      }
      return {
        ...check,
        type: check.TicketColCfgDataType,
        caption: check.TicketColCfgName,
        value: Object.values(item)[0],
      };
    } else {
      if (Array.isArray(Object.values(item)[0])) {
        return {
          caption: Object.keys(item)[0],
          value: Object.values(item)[0].join(", "),
        };
      }

      return {
        caption: Object.keys(item)[0],
        value: Object.values(item)[0],
      };
    }
  });

  return getValue;
};
