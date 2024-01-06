import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useQuery } from "@tanstack/react-query";
import { ScrollView } from "devextreme-react";
import HtmlEditor, {
  Toolbar,
  MediaResizing,
  ImageUpload,
  Item,
} from "devextreme-react/html-editor";
import React, { useRef } from "react";

export default function Zalo_UserID({ formRef, markup }: any) {
  const { t } = useI18n("Content_Managent");
  const editorRef = useRef<any>();
  const cursorPositionRef = useRef<any>(0);
  const sizeValues = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"];
  const fontValues = [
    "Arial",
    "Courier New",
    "Georgia",
    "Impact",
    "Lucida Console",
    "Tahoma",
    "Times New Roman",
    "Verdana",
  ];
  const headerValues = [false, 1, 2, 3, 4, 5];
  //defaultValue={""}
  const api = useClientgateApi();
  const { data: listMst_BizColumn } = useQuery(["Mst_BizColumn"], () =>
    api.Mst_BizColumn_GetAllActive()
  );

  const onFocusOut = (e: any) => {
    cursorPositionRef.current = e.component.getSelection();
  };

  const handleCLick = (item: any) => {
    editorRef.current.instance.insertText(
      cursorPositionRef.current.index,
      `$\{{${item.BizCol}\}}`
    );
  };
  const numberTextRef = useRef<any>(0);
  const handleValueChange = (e: any) => {
    const text = e.value;
    const count = text
      .replace(/\$\{\{.*?\}\}/g, "")
      .replace(/<.*?>/g, "").length;
    numberTextRef.current?.setHTML(count);

    formRef.current.instance.updateData(
      "MessageZalo",
      e.value.replace(/<.*?>/g, "")
    );
  };

  return (
    <div className="flex px-5 mt-6">
      <div className="w-[61%]">
        <div className="flex justify-between pb-[15px] w-[81%]">
          <div className="">{t("Message Content")}</div>
          <div className="flex items-center justify-center w-[180px]">
            <div className="mr-1">{t("Number of characters:")}</div>
            <label ref={numberTextRef}>
              {markup?.Lst_Mst_SubmissionFormMessage[0]?.Message.replace(
                /\$\{\{.*?\}\}/g,
                ""
              ).replace(/<.*?>/g, "").length || 0}
            </label>
          </div>
        </div>
        <HtmlEditor
          id="Zalo_HTML"
          activeStateEnabled={true}
          isValid={true}
          height="300px"
          width={"80%"}
          className="htmlEditor_Content_SMS"
          defaultValue={markup?.Lst_Mst_SubmissionFormMessage[0]?.Message || ""}
          ref={editorRef}
          onFocusOut={onFocusOut}
          onValueChanged={handleValueChange}
          onInitialized={(e) => {
            let htmlEditor = e.component;
            const Clipboard = htmlEditor?.get("modules/clipboard");
            class ExtendedClipboard extends Clipboard {
              constructor(quill: any, options: any) {
                quill.root.addEventListener("paste", (args: any) => {
                  const pastedData =
                    args.clipboardData.types.indexOf("Files") > -1;
                  const regex =
                    /^[a-zA-Z0-9@  `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]+$/;

                  if (
                    pastedData &&
                    editorRef.current.props.id === "Zalo_HTML"
                  ) {
                    // cancel on demand;
                    args.preventDefault();
                  }
                });
                super(quill, options);
              }
            }

            const Uploader = htmlEditor?.get("modules/uploader");

            class ExtendedUploader extends Uploader {
              constructor(quill: any, options: any) {
                quill.root.addEventListener("drop", (args: any) => {
                  // console.log("custom_drop");
                  // cancel on demand;
                  args.stopImmediatePropagation();
                  args.preventDefault();
                });
                super(quill, options);
                // console.log("create_uploader");
              }
            }

            htmlEditor?.register({
              "modules/clipboard": ExtendedClipboard,
              "modules/uploader": ExtendedUploader,
            });
          }}
        >
          {/* <MediaResizing enabled={true} /> */}
          {/* <ImageUpload tabs={["file"]} fileUploadMode="base64" />
          <Toolbar multiline={false}>
            <Item name="undo" cssClass="itemHTML" />
            <Item name="redo" cssClass="itemHTML" />
            <Item name="separator" cssClass="itemHTML" />
            <Item name="size" acceptedValues={sizeValues} cssClass="itemHTML" />
            <Item name="font" acceptedValues={fontValues} cssClass="itemHTML" />
            <Item name="separator" cssClass="itemHTML" />
            <Item name="bold" cssClass="itemHTML" />
            <Item name="italic" cssClass="itemHTML" />
            <Item name="strike" cssClass="itemHTML" />
            <Item name="underline" cssClass="itemHTML" />
            <Item name="separator" cssClass="itemHTML" />
            <Item name="alignLeft" cssClass="itemHTML" />
            <Item name="alignCenter" cssClass="itemHTML" />
            <Item name="alignRight" cssClass="itemHTML" />
            <Item name="alignJustify" cssClass="itemHTML" />
            <Item name="separator" cssClass="itemHTML" />
            <Item name="orderedList" cssClass="itemHTML" />
            <Item name="bulletList" cssClass="itemHTML" />
            <Item name="separator" cssClass="itemHTML" />
            <Item
              name="header"
              cssClass="itemHTML"
              acceptedValues={headerValues}
            />
            <Item name="separator" cssClass="itemHTML" />
            <Item name="color" cssClass="itemHTML" />
            <Item name="background" cssClass="itemHTML" />
            <Item name="separator" cssClass="itemHTML" />
            <Item name="link" cssClass="itemHTML" />
            <Item name="image" cssClass="itemHTML" />
            <Item name="separator" cssClass="itemHTML" />
            <Item name="clear" cssClass="itemHTML" />
            <Item name="codeBlock" cssClass="itemHTML" />
            <Item name="blockquote" cssClass="itemHTML" />
            <Item name="separator" cssClass="itemHTML" />
            <Item name="insertTable" cssClass="itemHTML" />
            <Item name="deleteTable" cssClass="itemHTML" />
            <Item name="insertRowAbove" cssClass="itemHTML" />
            <Item name="insertRowBelow" cssClass="itemHTML" />
            <Item name="deleteRow" cssClass="itemHTML" />
            <Item name="insertColumnLeft" cssClass="itemHTML" />
            <Item name="insertColumnRight" cssClass="itemHTML" />
            <Item name="deleteColumn" cssClass="itemHTML" />
          </Toolbar> */}
        </HtmlEditor>
      </div>
      <div className="w-[420px]">
        <div className="mb-[15px] text-center">{t("System Parameters")}</div>
        <div className="flex pl-1 items-center mb-2">
          <div className="font-bold w-[50%] pl-2 underline">
            {t("Describe")}
          </div>
          <div className="font-bold w-[50%] pl-[6px] underline">
            {t("Parameters")}
          </div>
        </div>
        <div className="border pl-1 max-h-[300px] overflow-hidden">
          <ScrollView height={300} showScrollbar="always">
            <div>
              {listMst_BizColumn?.DataList?.map((item: any, index: any) => {
                return (
                  <div
                    key={index}
                    className="flex hover:text-red-500 items-center cursor-pointer"
                    onClick={() => handleCLick(item)}
                  >
                    <div className="hover:text-red-500 pl-2 cursor-pointer py-[4px] w-[50%] font-bold">
                      {`$\{{${item.BizCol}\}}`}
                    </div>
                    <div className="hover:text-red-500 pl-1 cursor-pointer py-[4px] w-[50%] font-bold">{`${item.BizColName}`}</div>
                  </div>
                );
              })}
            </div>
          </ScrollView>
        </div>
      </div>
    </div>
  );
}
