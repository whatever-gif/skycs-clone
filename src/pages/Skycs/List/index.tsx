import { useI18n } from "@/i18n/useI18n";
import { ColumnOptions, FormOptions } from "@/types";
import React, { useCallback, useState } from "react";
import { DataField } from "./Skycs";
import { Button, Form } from "devextreme-react";
import { GroupItem } from "devextreme-react/form";
import { nanoid } from "nanoid";
import { GroupField } from "../components/GroupField";

const SkyForm = () => {
  const [formValue, setFormValue] = useState<any>({});
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

  const columns: any = useCallback(() => {
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

      if (item.TypeField === "dxTimeBox") {
        return {
          ...value,
          editorType: "dxDateBox",
          editorOptions: {
            type: "time",
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

    const uniqueGroup = newData.reduce((acc: any, item: any) => {
      if (!acc.includes(item?.groupKey)) {
        acc.push(item?.groupKey);
      }
      return acc;
    }, []);
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

    console.log("formSetting ", formSetting);

    return formSetting;
    // return newData;
  }, [listForm.length]);

  const handleSave = () => {
    const objDaiLy = {
      ...formValue,
      StrJson: "",
    };

    listDong.forEach((item: any) => {
      delete objDaiLy[item.CodeField];
    });

    const newStrJson = listDong.map((item: any) => {
      return {
        [`${item?.CodeField}`]:
          typeof formValue?.[item.CodeField] === "boolean"
            ? formValue?.[item.CodeField]
              ? 1
              : 0
            : formValue?.[item.CodeField],
      };
    });

    objDaiLy.StrJson = JSON.stringify(newStrJson);

    console.log("newStrJson ", objDaiLy);

    localStorage.setItem("Skycs_Detail", JSON.stringify(objDaiLy));
  };

  return (
    <>
      <Form>
        {columns().items?.map((item: any) => {
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
      <Button onClick={handleSave}> Save </Button>
    </>
  );
};

export default SkyForm;
