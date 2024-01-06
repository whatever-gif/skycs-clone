export const handleSort = (arr: any) => {
  const spiltList = arr.reduce((prev: any, current: any) => {
    const group = prev.find(
      (item: any) => item[0].ColGrpCodeSys === current.ColGrpCodeSys
    );

    if (group) {
      group.push(current);
    } else {
      prev.push([current]);
    }

    return prev;
  }, []);

  const sortedIdx = spiltList
    .map((item: any) => {
      return item
        .sort((a: any, b: any) => {
          const compareColGrp = a.ColGrpCodeSys.localeCompare(b.ColGrpCodeSys);

          if (compareColGrp === 0) {
            return a.OrderIdx - b.OrderIdx;
          }

          return compareColGrp;
        })
        .map((item: any, idx: any) => {
          return {
            ...item,
            OrderIdx: idx + 1,
          };
        });
    })
    .flat();

  return sortedIdx ?? [];
};

export const findMaxIdx = (arr: any, ColGrpCodeSys: any) => {
  const result = Math.max(
    ...arr
      ?.filter((item: any) => item.ColGrpCodeSys == ColGrpCodeSys)
      .map((item: any) => item.OrderIdx)
  );

  return result == Infinity || result == -Infinity ? 0 : result;
};
