export const transformCategory = (category: any) => {
  return category?.map((item: any) => {
    const newItem = { ...item };
    const children = newItem.Lst_KB_CategoryChildren;
    delete newItem.Lst_KB_CategoryChildren;
    if (children && children.length > 0) {
      newItem.items = transformCategory(children);
    } else {
      newItem.items = [];
    }

    return newItem;
  });
};
export const formatText = (Detail: any, maxText: any) => {
  const regex = /<[^>]+>/g;
  const textWithoutTags = Detail?.replace(regex, "");
  const maxLength = maxText;
  const outText =
    textWithoutTags?.length <= maxLength
      ? textWithoutTags
      : `${textWithoutTags.slice(0, maxLength)} ...`;
  return outText;
};
export const extractCategoryCode = (data: any) => {
  let result: any = [];

  const getCategories = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i]?.selected === true) {
        result.push({
          CategoryCode: data[i]?.CategoryCode,
        });
      }
      if (data[i].Lst_KB_CategoryChildren?.length > 0) {
        getCategories(data[i]?.Lst_KB_CategoryChildren);
      }
    }
  };
  for (const category of data) {
    getCategories([category]);
  }

  return result;
};
