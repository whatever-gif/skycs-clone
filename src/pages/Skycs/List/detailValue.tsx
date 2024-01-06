import { useI18n } from "@/i18n/useI18n";
import { ColumnOptions, FormOptions } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import { DataField } from "./Skycs";
import { Button, Form } from "devextreme-react";
import { GroupItem } from "devextreme-react/form";
import { nanoid } from "nanoid";
import { GroupField } from "../components/GroupField";
import { useClientgateApi } from "@/packages/api";
import "./style.scss";

const SkyDetail = () => {
  const api = useClientgateApi();
  const [column, setColumn] = useState({} as any);
  const [formValue, setFormValue] = useState<any>(() => {
    const data = localStorage.getItem("Skycs_Detail");
    const getListMultipleSelect = localStorage.getItem("Skycs_DataField");

    if (data) {
      const valueData = JSON.parse(data);
      const valueJson = valueData.StrJson;
      let parseValue: any = JSON.parse(valueJson).reduce(
        (total: any, value: any) => {
          return {
            ...total,
            ...value,
          };
        },
        {}
      );
      if (getListMultipleSelect) {
        const parseValueSelect = JSON.parse(getListMultipleSelect);
        console.log(
          "getListMultipleSelect ",
          parseValue,
          "SelectMultiple",
          parseValue["SelectMultiple"]
        );
        const list = parseValueSelect.filter(
          (item: any) => item.TypeField === "dxTagBox"
        );
        const getListValue = list
          .map((item: any) => {
            return {
              [`${item.CodeField}`]: parseValue[`${item.CodeField}`.toString()]
                ? parseValue[`${item.CodeField}`.toString()].split(",")
                : [],
            };
          })
          .reduce((total: any, value: any) => {
            return {
              ...total,
              ...value,
            };
          }, {});
        parseValue = {
          ...parseValue,
          ...getListValue,
        };
      }
      console.log("parseValue ", parseValue);
      const obj = {
        ...valueData,
        ...parseValue,
      };
      delete obj.StrJson;
      return {
        ...obj,
      };
    }
    return {};
  });

  const getUniquie = (data: any[]) => {
    const uniqueGroup = data.reduce((acc: any, item: any) => {
      if (!acc.includes(item?.groupKey)) {
        acc.push(item?.groupKey);
      }
      return acc;
    }, []);

    return uniqueGroup;
  };

  const getFormSetting = (uniqueGroup: any[], newData: any[]) => {
    const formSetting: FormOptions = {
      colCount: 1,
      labelLocation: "left",
      items: uniqueGroup.map((item: any) => {
        const filterValue = newData.filter((i: any) => i.groupKey === item);
        return {
          itemType: "group",
          disableCollapsible: true,
          caption: t(`${item}`),
          colCount: 2,
          cssClass: "collapsible form-group",
          items: filterValue,
        };
      }),
    };

    return formSetting;
  };

  const [listDong, setListDong] = useState([]);
  const { t } = useI18n("Sky_Form");
  const [listForm, setListForm] = useState(() => {
    const getList = localStorage.getItem("Skycs_DataField");
    if (getList) {
      const data = JSON.parse(getList);
      console.log("data ", data);
      const listDont = data.filter((t: any) => t.FlagChange);
      setListDong(listDont);
      if (Array.isArray(data)) {
        return data;
      } else {
        return [];
      }
    }
    return [];
  });

  const getData = (dataResponse: any) => {
    const newData: ColumnOptions[] = listForm.map((item: DataField) => {
      let value = {
        dataField: item.CodeField,
        caption: t(`${item.NameField}`),
        editorOptions: {},
        groupKey: item.GroupInfo,
        editorType: item.TypeField,
        visible: item.FlagActive === 1 ? true : false,
        validationRules: item.validationRules ?? [],
      };
      if (item.TypeField === "dxTagBox") {
        return {
          ...value,
          editorOptions: {
            dataSource: dataResponse,
            displayExpr: "SpecCode",
            valueExpr: "SpecDescription",
          },
        };
      }
      if (item.TypeField === "dxSelectBox") {
        return {
          ...value,
          editorOptions: {
            dataSource: dataResponse,
            displayExpr: "SpecCode",
            valueExpr: "SpecDescription",
          },
        };
      }
      if (item.TypeField === "dxTimeBox") {
        return {
          ...value,
          editorType: "dxDateBox",
          editorOptions: {
            type: "time",
            displayFormat: "HH:mm:ss",
            dateSerializationFormat: "yyyy-MM-dd HH:mm:ssx",
            format: "HH:mm:ss",
          },
        };
      }
      if (item.TypeField === "dxDateTimeBox") {
        return {
          ...value,
          editorType: "dxDateBox",
          editorOptions: {
            type: "datetime",
            dateSerializationFormat: "yyyy-MM-dd HH:mm:ssx",
            displayFormat: "yyyy-MM-dd HH:mm:ss",
            format: "yyyy-MM-dd HH:mm:ss",
          },
        };
      }
      if (item.TypeField === "dxDateBox") {
        return {
          ...value,
          editorType: "dxDateBox",
          editorOptions: {
            type: "date",
            displayFormat: "yyyy-MM-dd",
            format: "yyyy-MM-dd",
          },
        };
      }
      if (item.TypeField === "dxNumberBox") {
        return {
          ...value,
          editorOptions: {
            type: "decimal",
            format: "#,##0.##",
          },
        };
      }

      return value;
    }) as ColumnOptions[];

    return newData;
  };

  const calll = async () => {
    const resp = await api.Mst_CarSpec_GetAllActive();
    if (resp.isSuccess) {
      console.log("resp ", resp.DataList);
      const column = getData(resp.DataList);
      const unquie = getUniquie(column);
      const formSetting = getFormSetting(unquie, column);
      setColumn(formSetting);
      return resp.DataList;
    } else {
      return [];
    }
  };

  useEffect(() => {
    calll();
  }, []);
  return (
    <>
      <Form className="form-test">
        {column?.items?.map((item: any) => {
          return (
            <GroupItem
              key={nanoid()}
              render={({}) => {
                return (
                  <GroupField
                    item={item}
                    formData={formValue}
                    disableCollapsible={item.disableCollapsible}
                  />
                );
              }}
            />
          );
        })}
      </Form>
      {/* <Button onClick={handleSave}> Save </Button> */}
    </>
  );
};

export default SkyDetail;
