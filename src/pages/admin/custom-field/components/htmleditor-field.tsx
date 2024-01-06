import { HtmlEditor } from "devextreme-react";
import { Item, Toolbar } from "devextreme-react/html-editor";
import "./edit-form.scss";

interface TextboxFieldProps {
  field: any;
  label: string;
  error?: any;
  required?: boolean;
  disabled?: boolean;
  direction?: string;
}

export const HtmlEditorField = ({
  field,
  label,
  required = false,
  error,
  disabled,
  direction,
}: TextboxFieldProps) => {
  const { onChange, ref, ...rest } = field;

  return (
    <div
      className={`my-[6px] flex ${
        direction == "vertical" ? "flex-col" : "items-start"
      }  ${required ? "required" : ""} ${!!error ? "mb-4" : ""}`}
    >
      <label
        className={`${
          direction == "vertical"
            ? "w-full"
            : "w-[160px] min-w-[160px] pr-[10px]"
        } break-all`}
      >
        {label}
      </label>

      <HtmlEditor
        defaultValue={rest.value}
        className="min-w-[500px] w-full"
        height={200}
        // toolbar={
        //   {
        //     container: undefined,
        //     items: [
        //       "bold",
        //       "italic",
        //       "color",
        //       "background",
        //       "link",
        //       {
        //         name: "header",
        //         acceptedValues: [1, 2, 3, false],
        //         options: { hint: "Custom bold" },
        //       },
        //     ],
        //     multiline: true,
        //   }
        // }

        onValueChanged={async (e: any) => {
          await onChange({
            target: {
              name: rest.name,
              value: e.value,
            },
          });
        }}
      >
        <Toolbar>
          <Item name="bold" />
          <Item name="italic" />
          <Item name="strike" />
          <Item name="underline" />
          <Item name="alignLeft" />
          <Item name="alignCenter" />
          <Item name="alignRight" />
          <Item name="alignJustify" />
        </Toolbar>
      </HtmlEditor>
    </div>
  );
};
