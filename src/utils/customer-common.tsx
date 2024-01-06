import { AvatarField } from "@/components/fields/AvatarField";
import BirthDayField from "@/components/fields/BirthDayField";
import CountryContactField from "@/components/fields/Contact/CountryContactField";
import DistrictContactField from "@/components/fields/Contact/DistrictContactField";
import ProvinceContactField from "@/components/fields/Contact/ProvinceContactField";
import WardContactField from "@/components/fields/Contact/WardContactField";
import CreateByField from "@/components/fields/CreateByField";
import CreateDTimeUTCField from "@/components/fields/CreateDTimeUTCField";
import { CustomerCodeInvoiceField } from "@/components/fields/CustomerCodeInvoiceField";
import CustomerCodeSysERPField from "@/components/fields/CustomerCodeSysERPField";
import CustomerGroupField from "@/components/fields/CustomerGroupField";
import CustomerTypeField from "@/components/fields/CustomerTypeField";
import CustomizePhoneField from "@/components/fields/CustomizePhoneField";
import DateField from "@/components/fields/DateField";
import DateTimeField from "@/components/fields/DateTimeField";
import CountryDeliveryField from "@/components/fields/Delivery/CountryDeliveryField";
import DistrictDeliveryField from "@/components/fields/Delivery/DistrictDeliveryField";
import ProvinceDeliveryField from "@/components/fields/Delivery/ProvinceDeliveryField";
import WardDeliveryField from "@/components/fields/Delivery/WardDeliveryField";
import { EmailField } from "@/components/fields/EmailField";
import { GovIDField } from "@/components/fields/GovIDField";
import CountryInvoiceField from "@/components/fields/Invoice/CountryInvoiceField";
import DistrictInvoiceField from "@/components/fields/Invoice/DistrictInvoiceField";
import ProvinceInvoiceField from "@/components/fields/Invoice/ProvinceInvoiceField";
import WardInvoiceField from "@/components/fields/Invoice/WardInvoiceField";
import MultiSelectBox from "@/components/fields/MultiSelectBox";
import PartnerTypeField from "@/components/fields/PartnerTypeField";
import { PhoneField } from "@/components/fields/PhoneField";
import PurchaseField from "@/components/fields/PurchaseField";
import SaleField from "@/components/fields/SaleField";
import { UploadField } from "@/components/fields/UploadField";
import UserManagerField from "@/components/fields/UserManagerField";
import { ZaloField } from "@/components/fields/ZaloField";
import { revertEncodeFileType } from "@/components/ulti";
import { useClientgateApi } from "@/packages/api";
import { useApiHeaders } from "@/packages/api/headers";
import { requiredType } from "@/packages/common/Validation_Rules";
import { MdMetaColGroupSpecDto } from "@/packages/types";
import { FileUploader, Switch } from "devextreme-react";
import { atom } from "jotai";
import { useState } from "react";
import { match } from "ts-pattern";

export const mapEditorType = (dataType: string) => {
  return (
    match(dataType)
      .with("SELECTONERADIO", () => "dxRadioGroup")
      .with("SELECTONEDROPBOX", () => "dxSelectBox")
      .with("DATE", () => "dxDateBox")
      .with("DATETIME", () => "dxDateBox")
      .with("EMAIL", () => "dxTextBox")
      // .with("FLAG", () => "dxSwitch")
      .with("MASTERDATA", () => "dxSelectBox")
      .with("SELECTMULTIPLESELECTBOX", () => "dxRadioGroup")
      .with("SELECTMULTIPLEDROPBOX", () => "dxTagBox")
      .with("SELECTONEDROPDOWN", () => "dxSelectBox")
      .with("SELECTMULTIPLEDROPDOWN", () => "dxTagBox")
      .with("MASTERDATASELECTMULTIPLE", () => "dxTagBox")
      .with("PERCENT", () => "dxNumberBox")
      .otherwise(() => "dxTextBox")
  );
};

export const mapEditorOptionByDataGrid = ({}) => {};

