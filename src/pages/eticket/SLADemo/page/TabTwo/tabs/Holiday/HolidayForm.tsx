import { useI18n } from "@/i18n/useI18n";
import { Button, Form } from "devextreme-react";
import { Item } from "devextreme-react/form";
import { nanoid } from "nanoid";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

import "./style.scss";

const HolidayForm = ({ control, setValue, watch }: any) => {
  const { t: placeholder } = useI18n("SLA_Holiday_Placeholder");

  const { t: toastTranslate } = useI18n("SLA_Holiday_Notify");

  const { t: buttonTranslate } = useI18n("SLA_Holiday_Button");

  const defaultFormValue = {
    id: nanoid(),
    Month: undefined,
    Day: undefined,
    Event: undefined,
  };

  const [formValue, setFormValue] = useState<any>(defaultFormValue);

  const [dayList, setDayList] = useState<any>([]);

  const holidayList = watch("Lst_Mst_SLAHoliday");

  const listMonth = Array.from({ length: 12 }, (v: any, i: any) => {
    return i + 1;
  });

  const maxDayOfMonth = (month: any) => {
    return new Date(2000, month, 0).getDate();
  };

  const generateDay = () => {
    if (formValue.Day > maxDayOfMonth(formValue.Month)) {
      setFormValue({ ...formValue, Day: undefined });
    }
    return Array.from(
      { length: maxDayOfMonth(formValue.Month) },
      (v: any, i: any) => {
        return i + 1;
      }
    );
  };

  const formRef: any = useRef(null);

  const handleAdd = () => {
    if (formRef.current.instance.validate().isValid) {
      if (
        holidayList.some(
          (item: any) =>
            item?.Day == formValue?.Day && item?.Month == formValue?.Month
        )
      ) {
        toast.error(toastTranslate("The date you selected already exists!"));
        return;
      }
      setValue("Lst_Mst_SLAHoliday", [
        ...holidayList,
        {
          ...formValue,
          id: nanoid(),
        },
      ]);
      setFormValue(defaultFormValue);
    }
  };

  return (
    <Form
      className="flex items-center mt-3 form-holiday"
      formData={formValue}
      colCount={4}
      labelMode="hidden"
      ref={formRef}
      onFieldDataChanged={({ dataField, value }: any) => {
        setFormValue({ ...formValue, [dataField]: value });
        if (dataField === "Month") {
          setDayList(generateDay());
        }
      }}
    >
      <Item
        editorType="dxSelectBox"
        editorOptions={{
          dataSource: listMonth,
          placeholder: placeholder("Month"),
        }}
        dataField="Month"
        validationRules={[
          {
            type: "required",
          },
        ]}
        name="Month"
      />
      <Item
        editorType="dxSelectBox"
        editorOptions={{
          placeholder: placeholder("Day"),
          dataSource: dayList,
        }}
        dataField="Day"
        name="Day"
        validationRules={[
          {
            type: "required",
          },
        ]}
      />
      <Item
        editorType="dxTextBox"
        editorOptions={{
          placeholder: placeholder("Event"),
        }}
        dataField="Event"
        cssClass="flex-grow"
        name="Event"
        validationRules={[
          {
            type: "required",
          },
        ]}
      />
      <Item
        render={() => (
          <Button
            onClick={handleAdd}
            style={{ padding: 10, background: "green", color: "white" }}
          >
            {buttonTranslate("Add")}
          </Button>
        )}
      />
    </Form>
  );
};

export default HolidayForm;
