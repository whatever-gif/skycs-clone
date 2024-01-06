export const getCategories = (categoryArray: any, level = 1) => {
  return categoryArray?.map((category: any) => {
    const newCategory = {
      ...category,
      level,
      hasChildren: category?.Lst_KB_CategoryChildren?.length > 0,
    };
    delete newCategory.Lst_KB_CategoryChildren;
    if (newCategory.hasChildren) {
      newCategory.children = getCategories(
        category?.Lst_KB_CategoryChildren,
        level + 1
      );
    }
    return newCategory;
  });
};

export const flattenCategories = (categories: any, result = []) => {
  if (categories) {
    for (const category of categories) {
      const { children, ...rest } = category;
      result.push(rest);
      if (children && children.length > 0) {
        flattenCategories(children, result);
      }
    }
  }

  return result;
};

export const flattenCategorieV2 = (categories: any, parentCode = null) => {
  let flattenedCategories = [];
  if (categories) {
    for (const category of categories) {
      const flatCategory = {
        ...category,
        parentCode: parentCode,
      };

      flattenedCategories?.push(flatCategory);

      if (
        category.Lst_KB_CategoryChildren &&
        category.Lst_KB_CategoryChildren.length > 0
      ) {
        flattenedCategories = flattenedCategories.concat(
          flattenCategorieV2(
            category.Lst_KB_CategoryChildren,
            category.CategoryCode
          )
        );
      }
    }
  }

  return flattenedCategories;
};
