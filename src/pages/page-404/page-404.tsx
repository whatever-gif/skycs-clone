import React from "react";
import { Box } from "devextreme-react";
import { useI18n } from "@/i18n/useI18n";

export const Page404 = () => {
  const { t } = useI18n("Common");
  React.useEffect(() => {
    document.title = t("pageNotFound");
    return () => {
      document.title = t("pageNotFound");
    };
  }, []);

  return (
    <Box>
      page not found
    </Box>
  );
};

