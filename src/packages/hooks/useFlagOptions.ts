import {useI18n} from "@/i18n/useI18n";

export const useFlagOptions = () => {
  const {t} = useI18n("Common")
  return {
    searchEnabled: true,
    valueExpr: "value",
    displayExpr: "text",
    items: [
      {
        value: "",
        text: t("All"),
      },
      {
        value: "1",
        text: "1",
      },
      {
        value: "0",
        text: "0",
      },
    ],
  }
}