export const mapEditorOption = ({
  field,
  listDynamic,
  listFormData,
  customOption,
  defaultValue,
  keyWord,
  translatePlaceholder,
  translate,
}: {
  field: Partial<MdMetaColGroupSpecDto>;
  listDynamic?: any;
  listFormData?: any;
  customOption?: any;
  defaultValue?: any;
  keyWord?: string;
  translatePlaceholder?: any;
  translate?: any;
}) => {
  const commonOptions = {
    placeholder: "Input",
    searchEnabled: true,
    validationMessageMode: "always",
  };

  return match(field.ColDataType)
    .with("CUSTOMERCODE", () => {
      return {
        ...commonOptions,
        readOnly: customOption?.editType != "add",
      };
    })
    .with("PERCENT", () => {
      return {
        min: 0,
        max: 100,
        readOnly: customOption?.editType == "detail",
      };
    })

    .with("EMAIL", () => {
      return {
        ...commonOptions,
        readOnly: customOption?.editType == "detail",
      };
    })

    .with("SELECTONE", () => {
      let items = JSON.parse(field.mdmc_JsonListOption ?? "[]");
      if (keyWord) {
        items = JSON.parse(field[`${keyWord}`] ?? "[]");
      }
      return {
        placeholder: "Select",
        dataSource: items,
        displayExpr: "Value",
        valueExpr: "Value",
        showClearButton: true,
        readOnly: customOption?.editType == "detail",
      };
    })
    .with("SELECTMANY", () => {
      let items = JSON.parse(field.mdmc_JsonListOption ?? "[]");
      if (keyWord) {
        items = JSON.parse(field[`${keyWord}`] ?? "[]");
      }
      return {
        placeholder: "Select",

        dataSource: items,
        displayExpr: "Value",
        valueExpr: "Value",
        readOnly: customOption?.editType == "detail",
      };
    })
    .with("MASTERDATA", () => {
      return {
        dataSource: listDynamic[`${field?.ColCodeSys}`] ?? [],
        displayExpr: "Value",
        valueExpr: "Key",
        defaultValue: defaultValue
          ? defaultValue[`${field?.ColCodeSys}`]
          : undefined,
        searchEnabled: true,
        showClearButton: true,
        readOnly: customOption?.editType == "detail",
        placeholder: "Select",
      };
    })
    .with("SELECTONEDROPBOX", () => {
      let items = JSON.parse(field.mdmc_JsonListOption ?? "[]");
      if (keyWord) {
        items = JSON.parse(field[`${keyWord}`] ?? "[]");
      }
      return {
        dataSource: items,
        displayExpr: "Value",
        showClearButton: true,
        valueExpr: "Value",
        readOnly: customOption?.editType == "detail",
        placeholder: "Select",
      };
    })
    .with("SELECTONERADIO", () => {
      let items = JSON.parse(field.mdmc_JsonListOption ?? "[]")?.map(
        (c: any) => {
          return {
            ...c,
            DisplayValue: translate ? translate(c?.Value) : c?.Value,
          };
        }
      );
      if (keyWord) {
        items = JSON.parse(field[`${keyWord}`] ?? "[]")?.map((c: any) => {
          return {
            ...c,
            DisplayValue: translate ? translate(c?.Value) : c?.Value,
          };
        });
      }

      const currentValue = defaultValue
        ? defaultValue[`${field?.ColCodeSys}`]
        : undefined;

      const list = listFormData
        ? Object.entries(listFormData)
            .map(([key, value]) => {
              if (value == currentValue) {
                return value;
              }
            })
            .filter((item: any) => item)
        : [];

      const checkItem = currentValue
        ? items?.map((item: any) => {
            return {
              ...item,
              IsSelected: list.find((c: any) => c == item.Value),
            };
          })
        : items?.find((item: any) => item.IsSelected);
      return {
        displayExpr: "DisplayValue",
        valueExpr: "Value",
        showClearButton: true,
        items: items,
        defaultValue: null,
        value: checkItem ? checkItem.Value : undefined,
        readOnly: customOption?.editType == "detail",
        placeholder: "Select",
      };
    })
    .with("SELECTMULTIPLEDROPBOX", () => {
      let items = JSON.parse(field.mdmc_JsonListOption ?? "[]");
      if (keyWord) {
        items = JSON.parse(field[`${keyWord}`] ?? "[]");
      }
      return {
        dataSource: items,
        displayExpr: "Value",
        valueExpr: "Value",
        readOnly: customOption?.editType == "detail",
        placeholder: "Select",
      };
    })
    .with("SELECTMULTIPLESELECTBOX", () => {
      let items = JSON.parse(field.mdmc_JsonListOption ?? "[]");
      if (keyWord) {
        items = JSON.parse(field[`${keyWord}`] ?? "[]");
      }
      return {
        dataSource: items,
        displayExpr: "Value",
        showClearButton: true,
        valueExpr: "Value",
        readOnly: customOption?.editType == "detail",
      };
    })
    .with("SELECTONEDROPDOWN", () => {
      let items = JSON.parse(field.mdmc_JsonListOption ?? "[]");
      if (keyWord) {
        items = JSON.parse(field[`${keyWord}`] ?? "[]");
      }
      return {
        dataSource: items,
        displayExpr: "Value",
        showClearButton: true,
        valueExpr: "Value",
        value:
          items.find((item: any) => {
            return item.IsSelected == true;
          })?.Value || undefined,
        readOnly: customOption?.editType == "detail",
        placeholder: "Select",
      };
    })
    .with("SELECTMULTIPLEDROPDOWN", () => {
      // console.log(JSON.parse(field.mdmc_JsonListOption || "[]"));
      let items = JSON.parse(field.mdmc_JsonListOption ?? "[]");
      if (keyWord) {
        items = JSON.parse(field[`${keyWord}`] ?? "[]");
      }
      return {
        dataSource: items,
        displayExpr: "Value",
        showClearButton: true,
        valueExpr: "Value",
        value:
          items
            .filter((item: any) => {
              return item.IsSelected == true;
            })
            .map((item: any) => {
              return item.Value;
            }) || [],
        readOnly: customOption?.editType == "detail",
        placeholder: "Select",
      };
    })
    .with("MASTERDATASELECTMULTIPLE", () => {
      return {
        dataSource: listDynamic[`${field?.ColCodeSys}`] ?? [],
        displayExpr: "Value",
        showClearButton: true,
        valueExpr: "Key",
        searchEnabled: true,
        readOnly: customOption?.editType == "detail",
        placeholder: "Select",
      };
    })
    .otherwise(() => {
      return {
        ...commonOptions,
        ...customOption,
        readOnly: customOption?.editType == "detail",
      };
    });
};

