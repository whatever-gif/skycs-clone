import { MdMetaColGroupSpec } from "@/packages/types";
import { mapCustomOptions, mapEditorOption, mapEditorType } from "./util";
import { useI18n } from "@/i18n/useI18n";

interface Columns {
  listColumn: MdMetaColGroupSpec[];
  listMapField: any;
}

export const useColumnsSearch = ({ listColumn, listMapField }: Columns) => {
  let getListSearch: any[] = [];
  const { t } = useI18n("Mst_Customer");
  const getListColumnSearch = listColumn
    .filter((item: MdMetaColGroupSpec) => item.FlagIsQuery === "1")
    .map((field: any) => {
      return {
        ColOperatorType: field.ColOperatorType,
        dataField: field.ColCodeSys,
        caption: t(`${field.ColCaption}`),
        editorType: mapEditorType(field.ColDataType!),
        label: {
          text: field.ColCaption,
        },
        validationMessagePosition: "bottom",
        editorOptions: mapEditorOption(field, listMapField ?? {}),
        // validationRules: mapValidationRules(field),
        ...mapCustomOptions(field),
      };
    });

  getListColumnSearch.forEach((item) => {
    if (item.ColOperatorType === "RANGE") {
      const obj = [
        item,
        {
          ...item,
          dataField: item.dataField + "_To",
          caption: item.caption + " " + t("To"),
          label: {
            text: item.label.text + " " + t("To"),
          },
        },
      ];
      getListSearch = [...getListSearch, ...obj];
    } else {
      getListSearch = [...getListSearch, item];
    }
  });

  // console.log("getListSearch ", getListSearch);
  return getListSearch;
};