export const FileType =
  "docx" ||
  "doc" ||
  "xls" ||
  "xlsx" ||
  "ppt" ||
  "pptx" ||
  "txt" ||
  "pdf" ||
  "png" ||
  "jpg" ||
  "gif" ||
  "rar" ||
  "zip" ||
  "7Z";

export const checkNumberWith = (number: number, compare: number) => {
  if (number < compare) {
    return `0${number}`;
  } else {
    return number.toString();
  }
};

export const sortByKey = (array: any[], key: string) => {
  return array.sort((a, b) => (a[key] > b[key] ? 1 : -1));
};

export const getYearMonthDate = (date: Date) => {
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();
  const result = `${year}-${checkNumberWith(month, 10)}-${checkNumberWith(
    day,
    10
  )}`;
  return result;
};
export const getYearMonth = (date: Date) => {
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();
  const result = `${year}-${checkNumberWith(month, 10)}`;
  return result;
};

export const distinguish = (a: any) => {
  const getType = a.constructor;
  if (getType === Date) {
    return getYearMonthDate(a);
  } else return a;
};

export const array_move = (
  arr: any[],
  old_index: number,
  new_index: number
) => {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
};

export const encodeFileType = (
  fileType:
    | "docx"
    | "doc"
    | "xls"
    | "xlsx"
    | "ppt"
    | "pptx"
    | "txt"
    | "pdf"
    | "png"
    | "jpg"
    | "gif"
    | "rar"
    | "zip"
    | "7Z"
) => {
  const obj = {
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    txt: "text/plain",
    pdf: "application/pdf",
    png: "image/x-png",
    jpg: "image/x-citrix-jpeg",
    gif: "image/gif",
    rar: "application/x-rar-compressed",
    zip: "application/zip",
    "7Z": "application/x-7z-compressed",
  };
  return obj[fileType] ?? "";
};

export const revertEncodeFileType = (
  FileType:
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    | "application/msword"
    | "application/vnd.ms-excel"
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    | "application/vnd.ms-powerpoint"
    | "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    | "text/plain"
    | "application/pdf"
    | "image/x-png"
    | "image/x-citrix-jpeg"
    | "image/gif"
    | "application/x-rar-compressed"
    | "application/zip"
    | "application/x-7z-compressed"
    | "image/png"
    | "image/jpeg"
    | "image/jpg"
) => {
  const obj = {
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/msword": "doc",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "pptx",
    "text/plain": "txt",
    "application/pdf": "pdf",
    "image/x-png": "png",
    "image/x-citrix-jpeg": "jpg",
    "image/gif": "gif",
    "application/x-rar-compressed": "rar",
    "application/zip": "zip",
    "application/x-7z-compressed": "7Z",
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
  };
  return obj[FileType] ?? "";
};

export const getDateNow = () => {
  return Date.now();
};

export const compareDates = (d1: any, d2: any) => {
  let date1 = new Date(d1).getTime();
  let date2 = new Date(d2).getTime();
  if (date1 < date2) {
    return false;
  } else if (date1 >= date2) {
    return true;
  }
};

export const splitString = (chuoi: string, soluongkytu: number) => {
  let chuoiSub = "";
  if (
    chuoi !== undefined &&
    chuoi !== null &&
    chuoi.toString().trim().length > 0
  ) {
    chuoi = chuoi.toString().trim();
    if (chuoi.length <= soluongkytu) {
      chuoiSub = chuoi;
    } else {
      const indexOf = chuoi.lastIndexOf(" ", soluongkytu);
      if (indexOf > 0) {
        chuoiSub = chuoi.substring(0, indexOf).trim() + "...";
      } else {
        chuoiSub = chuoi.substring(0, soluongkytu).trim() + "...";
      }
    }
  }
  return chuoiSub;
};
const isNullOrEmpty = function (_value: any) {
  if (
    _value !== undefined &&
    _value !== null &&
    _value.toString().trim().length > 0
  ) {
    return false;
  }
  return true;
};

export const returnValue = function (_data: any) {
  var value = "";
  if (!isNullOrEmpty(_data)) {
    value = _data.toString().trim();
  }
  return value;
};

export const sNumber = (number: number) => {
  // commonUtils.isNumber('a') => true; (không là số)
  // commonUtils.isNumber(1.5.5) => true; (không là số)
  // commonUtils.isNumber(1,5) => true; (không là số) (dấu '.' mới hợp lệ (là phần phân cách thập phân))
  // commonUtils.isNumber(1111.555) => false; (là số)
  var check = false;
  if (!isNullOrEmpty(number)) {
    if (!isNaN(number)) {
      check = true; // là số
    }
  }
  return check;
  //return /^-?[\d.]+(?:e-?\d+)?$/.test(number);
};

