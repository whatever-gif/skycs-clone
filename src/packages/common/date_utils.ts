import { format } from "date-fns";

export const formatDate = (date?: Date): string => {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
}