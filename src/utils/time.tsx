import { format } from "date-fns";

export const calcMinuteToTime = (minutes: any) => {
  if (!minutes) {
    return "00:00";
  }

  const hour = Math.floor(minutes / 60);
  const residualMinutes = minutes - hour * 60;

  const hourDisplay = `0${hour}`.slice(-2);
  const minutesDisplay = `0${residualMinutes}`.slice(-2);

  // `0${date.getDate()}`.slice(-2);

  if (residualMinutes != 0) {
    return `${hourDisplay}:${minutesDisplay}`;
  } else {
    return `${hour}:00`;
  }
};

export const getDay = (time: string) => {
  if (!time) {
    return;
  }
  const [day, month] = time?.split("-");
  return day;
};

export const getMonth = (time: string) => {
  const [day, month] = time.split("-");
  return month;
};

export const getTime = (date: Date) => {
  const currentDate = new Date(date);
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const getFullTime = (date: Date) => {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const getFullTimeMaxHour = (date: Date) => {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${23}:${59}:${59}`;
};

export const getDMY = (date: Date) => {
  const currentDate = new Date(date);

  if (!currentDate || isNaN(currentDate.getTime())) {
    return undefined;
  }

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getCurrentUserTime = (date: any) => {
  const crDate = new Date(date);

  const crTimeZone = (new Date().getTimezoneOffset() / 60) * -1;

  crDate.setHours(crDate.getHours() + crTimeZone);
  return format(crDate, "yyyy-MM-dd HH:mm:ss").toString();
};
