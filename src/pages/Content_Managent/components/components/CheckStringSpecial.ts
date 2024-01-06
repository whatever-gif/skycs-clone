export const checkCharSpecial = (str: any) => {
  const specialCharPattern = /[!@#$%^&*()_+\-=[\]{};':"\\|,<>/?]/;
  return specialCharPattern.test(str);
};