export const mapValidationRules = (field: Partial<MdMetaColGroupSpecDto>) => {
  const regexMST = /^(?:\d{10}|\d{10}-\d{3})$/;

  if (field?.ColCodeSys == "MST") {
    return [
      {
        type: "pattern",
        pattern: regexMST,
      },
    ];
  }

  if (field?.FlagIsNotNull == "1") {
    return [requiredType];
  }
};

const FlagField = ({
  param,
  customOptions,
  field,
}: {
  param: any;
  customOptions?: any;
  field: any;
}) => {
  const { component, formData } = param;

  const valueChanged = (e: any) => {
    component?.updateData(field?.ColCodeSys, e.value ? "1" : "0");
  };

  return (
    <Switch
      disabled={customOptions?.editType == "detail"}
      onValueChanged={valueChanged}
      defaultValue={
        formData[field?.ColCodeSys] ? formData[field?.ColCodeSys] == "1" : true
      }
    ></Switch>
  );
};

export const mapCustomOptions = (
  field: Partial<MdMetaColGroupSpecDto>,
  customOptions?: any
) => {
  return match(field.ColDataType)
    .with("SELECTONE", () => ({
      validationMessagePosition: "top",
    }))
    .with("SELECTMANY", () => ({
      validationMessagePosition: "top",
    }))

    .otherwise(() => ({}));
};

export const countryContactAtom = atom<any>(undefined);

