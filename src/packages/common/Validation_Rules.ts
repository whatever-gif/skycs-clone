import { ValidationRule } from "devextreme/common";

const regexLat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
const regexLon = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
const regexNumber =
  /^(?:-(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))|(?:0|(?:[1-9](?:\d{0,2}(?:,\d{3})+|\d*))))(?:.\d+|)$/;
const stringType = /[a-zA-Z0-9]/;
const onlyNumberType = /[0-9]/;
const phoneType = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;
export const specailType = [/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/];
const emailType =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// I need to exclude special characters
const excludeSpecialCharacters = /^[a-zA-Z0-9]+$/;

export const requiredEmailType = {
  type: "pattern",
  pattern: emailType,
};

export const requiredPhoneType = {
  type: "pattern",
  pattern: phoneType,
};

export const requiredSpecialType = {
  type: "pattern",
  parseInt: specailType,
};

export const requiredStringType = {
  type: "pattern",
  pattern: stringType,
};

export const requiredType = {
  type: "required",
} as ValidationRule;

export const RequiredField = (message: string) => {
  return {
    type: "required",
    message,
  };
};

function compareDatesByYearAndMonth(date1: Date, date2: Date) {
  debugger;
  const year1 = date1.getFullYear();
  const month1 = date1.getMonth();

  const year2 = date2.getFullYear();
  const month2 = date2.getMonth();
  const get_day_of_month = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };
  if (year1 <= year2) {
    if (year1 === year2 && month1 <= month2) {
      return true;
    }
    if (year1 < year2) {
      if (month1 >= month2) {
        return true;
      }
    }
  }
  return false;
}

function compareFollowerMonth(
  date1: Date,
  date2: Date,
  monthCondition: number
) {
  const year1 = date1.getFullYear();
  const month1 = date1.getMonth();

  const year2 = date2.getFullYear();
  const month2 = date2.getMonth();

  if (year2 - year1 === 1) {
    const month = (year2 - year1) * 12 + (month2 - month1);
    if (month <= monthCondition - 1) {
      return true;
    }
  }
  if (year1 === year2) {
    if (month1 - month2 === -1 || month1 - month2 === 0) {
      return true;
    }
  }
  return false;
}

export const RequiredDateTimeFollowMonthDate = (
  message: string,
  monthCondition?: number
) => {
  return {
    type: "custom",
    message,
    validationCallback: (e: any) => {
      if (e?.value && e?.value?.[0] && e?.value?.[1]) {
        return compareDatesByYearAndMonth(e.value[0], e.value[1]);
      }
      return false;
    },
  };
};

export const RequiredDateTimeMonth = (
  message: string,
  monthCondition: number
) => {
  return {
    type: "custom",
    message: message,
    validationCallback: (e: any) => {
      if (e?.value && e?.value?.[0] && e?.value?.[1]) {
        return compareFollowerMonth(e.value[0], e.value[1], monthCondition);
      }
      return false;
    },
  };
};

export const RequiredDateTimeFollowMonth = (
  message: string,
  monthCondition?: number
) => {
  return {
    type: "custom",
    message: message,
    validationCallback: (e: any) => {
      if (e?.value && e?.value?.[0] && e?.value?.[1]) {
        return compareDatesByYearAndMonth(e.value[0], e.value[1]);
      }
      return false;
    },
  };
};

export const regexLatType = {
  type: "pattern",
  pattern: regexLat,
};

export const numberType = {
  type: "pattern",
  pattern: regexNumber,
};

export const regexLonType = {
  type: "pattern",
  pattern: regexLon,
};

export const ExcludeSpecialCharactersType = {
  type: "pattern",
  pattern: excludeSpecialCharacters,
};

export const requiredRangeNumber = {
  type: "range",
  min: 0,
  max: 100000000000,
};
export const requiredOnlyNumber = {
  type: "pattern",
  pattern: onlyNumberType,
};
export default {
  requiredStringType,
  requiredType,
  RequiredField,
  regexLatType,
  numberType,
  regexLonType,
  ExcludeSpecialCharactersType,
  requiredRangeNumber,
  requiredOnlyNumber,
};