export const checkElementUndefinedOrNull = (element: any) => {
  if (element !== undefined && element !== null) {
    return false;
  }
  return true;
};

export const checkDate = (date: any) => {
  if (isNullOrEmpty(date)) {
    return false;
  }
  var _date = new Date(date);
  var check = _date instanceof Date;
  return check;
};

export const locDau = (thiz: string) => {
  // using : onkeyup="commonUtils.locDau(this);"
  var str;
  if (eval(thiz)) {
    str = eval(thiz).value;
  } else {
    str = thiz;
  }

  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ |ặ|ẳ|ẵ/g, "a");

  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ |Ặ|Ẳ|Ẵ/g, "A");

  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");

  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");

  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");

  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");

  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ |ợ|ở|ỡ/g, "o");

  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ |Ợ|Ở|Ỡ/g, "O");

  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");

  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");

  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");

  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");

  str = str.replace(/đ/g, "d");

  str = str.replace(/Đ/g, "D");

  //str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\\|\||\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-");
  //str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\\|\||\<|\>|\?|\/|,|\:|\;|\'| |\"|\&|\#|\$|\`|\[|\]|~|$|_/g, "-"); // cho phép nhập dấu ., các ký tự ko cho phép -> -
  //str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\\|\||\<|\>|\?|\/|,|\:|\;|\'| |\"|\&|\#|\$|\`|\[|\]|~|$|/g, ""); // cho phép nhập dấu ., các ký tự ko cho phép -> -
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\\|\||\<|\>|\?|,|\:|\;|\'| |\"|\&|\#|\$|\`|\[|\]|~|$|/g,
    ""
  ); // cho phép nhập dấu ., các ký tự ko cho phép -> -
  /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */

  str = str.replace(/-+-/g, "-"); //thay thế 2- thành 1-
  str = str.replace(/_+_/g, "_"); //thay thế 2 _ thành 1 _
  str = str.replace(/\.+\./g, "."); //thay thế 2 . thành 1 .

  str = str.replace(/^\-+/g, ""); //cắt bỏ ký tự - ở đầu
  str = str.replace(/^\_+/g, ""); //cắt bỏ ký tự _ ở đầu
  str = str.replace(/^\.+/g, ""); //cắt bỏ ký tự . ở đầu

  //str = str.replace(/^\-+|\-+$/g, ""); //
  //str = str.replace(/\-/g, "");
  //cắt bỏ ký tự - ở đầu và cuối chuỗi

  eval(thiz).value = str.trim();
};

export const getLastDateOfMonth = (dateParam: Date | string) => {
  if (typeof dateParam === "string") {
    return dateParam;
  } else {
    var lastDayOfMonth = new Date(
      dateParam.getFullYear(),
      dateParam.getMonth() + 1,
      0
    );
    var year = lastDayOfMonth.getFullYear();
    var month = lastDayOfMonth.getMonth() + 1;
    var date = lastDayOfMonth.getDate();
    const result = `${year}-${checkNumberWith(month, 10)}-${checkNumberWith(
      date,
      10
    )}`;
    return result;
    //return `${year}-${month}-${date}`;
  }
};

export const getFirstDateOfMonthVerDate = (dateParam: number) => {
  return new Date(new Date(dateParam).setDate(1));
};

export const getFirstDateOfMonth = (dateParam: Date | string) => {
  if (typeof dateParam === "string") {
    return dateParam;
  } else {
    var lastDayOfMonth = new Date(
      dateParam.getFullYear(),
      dateParam.getMonth() + 1,
      0
    );
    var year = lastDayOfMonth.getFullYear();
    var month = lastDayOfMonth.getMonth() + 1;

    //return `${year}-${month}-01`;
    const result = `${year}-${checkNumberWith(month, 10)}-01`;
    return result;
  }
};

export const convertFullTime = (dateParam: Date | string) => {
  dateParam = new Date(dateParam);
  var month = dateParam.getMonth() + 1;
  var day = dateParam.getDay();
  var year = dateParam.getFullYear();
  var hour = dateParam.getHours();
  var min = dateParam.getMinutes();
  var sec = dateParam.getSeconds();

  //return `${year}-${month}-01`;
  const result = `${year}-${checkNumberWith(month, 10)}-${checkNumberWith(
    day,
    10
  )} ${checkNumberWith(hour, 10)}:${checkNumberWith(min, 10)}:${checkNumberWith(
    sec,
    10
  )}`;
  return result;
};

export const formatBytes = (bytes: any, decimals = 2) => {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  console.log(
    "Math.log(bytes) / Math.log(k) ",
    Math.log(bytes),
    Math.log(k),
    Math.log(bytes) / Math.log(k)
  );
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  console.log("i ", i);
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