export const getListField = ({
  listField,
  listDynamic,
  customOptions,
  defaultValue,
  translate,
}: {
  listField: any;
  listDynamic?: any;
  customOptions?: any;
  defaultValue?: any;
  translate?: any;
}) => {
  const mappingByColCodeSys = listField?.map((field: any) => {
    return match(field?.ColCodeSys)
      .with("CustomerCode", () => {
        return {
          ...field,
          ColDataType: "CUSTOMERCODE",
        };
      })
      .with("Birthday", () => {
        return {
          ...field,
          ColDataType: "BIRTHDAY",
        };
      })
      .with("FlagActive", () => {
        return {
          ...field,
          ColDataType: "FLAG",
        };
      })
      .with("CountryCodeContact", () => {
        return {
          ...field,
          ColDataType: "CountryCodeContact",
        };
      })
      .with("ProvinceCodeContact", () => {
        return {
          ...field,
          ColDataType: "ProvinceCodeContact",
        };
      })
      .with("DistrictCodeContact", () => {
        return {
          ...field,
          ColDataType: "DistrictCodeContact",
        };
      })
      .with("WardCodeContact", () => {
        return {
          ...field,
          ColDataType: "WardCodeContact",
        };
      })

      .with("CountryCodeDelivery", () => {
        return {
          ...field,
          ColDataType: "CountryCodeDelivery",
        };
      })
      .with("ProvinceCodeDelivery", () => {
        return {
          ...field,
          ColDataType: "ProvinceCodeDelivery",
        };
      })
      .with("DistrictCodeDelivery", () => {
        return {
          ...field,
          ColDataType: "DistrictCodeDelivery",
        };
      })
      .with("WardCodeDelivery", () => {
        return {
          ...field,
          ColDataType: "WardCodeDelivery",
        };
      })

      .with("CountryCodeInvoice", () => {
        return {
          ...field,
          ColDataType: "CountryCodeInvoice",
        };
      })
      .with("ProvinceCodeInvoice", () => {
        return {
          ...field,
          ColDataType: "ProvinceCodeInvoice",
        };
      })
      .with("DistrictCodeInvoice", () => {
        return {
          ...field,
          ColDataType: "DistrictCodeInvoice",
        };
      })
      .with("WardCodeInvoice", () => {
        return {
          ...field,
          ColDataType: "WardCodeInvoice",
        };
      })
      .with("CustomerCodeInvoice", () => {
        return {
          ...field,
          ColDataType: "CUSTOMERCODEINVOICE",
        };
      })

      .otherwise(() => field);
  });

  if (customOptions?.editType == "detail") {
    return mappingByColCodeSys?.map((field: any) => {
      return match(field?.ColDataType)
        .with("CUSTOMERCODEINVOICE", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            OrderIdx: field?.OrderIdx,

            dataField: field?.ColCodeSys,
            render: (param: any) => {
              const { component, formData } = param;
              return (
                <CustomerCodeInvoiceField
                  field={field}
                  component={component}
                  formData={formData}
                  editType={customOptions?.editType}
                />
              );
            },
          };
        })
        .with("GOVID", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            OrderIdx: field?.OrderIdx,
            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            dataField: field?.ColCodeSys,
            render: (param: any) => {
              const { component, formData } = param;
              return (
                <GovIDField
                  field={field}
                  component={component}
                  formData={formData}
                  editType={customOptions?.editType}
                />
              );
            },
          };
        })
        .with("PURCHASE", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules: mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,

            dataField: field?.ColCodeSys,
            render: (param: any) => {
              return (
                <PurchaseField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                />
              );
            },
          };
        })

        .with("SALE", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules: mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,

            dataField: field?.ColCodeSys,
            render: (param: any) => {
              return (
                <SaleField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                />
              );
            },
          };
        })

        .with("SELECTMULTIPLESELECTBOX", () => {
          const currentValue = listDynamic[`${field?.ColCodeSys}`] ?? [];

          const options = JSON.parse(field.mdmc_JsonListOption || "[]");

          const filterdOptions = currentValue
            ? options?.map((item: any) => {
                if (currentValue?.find((c: any) => c == item?.Value)) {
                  return {
                    ...item,
                    IsSelected: true,
                  };
                } else {
                  return {
                    ...item,
                    IsSelected: false,
                  };
                }
              })
            : options;

          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            itemType: "group",
            ColCodeSys: field?.ColCodeSys,
            dataField: field?.ColCodeSys,
            label: {
              text: field.ColCaption,
            },
            OrderIdx: field?.OrderIdx,

            render: (param: any) => {
              const { component, formData } = param;
              // init data
              component.updateData(
                field?.ColCodeSys,
                filterdOptions
                  .filter((opt: any) => opt.IsSelected)
                  .map((opt: any) => opt.Value)
              );
              return (
                <MultiSelectBox
                  field={field}
                  component={component}
                  formData={formData}
                  editType={customOptions?.editType}
                  listOption={filterdOptions}
                />
              );
            },
          };
        })
        .with("USERMANAGER", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,
            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules: mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,
            render: (param: any) => {
              return (
                <UserManagerField param={param} customOptions={customOptions} />
              );
            },
          };
        })
        .with("CountryCodeContact", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,
            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules: mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,
            render: (param: any) => {
              return (
                <CountryContactField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                />
              );
            },
          };
        })
        .with("ProvinceCodeContact", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,
            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules: mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,
            render: (param: any) => {
              return (
                <ProvinceContactField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                />
              );
            },
          };
        })
        .with("DistrictCodeContact", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,
            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules: mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,
            render: (param: any) => {
              return (
                <DistrictContactField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                />
              );
            },
          };
        })
        .with("WardCodeContact", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,
            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules: mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,
            render: (param: any) => {
              return (
                <WardContactField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                />
              );
            },
          };
        })

        .with("CountryCodeDelivery", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,
            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules: mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,
            render: (param: any) => {
              return (
                <CountryDeliveryField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                />
              );
            },
          };
        })
        .with("ProvinceCodeDelivery", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,
            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules: mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,
            render: (param: any) => {
              return (
                <ProvinceDeliveryField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                />
              );
            },
          };
        })
        .with("DistrictCodeDelivery", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,
            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules: mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,
            render: (param: any) => {
              return (
                <DistrictDeliveryField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                />
              );
            },
          };
        })
        .with("WardCodeDelivery", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,
            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules: mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,
            render: (param: any) => {
              return (
                <WardDeliveryField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                />
              );
            },
          };
        })

        .with("CountryCodeInvoice", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,
            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules: mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,
            render: (param: any) => {
              return (
                <CountryInvoiceField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                />
              );
            },
          };
        })
        .with("ProvinceCodeInvoice", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,
            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules: mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,
            render: (param: any) => {
              return (
                <ProvinceInvoiceField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                />
              );
            },
          };
        })
        .with("DistrictCodeInvoice", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,
            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules: mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,
            render: (param: any) => {
              return (
                <DistrictInvoiceField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                />
              );
            },
          };
        })
        .with("WardCodeInvoice", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,
            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules: mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,
            render: (param: any) => {
              return (
                <WardInvoiceField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                />
              );
            },
          };
        })

        .with("CUSTOMERTYPE", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,

            dataField: field?.ColCodeSys,
            render: (param: any) => {
              return (
                <CustomerTypeField
                  param={param}
                  customOptions={customOptions}
                />
              );
            },
          };
        })
        .with("CUSTOMERGROUP", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,

            dataField: field?.ColCodeSys,
            render: (param: any) => {
              return (
                <CustomerGroupField
                  param={param}
                  customOptions={customOptions}
                />
              );
            },
          };
        })
        .with("PARTNERTYPE", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,

            dataField: field?.ColCodeSys,
            render: (param: any) => {
              return (
                <PartnerTypeField param={param} customOptions={customOptions} />
              );
            },
          };
        })
        .with("CUSTOMERCODESYSERP", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,
            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,

            dataField: field?.ColCodeSys,
            render: (param: any) => {
              return (
                <CustomerCodeSysERPField
                  param={param}
                  customOptions={customOptions}
                />
              );
            },
          };
        })
        .with("EMAIL", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            OrderIdx: field?.OrderIdx,

            dataField: field?.ColCodeSys,
            render: (param: any) => {
              const { component, formData } = param;
              return (
                <EmailField
                  field={field}
                  component={component}
                  formData={formData}
                  editType={customOptions?.editType}
                />
              );
            },
          };
        })
        .with("TEXTAREA", () => {
          if (customOptions?.editType == "detail") {
            return {
              FlagIsColDynamic: field.FlagIsColDynamic,
              ColDataType: field.ColDataType,
              groupKeys: field.ColGrpCodeSys,
              ColCodeSys: field?.ColCodeSys,
              itemType: "group",
              label: {
                text: field.ColCaption,
              },
              validationMessagePosition: "bottom",
              OrderIdx: field?.OrderIdx,

              dataField: field?.ColCodeSys,
              render: (param: any) => {
                const { component, formData } = param;

                return (
                  <div className="font-semibold">
                    {formData[field?.ColCodeSys] ?? ""}
                  </div>
                );
              },
            };
          }
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            groupKeys: field.ColGrpCodeSys,
            dataField: field?.ColCodeSys,
            editorType: "dxTextArea",
            ColCodeSys: field?.ColCodeSys,
            ColDataType: field.ColDataType,
            label: {
              text: field.ColCaption,
            },
            validationMessagePosition: "bottom",
            editorOptions: mapEditorOption({
              field: field,
              listDynamic: listDynamic ?? {},
              customOption: customOptions ?? {},
              translate: translate,
            }),
            OrderIdx: field?.OrderIdx,

            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            ...mapCustomOptions(field),
          };
        })
        .with("ZALOUSERFOLLOWER", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            dataField: field?.ColCodeSys,
            render: (param: any) => {
              const { component, formData } = param;
              return (
                <ZaloField
                  field={field}
                  component={component}
                  formData={formData}
                  editType={customOptions?.editType}
                />
              );
            },
          };
        })
        .with("PHONE", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            OrderIdx: field?.OrderIdx,
            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            dataField: field?.ColCodeSys,
            render: (param: any) => {
              const { component, formData } = param;
              return (
                <PhoneField
                  field={field}
                  component={component}
                  formData={formData}
                  editType={customOptions?.editType}
                />
              );
            },
          };
        })
        .with("CUSTOMIZEPHONE", () => {
          const options = JSON.parse(field?.mdmc_JsonListOption) ?? [];

          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,
            OrderIdx: field?.OrderIdx,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },

            dataField: field?.ColCodeSys,
            render: (param: any) => {
              const { component, formData } = param;
              return <CustomizePhoneField param={param} options={options} />;
            },
          };
        })
        .with("IMAGE", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            OrderIdx: field?.OrderIdx,

            dataField: field?.ColCodeSys,
            render: (param: any) => {
              const { component, formData } = param;
              return (
                <AvatarField
                  field={field}
                  component={component}
                  formData={formData}
                  editType={customOptions?.editType}
                />
              );
            },
          };
        })
        .with("FILE", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            OrderIdx: field?.OrderIdx,

            dataField: field?.ColCodeSys,
            render: (param: any) => {
              const { component: formComponent, dataField } = param;

              return (
                <UploadField
                  field={field}
                  formInstance={formComponent}
                  onValueChanged={(files: any) => {
                    formComponent.updateData(
                      field?.ColCodeSys,
                      files?.map((item: any) => {
                        return {
                          ...item,
                          FileType: revertEncodeFileType(item?.FileType),
                        };
                      })
                    );
                  }}
                  readonly={customOptions?.editType == "detail"}
                />
              );
            },
          };
        })
        .with("DATE", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,

            dataField: field?.ColCodeSys,
            render: (param: any) => {
              return (
                <DateField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                  editType={customOptions?.editType}
                />
              );
            },
          };
        })
        .with("BIRTHDAY", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,

            dataField: field?.ColCodeSys,
            render: (param: any) => {
              return (
                <BirthDayField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                  editType={customOptions?.editType}
                />
              );
            },
          };
        })
        .with("DATETIME", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,

            dataField: field?.ColCodeSys,
            render: (param: any) => {
              return (
                <DateTimeField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                  editType={customOptions?.editType}
                />
              );
            },
          };
        })
        .with("FLAG", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            OrderIdx: field?.OrderIdx,

            render: (param: any) => {
              return (
                <FlagField
                  param={param}
                  customOptions={customOptions}
                  field={field}
                />
              );
            },
          };
        })
        .with("CREATEBY", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            OrderIdx: field?.OrderIdx,

            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            dataField: field?.ColCodeSys,
            render: (param: any) => {
              return (
                <CreateByField param={param} customOptions={customOptions} />
              );
            },
          };
        })
        .with("CREATEDTIMEUTC", () => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,

            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            OrderIdx: field?.OrderIdx,

            validationRules:
              customOptions?.editType == "detail"
                ? []
                : mapValidationRules(field),
            validationMessagePosition: "bottom",
            dataField: field?.ColCodeSys,
            render: (param: any) => {
              return (
                <CreateDTimeUTCField
                  param={param}
                  customOptions={customOptions}
                />
              );
            },
          };
        })
        .otherwise(() => {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,
            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            OrderIdx: field?.OrderIdx,

            dataField: field?.ColCodeSys,
            render: (param: any) => {
              const { component, formData } = param;

              return (
                <div className="font-semibold">
                  {formData[field?.ColCodeSys] ?? "---"}
                </div>
              );
            },
          };
        });
    });
  }

  const mappingColDataType = mappingByColCodeSys?.map((field: any) => {
    return match(field?.ColDataType)
      .with("CUSTOMERCODEINVOICE", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          OrderIdx: field?.OrderIdx,

          dataField: field?.ColCodeSys,
          render: (param: any) => {
            const { component, formData } = param;
            return (
              <CustomerCodeInvoiceField
                field={field}
                component={component}
                formData={formData}
                editType={customOptions?.editType}
              />
            );
          },
        };
      })
      .with("SELECTMULTIPLESELECTBOX", () => {
        const currentValue = listDynamic[`${field?.ColCodeSys}`] ?? [];

        const options = JSON.parse(field.mdmc_JsonListOption || "[]");

        const filterdOptions = currentValue
          ? options?.map((item: any) => {
              if (currentValue?.find((c: any) => c == item?.Value)) {
                return {
                  ...item,
                  IsSelected: true,
                };
              } else {
                return {
                  ...item,
                  IsSelected: false,
                };
              }
            })
          : options;

        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          itemType: "group",
          ColCodeSys: field?.ColCodeSys,
          dataField: field?.ColCodeSys,
          label: {
            text: field.ColCaption,
          },
          OrderIdx: field?.OrderIdx,

          render: (param: any) => {
            const { component, formData } = param;
            // init data
            component.updateData(
              field?.ColCodeSys,
              filterdOptions
                .filter((opt: any) => opt.IsSelected)
                .map((opt: any) => opt.Value)
            );
            return (
              <MultiSelectBox
                field={field}
                component={component}
                formData={formData}
                editType={customOptions?.editType}
                listOption={filterdOptions}
              />
            );
          },
        };
      })
      .with("CountryCodeContact", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,
          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,
          render: (param: any) => {
            return (
              <CountryContactField
                param={param}
                customOptions={customOptions}
                field={field}
              />
            );
          },
        };
      })
      .with("ProvinceCodeContact", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,
          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,
          render: (param: any) => {
            return (
              <ProvinceContactField
                param={param}
                customOptions={customOptions}
                field={field}
              />
            );
          },
        };
      })
      .with("DistrictCodeContact", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,
          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,
          render: (param: any) => {
            return (
              <DistrictContactField
                param={param}
                customOptions={customOptions}
                field={field}
              />
            );
          },
        };
      })
      .with("WardCodeContact", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,
          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,
          render: (param: any) => {
            return (
              <WardContactField
                param={param}
                customOptions={customOptions}
                field={field}
              />
            );
          },
        };
      })

      .with("CountryCodeDelivery", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,
          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,
          render: (param: any) => {
            return (
              <CountryDeliveryField
                param={param}
                customOptions={customOptions}
                field={field}
              />
            );
          },
        };
      })
      .with("ProvinceCodeDelivery", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,
          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,
          render: (param: any) => {
            return (
              <ProvinceDeliveryField
                param={param}
                customOptions={customOptions}
                field={field}
              />
            );
          },
        };
      })
      .with("DistrictCodeDelivery", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,
          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,
          render: (param: any) => {
            return (
              <DistrictDeliveryField
                param={param}
                customOptions={customOptions}
                field={field}
              />
            );
          },
        };
      })
      .with("WardCodeDelivery", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,
          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,
          render: (param: any) => {
            return (
              <WardDeliveryField
                param={param}
                customOptions={customOptions}
                field={field}
              />
            );
          },
        };
      })
      .with("CountryCodeInvoice", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,
          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,
          render: (param: any) => {
            return (
              <CountryInvoiceField
                param={param}
                customOptions={customOptions}
                field={field}
              />
            );
          },
        };
      })
      .with("ProvinceCodeInvoice", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,
          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,
          render: (param: any) => {
            return (
              <ProvinceInvoiceField
                param={param}
                customOptions={customOptions}
                field={field}
              />
            );
          },
        };
      })
      .with("DistrictCodeInvoice", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,
          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,
          render: (param: any) => {
            return (
              <DistrictInvoiceField
                param={param}
                customOptions={customOptions}
                field={field}
              />
            );
          },
        };
      })
      .with("WardCodeInvoice", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,
          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,
          render: (param: any) => {
            return (
              <WardInvoiceField
                param={param}
                customOptions={customOptions}
                field={field}
              />
            );
          },
        };
      })

      .with("USERMANAGER", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,
          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,
          render: (param: any) => {
            return (
              <UserManagerField param={param} customOptions={customOptions} />
            );
          },
        };
      })
      .with("CUSTOMERTYPE", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,

          dataField: field?.ColCodeSys,
          render: (param: any) => {
            return (
              <CustomerTypeField param={param} customOptions={customOptions} />
            );
          },
        };
      })

      .with("PURCHASE", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,
          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,

          dataField: field?.ColCodeSys,
          render: (param: any) => {
            return (
              <PurchaseField
                param={param}
                customOptions={customOptions}
                field={field}
              />
            );
          },
        };
      })

      .with("SALE", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,

          dataField: field?.ColCodeSys,
          render: (param: any) => {
            return (
              <SaleField
                param={param}
                customOptions={customOptions}
                field={field}
              />
            );
          },
        };
      })

      .with("CUSTOMERGROUP", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,

          dataField: field?.ColCodeSys,
          render: (param: any) => {
            return (
              <CustomerGroupField param={param} customOptions={customOptions} />
            );
          },
        };
      })
      .with("PARTNERTYPE", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,

          dataField: field?.ColCodeSys,
          render: (param: any) => {
            return (
              <PartnerTypeField param={param} customOptions={customOptions} />
            );
          },
        };
      })
      .with("CUSTOMERCODESYSERP", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,
          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,

          dataField: field?.ColCodeSys,
          render: (param: any) => {
            return (
              <CustomerCodeSysERPField
                param={param}
                customOptions={customOptions}
              />
            );
          },
        };
      })
      .with("EMAIL", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          OrderIdx: field?.OrderIdx,

          dataField: field?.ColCodeSys,
          render: (param: any) => {
            const { component, formData } = param;
            return (
              <EmailField
                field={field}
                component={component}
                formData={formData}
                editType={customOptions?.editType}
              />
            );
          },
        };
      })
      .with("GOVID", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          OrderIdx: field?.OrderIdx,
          validationRules:
            customOptions?.editType == "detail"
              ? []
              : mapValidationRules(field),
          validationMessagePosition: "bottom",
          dataField: field?.ColCodeSys,
          render: (param: any) => {
            const { component, formData } = param;
            return (
              <GovIDField
                field={field}
                component={component}
                formData={formData}
                editType={customOptions?.editType}
              />
            );
          },
        };
      })
      .with("TEXTAREA", () => {
        if (customOptions?.editType == "detail") {
          return {
            FlagIsColDynamic: field.FlagIsColDynamic,
            ColDataType: field.ColDataType,
            groupKeys: field.ColGrpCodeSys,
            ColCodeSys: field?.ColCodeSys,
            itemType: "group",
            label: {
              text: field.ColCaption,
            },
            validationRules: mapValidationRules(field),
            validationMessagePosition: "bottom",
            OrderIdx: field?.OrderIdx,

            dataField: field?.ColCodeSys,
            render: (param: any) => {
              const { component, formData } = param;

              return (
                <div className="font-semibold">
                  {formData[field?.ColCodeSys] ?? ""}
                </div>
              );
            },
          };
        }
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          groupKeys: field.ColGrpCodeSys,
          dataField: field?.ColCodeSys,
          editorType: "dxTextArea",
          ColCodeSys: field?.ColCodeSys,
          ColDataType: field.ColDataType,
          label: {
            text: field.ColCaption,
          },
          validationMessagePosition: "bottom",
          editorOptions: mapEditorOption({
            field: field,
            listDynamic: listDynamic ?? {},
            customOption: customOptions ?? {},
            translate: translate,
          }),
          OrderIdx: field?.OrderIdx,

          validationRules: mapValidationRules(field),
          ...mapCustomOptions(field),
        };
      })
      .with("ZALOUSERFOLLOWER", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          dataField: field?.ColCodeSys,
          render: (param: any) => {
            const { component, formData } = param;
            return (
              <ZaloField
                field={field}
                component={component}
                formData={formData}
                editType={customOptions?.editType}
              />
            );
          },
        };
      })
      .with("PHONE", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          OrderIdx: field?.OrderIdx,
          validationRules:
            customOptions?.editType == "detail"
              ? []
              : mapValidationRules(field),
          validationMessagePosition: "bottom",
          dataField: field?.ColCodeSys,
          render: (param: any) => {
            const { component, formData } = param;
            return (
              <PhoneField
                field={field}
                component={component}
                formData={formData}
                editType={customOptions?.editType}
              />
            );
          },
        };
      })
      .with("CUSTOMIZEPHONE", () => {
        const options = JSON.parse(field?.mdmc_JsonListOption) ?? [];

        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,
          OrderIdx: field?.OrderIdx,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },

          dataField: field?.ColCodeSys,
          render: (param: any) => {
            const { component, formData } = param;
            return <CustomizePhoneField param={param} options={options} />;
          },
        };
      })
      .with("IMAGE", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          OrderIdx: field?.OrderIdx,

          dataField: field?.ColCodeSys,
          render: (param: any) => {
            const { component, formData } = param;
            return (
              <AvatarField
                field={field}
                component={component}
                formData={formData}
                editType={customOptions?.editType}
              />
            );
          },
        };
      })
      .with("FILE", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          OrderIdx: field?.OrderIdx,

          dataField: field?.ColCodeSys,
          render: (param: any) => {
            const { component: formComponent, dataField } = param;

            return (
              <UploadField
                field={field}
                formInstance={formComponent}
                onValueChanged={(files: any) => {
                  formComponent.updateData(
                    field?.ColCodeSys,
                    files?.map((item: any) => {
                      return {
                        ...item,
                        FileType: revertEncodeFileType(item?.FileType),
                      };
                    })
                  );
                }}
                readonly={customOptions?.editType == "detail"}
              />
            );
          },
        };
      })
      .with("DATE", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,

          dataField: field?.ColCodeSys,
          render: (param: any) => {
            return (
              <DateField
                param={param}
                customOptions={customOptions}
                field={field}
                editType={customOptions?.editType}
              />
            );
          },
        };
      })
      .with("BIRTHDAY", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules:
            customOptions?.editType == "detail"
              ? []
              : mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,

          dataField: field?.ColCodeSys,
          render: (param: any) => {
            return (
              <BirthDayField
                param={param}
                customOptions={customOptions}
                field={field}
                editType={customOptions?.editType}
              />
            );
          },
        };
      })
      .with("DATETIME", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          OrderIdx: field?.OrderIdx,

          dataField: field?.ColCodeSys,
          render: (param: any) => {
            return (
              <DateTimeField
                param={param}
                customOptions={customOptions}
                field={field}
                editType={customOptions?.editType}
              />
            );
          },
        };
      })
      .with("FLAG", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          OrderIdx: field?.OrderIdx,

          render: (param: any) => {
            return (
              <FlagField
                param={param}
                customOptions={customOptions}
                field={field}
              />
            );
          },
        };
      })
      .with("CREATEBY", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          OrderIdx: field?.OrderIdx,

          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          dataField: field?.ColCodeSys,
          render: (param: any) => {
            return (
              <CreateByField param={param} customOptions={customOptions} />
            );
          },
        };
      })
      .with("CREATEDTIMEUTC", () => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          ColDataType: field.ColDataType,
          groupKeys: field.ColGrpCodeSys,
          ColCodeSys: field?.ColCodeSys,

          itemType: "group",
          label: {
            text: field.ColCaption,
          },
          OrderIdx: field?.OrderIdx,

          validationRules: mapValidationRules(field),
          validationMessagePosition: "bottom",
          dataField: field?.ColCodeSys,
          render: (param: any) => {
            return (
              <CreateDTimeUTCField
                param={param}
                customOptions={customOptions}
              />
            );
          },
        };
      })
      .otherwise(() => {
        return {
          FlagIsColDynamic: field.FlagIsColDynamic,
          groupKeys: field.ColGrpCodeSys,
          dataField: field?.ColCodeSys,
          editorType: mapEditorType(field.ColDataType!),
          ColCodeSys: field?.ColCodeSys,
          ColDataType: field.ColDataType,
          label: {
            text: field.ColCaption,
          },
          validationMessagePosition: "bottom",
          editorOptions: mapEditorOption({
            field: field,
            listDynamic: listDynamic ?? {},
            customOption: customOptions ?? {},
            defaultValue: defaultValue ?? {},
            translate: translate,
          }),
          OrderIdx: field?.OrderIdx,

          validationRules: mapValidationRules(field),
          ...mapCustomOptions(field, customOptions),
        };
      });
  });

  return mappingColDataType;
};

export const FileUploadCustom = (props: any) => {
  const { data } = props;
  const { headers, baseURL } = useApiHeaders();
  const [isUploading, setIsUploading] = useState(false);

  const api = useClientgateApi();
  const handleUploadFile = async (file: File, callback: any) => {
    const resp = await api.File_UploadFile(file);
    if (resp.isSuccess) {
      const obj = {
        FileSize: resp.Data?.FileSize ?? "",
        FileType: resp.Data?.FileType ?? "",
        FileUrlFS: resp.Data?.FileUrlFS ?? "",
        FileFullName: resp.Data?.FileFullName ?? "",
        FileUrlLocal: resp.Data?.FileUrlLocal ?? "",
      };
      data.setValue(obj);
    }
  };

  return (
    <FileUploader
      ref={null}
      selectButtonText="Select FILE"
      labelText=""
      uploadMode={"instantly"}
      multiple={false}
      name={"file"}
      uploadHeaders={{
        ...headers,
        "Content-Type": "multipart/form-data",
      }}
      uploadUrl={`${baseURL}/File/UploadFile`}
      disabled={isUploading}
      uploadFile={handleUploadFile}
    />
  );
};
