import { AdminContentLayout } from "@layouts/admin-content-layout";
import { useClientgateApi } from "@packages/api";
import { RequiredField } from "@packages/common/Validation_Rules";
import { MdMetaColGroupSpecDto } from "@packages/types";
import { useQuery } from "@tanstack/react-query";
import { CheckBox, LoadPanel, Switch } from "devextreme-react";
import Form, { IItemProps, Item } from "devextreme-react/form";
import { nanoid } from "nanoid";
import { useMemo, useRef } from "react";
import { match } from "ts-pattern";

const formData = {
  Col01: "This is short name",
  Col04: "1",
  Province: "101",
  Col07: "",
};

const customFields: Partial<MdMetaColGroupSpecDto>[] = [
  // {
  //   ColGrpCodeSys: "COLGRPCODESYS.2023.01",
  //   ColCodeSys: "Col01",
  //   ColCode: "Col01",
  //   ColOperatorType: "EQUAL",
  //   OrderIdx: 10,
  //   JsonRenderParams: null,
  //   JsonListOption: "[]",
  //   FlagIsNotNull: "1",
  //   FlagIsCheckDuplicate: "1",
  //   FlagIsQuery: "1",
  //   FlagActive: "1",
  //   LogLUDTimeUTC: "2023-05-29 16:29:45",
  //   LogLUBy: "0317844394@INOS.VN",
  //   ColCaption: "ShortName",
  //   ColDataType: "TEXT",
  // },
  // {
  //   ColGrpCodeSys: "COLGRPCODESYS.2023.01",
  //   ColCodeSys: "Col02",
  //   ColOperatorType: "EQUAL",
  //   OrderIdx: 20,
  //   JsonRenderParams: null,
  //   JsonListOption: "[]",
  //   FlagIsNotNull: "1",
  //   FlagIsCheckDuplicate: "1",
  //   FlagIsQuery: "1",
  //   FlagActive: "1",
  //   ColCode: "Col02",
  //   ColCaption: "BirthDate",
  //   ColDataType: "DATE",
  // },
  // {
  //   ColGrpCodeSys: "COLGRPCODESYS.2023.01",
  //   ColCodeSys: "Col03",
  //   ColCode: "Col03",
  //   ColOperatorType: "EQUAL",
  //   OrderIdx: 30,
  //   JsonRenderParams: null,
  //   JsonListOption: "[]",
  //   FlagIsNotNull: "1",
  //   FlagIsCheckDuplicate: "1",
  //   FlagIsQuery: "1",
  //   FlagActive: "1",
  //   ColCaption: "Email",
  //   ColDataType: "EMAIL",
  // },
  // {
  //   ColGrpCodeSys: "COLGRPCODESYS.2023.01",
  //   ColCodeSys: "Col04",
  //   ColCode: "Col04",
  //   ColOperatorType: "EQUAL",
  //   OrderIdx: 40,
  //   JsonRenderParams: null,
  //   JsonListOption: "[]",
  //   FlagIsNotNull: "1",
  //   FlagIsCheckDuplicate: "1",
  //   FlagIsQuery: "1",
  //   FlagActive: "1",
  //   ColCaption: "Is VIP",
  //   ColDataType: "FLAG",
  // },
  // {
  //   ColGrpCodeSys: "COLGRPCODESYS.2023.01",
  //   ColCodeSys: "Col05",
  //   ColCode: "Col05",
  //   ColOperatorType: "EQUAL",
  //   OrderIdx: 50,
  //   JsonRenderParams: null,
  //   JsonListOption: JSON.stringify([
  //     { Value: "Web", OrderIdx: 1 },
  //     { Value: "Mobile", OrderIdx: 2 },
  //   ]),
  //   FlagIsNotNull: "1",
  //   FlagIsCheckDuplicate: "1",
  //   FlagIsQuery: "1",
  //   FlagActive: "1",
  //   ColCaption: "Custom Group",
  //   ColDataType: "SELECTONE",
  // },
  // {
  //   ColGrpCodeSys: "COLGRPCODESYS.2023.01",
  //   ColCodeSys: "Col06",
  //   ColCode: "Col06",
  //   ColOperatorType: "EQUAL",
  //   OrderIdx: 60,
  //   JsonRenderParams: null,
  //   JsonListOption: JSON.stringify([
  //     { Value: "Web", OrderIdx: 1 },
  //     { Value: "Mobile", OrderIdx: 2 },
  //   ]),
  //   FlagIsNotNull: "1",
  //   FlagIsCheckDuplicate: "1",
  //   FlagIsQuery: "1",
  //   FlagActive: "1",
  //   ColCaption: "Custom Tags",
  //   ColDataType: "SELECTMANY",
  // },
  {
    ColGrpCodeSys: "COLGRPCODESYS.2023.01",
    ColCodeSys: "COLD6A158",
    ColCode: "Province",
    ColOperatorType: "EQUAL",
    OrderIdx: 70,
    JsonRenderParams: null,
    JsonListOption: JSON.stringify([{ Value: "MstProvince" }]),
    FlagIsNotNull: "1",
    FlagIsCheckDuplicate: "1",
    FlagIsQuery: "1",
    FlagActive: "1",
    ColCaption: "Province",
    ColDataType: "MASTERDATA",
  },
  {
    ColGrpCodeSys: "COLGRPCODESYS.2023.01",
    ColCodeSys: "Col06",
    ColCode: "Col06",
    ColOperatorType: "EQUAL",
    OrderIdx: 80,
    JsonRenderParams: null,
    JsonListOption: JSON.stringify([
      { Value: "Male", OrderIdx: 1, IsSelected: true },
      { Value: "Female", OrderIdx: 2, IsSelected: false },
    ]),
    FlagIsNotNull: "1",
    FlagIsCheckDuplicate: "1",
    FlagIsQuery: "0",
    FlagActive: "1",
    ColCaption: "Gender",
    ColDataType: "SELECTONERADIO",
  },
  {
    ColGrpCodeSys: "COLGRPCODESYS.2023.01",
    ColCodeSys: "Col07",
    ColCode: "Col07",
    ColOperatorType: "EQUAL",
    OrderIdx: 90,
    JsonRenderParams: null,
    JsonListOption: JSON.stringify([
      { Value: "Hanoi", OrderIdx: 1, IsSelected: true },
      { Value: "Hcm", OrderIdx: 2, IsSelected: false },
      { Value: "Haiphong", OrderIdx: 2, IsSelected: true },
    ]),
    FlagIsNotNull: "1",
    FlagIsCheckDuplicate: "1",
    FlagIsQuery: "0",
    FlagActive: "1",
    ColCaption: "Targets",
    ColDataType: "SELECTMULTIPLESELECTBOX",
  },
];
const mapEditorType = (dataType: string) => {
  return match(dataType)
    .with("SELECTONERADIO", () => "dxRadioGroup")
    .with("SELECTONEDROPBOX", () => "dxSelectBox")
    .with("DATE", () => "dxDateBox")
    .with("EMAIL", () => "dxTextBox")
    .with("FLAG", () => "dxSwitch")
    .with("MASTERDATA", () => "dxSelectBox")
    .with("SELECTMULTIPLESELECTBOX", () => "dxRadioGroup")
    .with("SELECTMULTIPLEDROPBOX", () => "dxTagBox")
    .otherwise(() => "dxTextBox");
};
const flagFieldRender = (data: any) => {
  // console.log("data:", data);
  let valueChanged = (e: any) => {
    data.component.updateData(data.dataField, e.value ? "1" : "0");
  };

  return (
    <Switch
      defaultValue={data.editorOptions.value === "1"}
      onValueChanged={valueChanged}
    ></Switch>
  );
};
export const FormRenderContainer = () => {
  const api = useClientgateApi();
  const allMasterColumns = customFields
    .filter((item) => item.ColDataType === "MASTERDATA")
    .map((item) => {
      return item.ColCodeSys;
    });

  const { data: dsMapping, isLoading } = useQuery({
    queryKey: ["allMasterColumns"],
    queryFn: async () => {
      const resp = await api.MDMetaColGroupSpec_GetListOption(allMasterColumns);
      if (resp.isSuccess) {
        return resp.DataList?.reduce((result, item) => {
          result[item.ColCodeSys] = item.Lst_MD_OptionValue;
          return result;
        }, {} as { [key: string]: any[] });
      }
    },
  });
  if (isLoading) {
    return <LoadPanel />;
  }
  return (
    <AdminContentLayout className={"province-management"}>
      <AdminContentLayout.Slot name={"Header"}>
        <h4>Form Render</h4>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <FormRenderContent datasourceMapping={dsMapping!} />
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};

interface FormRenderContentProps {
  datasourceMapping: { [key: string]: any };
}
export const FormRenderContent = ({
  datasourceMapping,
}: FormRenderContentProps) => {
  const mapValidationRules = (field: Partial<MdMetaColGroupSpecDto>) => {
    const rules = [];
    if (field.ColDataType !== "FLAG" && field.FlagIsNotNull === "1") {
      rules.push(RequiredField(field.ColCaption!));
    }
    if (field.ColDataType === "EMAIL") {
      rules.push({
        type: "email",
        message: "Email is not valid",
      });
    }
    return rules;
  };
  const mapCustomOptions = (field: Partial<MdMetaColGroupSpecDto>) => {
    return match(field.ColDataType)
      .with("SELECTONEDROPBOX", () => ({
        validationMessagePosition: "top",
      }))
      .with("SELECTMULTIPLEDROPBOX", () => ({
        validationMessagePosition: "top",
      }))
      .with("FLAG", () => ({
        editorType: undefined,
        render: (data: any) => flagFieldRender(data),
      }))
      .otherwise(() => ({}));
  };

  const mapEditorOption = (field: Partial<MdMetaColGroupSpecDto>) => {
    const commonOptions = {
      searchEnabled: true,
      validationMessageMode: "always",
    };
    return match(field.ColDataType)
      .with("DATE", () => {
        return {
          ...commonOptions,
          type: "date",
          displayFormat: "yyyy-MM-dd",
          openOnFieldClick: true,
        };
      })
      .with("DATETIME", () => {
        return {
          ...commonOptions,
          type: "datetime",
          openOnFieldClick: true,
        };
      })
      .with("EMAIL", () => {
        return {
          ...commonOptions,
        };
      })
      .with("FLAG", () => {
        return {
          ...commonOptions,
        };
      })
      .with("SELECTONEDROPBOX", () => {
        return {
          dataSource: JSON.parse(field.JsonListOption || "[]"),
          displayExpr: "Value",
          valueExpr: "Value",
        };
      })
      .with("SELECTONERADIO", () => {
        // console.log("field:", field);
        const items = JSON.parse(field.JsonListOption || "[]");
        const defaultItem = items.find((item: any) => item.IsSelected);
        return {
          displayExpr: "Value",
          valueExpr: "Value",
          items: items,
          value: defaultItem ? defaultItem.Value : undefined,
        };
      })
      .with("SELECTMULTIPLEDROPBOX", () => {
        return {
          dataSource: JSON.parse(field.JsonListOption || "[]"),
          displayExpr: "Value",
          valueExpr: "Value",
        };
      })
      .with("SELECTMULTIPLESELECTBOX", () => {
        return {
          dataSource: JSON.parse(field.JsonListOption || "[]"),
          displayExpr: "Value",
          valueExpr: "Value",
        };
      })
      .with("MASTERDATA", () => {
        return {
          items: datasourceMapping[field.ColCodeSys!],
          displayExpr: "Value",
          valueExpr: "Key",
          onValueChanged: ({ value, component }: any) => {
            const Name = datasourceMapping[field.ColCodeSys!].find(
              (item: any) => item.Key === value
            )?.Value;
            formRef.current?.instance?.updateData("ProvinceName", Name);
          },
        };
      })
      .otherwise(() => {
        return {
          ...commonOptions,
        };
      });
  };

  const formSettings = useMemo<IItemProps[]>(() => {
    const items: IItemProps[] = customFields.map<IItemProps>((field) => {
      if (field.ColDataType !== "SELECTMULTIPLESELECTBOX") {
        return {
          dataField: field.ColCode,
          editorType: mapEditorType(field.ColDataType!),
          label: {
            text: field.ColCaption,
            location: "left",
          },
          validationMessagePosition: "bottom",
          editorOptions: mapEditorOption(field),
          validationRules: mapValidationRules(field),
          ...mapCustomOptions(field),
        };
      }
      const options = JSON.parse(field.JsonListOption || "[]");
      return {
        itemType: "group",
        render: (param: any) => {
          const { component, formData } = param;
          // init data
          component.updateData(
            field.ColCode,
            options
              .filter((opt: any) => opt.IsSelected)
              .map((opt: any) => opt.Value)
          );
          return (
            <div className={"flex w-full"}>
              <div className={"flex"}>
                <label className={`dx-field-item-label display-block pr-4`}>
                  <span className={"dx-field-item-label-content"}>
                    <span className={"dx-field-item-label-text"}>
                      {field.ColCaption}
                    </span>
                    {field.FlagIsNotNull === "1" && (
                      <span className={"dx-field-item-required-mark"}> *</span>
                    )}
                  </span>
                </label>
                <div className={"flex-col dx-field-item-content ml-4"}>
                  <div className={"dx-texteditor-container flex flex-col"}>
                    {options.map((opt: any) => {
                      return (
                        <CheckBox
                          className={"mb-1"}
                          key={nanoid()}
                          name={`${field.ColCode}`}
                          text={opt.Value}
                          defaultValue={opt.IsSelected}
                          onValueChanged={(e: any) => {
                            const value = e.value;
                            const formData = component.option("formData");
                            const data = formData[field.ColCode!] || [];
                            // checked
                            if (value) {
                              data.push(opt.Value);
                            } else {
                              const index = data.findIndex(
                                (item: any) => item === opt.Value
                              );
                              if (index > -1) {
                                data.splice(index, 1);
                              }
                            }
                            component.updateData(field.ColCode, data);
                          }}
                        ></CheckBox>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        },
      };
    });
    items.push({
      itemType: "button",
      buttonOptions: {
        text: "Submit",
        useSubmitBehavior: true,
      },
    });
    return items;
  }, []);

  const handleSubmit = (e: any) => {
    // console.log("formData:", formData);
    // custom validation
    if (!formData["Col07"] || formData["Col07"].length < 1) {
      alert("Please select at least one item");
    }
    e.preventDefault();
  };
  const formRef: any = useRef(null);
  return (
    <div>
      Render Form
      <form onSubmit={handleSubmit}>
        <Form className={""} formData={formData} ref={formRef}>
          {formSettings.map((item, idx) => {
            // console.log(item);
            return <Item {...item} key={idx} />;
          })}
        </Form>
      </form>
    </div>
  );
};
