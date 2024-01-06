import { useI18n } from "@/i18n/useI18n";
import { requiredType } from "@/packages/common/Validation_Rules";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { Button, Form } from "devextreme-react";
import { GroupItem, Item, SimpleItem } from "devextreme-react/form";
import TreeView from "devextreme-react/tree-view";
import { useCallback, useRef } from "react";

import PermissionContainer, {
  checkPermision,
} from "@/components/PermissionContainer";
import { revertEncodeFileType } from "@/components/ulti";
import { useClientgateApi } from "@/packages/api";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { authAtom, showErrorAtom } from "@/packages/store";
import { UploadFilesField } from "@/pages/admin/test-upload/upload-field";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import HtmlEditor, {
  ImageUpload,
  Item as ItemEditor,
  MediaResizing,
  Toolbar,
} from "devextreme-react/html-editor";
import { useAtomValue, useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { currentInfo, refechAtom } from "../store";
import { transformCategory } from "./FormatCategory";
import TagboxCustom from "./TagboxCustom";

export default function Post_add() {
  const { t } = useI18n("Post_Manager_add");
  const formData = useAtomValue(currentInfo);
  const api = useClientgateApi();
  const validateRef = useRef<any>();
  const formRef = useRef<any>();
  const formRef2 = useRef<any>();
  const treeViewRef = useRef<any>();
  const auth = useAtomValue(authAtom);
  const showError = useSetAtom(showErrorAtom);
  const setRefech = useSetAtom(refechAtom);
  const queryClient = useQueryClient();
  const PostStatus = [
    { text: t("Published"), valuePost: "PUBLISHED" },
    { text: t("Draft"), valuePost: "DRAFT" },
  ];
  const shareType = [
    { text: t("Organization"), valueShare: "ORGANIZATION" },
    { text: t("Network"), valueShare: "NETWORK" },
    { text: t("Private"), valueShare: "PRIVATE" },
  ];
  const navigate = useNavigate();

  const { data: dataTagbox, refetch } = useQuery(["dataTagbox"], () =>
    api.Mst_Tag_GetAllActive()
  );
  const { data: dataCategory } = useQuery(["dataCategory"], () =>
    api.KB_Category_GetAllActive()
  );
  const handleAddNew = async () => {
    validateRef.current.instance.validate();
    formRef2.current.instance.validate();
    const formData = validateRef.current.instance.option("formData");
    // console.log(formData?.UploadFiles);
    const formData2 = formRef2.current.instance.option("formData");
    const resp = await api.Mst_Tag_GetAllActive();
    const newTag = resp?.Data?.Lst_Mst_Tag?.filter((item: any) =>
      formData2?.Tags?.includes(item?.TagName)
    );
    const dataSave = {
      KB_Post: {
        PostCode: "",
        OrgID: auth.orgId.toString(),
        Detail: formData.Detail ?? "",
        Title: formData.Title ?? "",
        Synopsis: formData.Synopsis ?? "",
        ShareType: formData2.ShareType ? formData2.ShareType : "ORGANIZATION",
        PostStatus: formData2.PostStatus ? formData2.PostStatus : "PUBLISHED",
        FlagShare: "1",
      },
      Lst_KB_PostCategory: formData2?.Category
        ? formData2?.Category.map((item: any) => ({
            CategoryCode: item?.CategoryCode ?? "",
          }))
        : [],
      Lst_KB_PostTag: newTag
        ? newTag?.map((item: any) => ({
            TagID: item.TagID,
          }))
        : [],
      Lst_KB_PostAttachFile: formData?.UploadFiles
        ? formData?.UploadFiles.map((item: any, index: any) => ({
            Idx: index,
            FileName: item.FileFullName ?? "",
            FilePath: item.FileUrlFS ?? "",
            FileType: revertEncodeFileType(item.FileType),
          }))
        : [],
    };

    if (
      dataSave.Lst_KB_PostCategory.length !== 0 &&
      dataSave.KB_Post.Detail !== "" &&
      dataSave.KB_Post.Title !== ""
    ) {
      const respDataSave = await api.KB_PostData_Create(dataSave);
      if (respDataSave.isSuccess) {
        queryClient.refetchQueries({ queryKey: ["listPost"], exact: true });
        toast.success(t("Create Successfully"));
        setRefech(true);
        navigate(`/${auth.networkId}/admin/Post_Manager`);
        // await refetch();
        return true;
      }
      showError({
        message: resp._strErrCode,
        _strErrCode: resp._strErrCode,
        _strTId: resp._strTId,
        _strAppTId: resp._strAppTId,
        _objTTime: resp._objTTime,
        _strType: resp._strType,
        _dicDebug: resp._dicDebug,
        _dicExcs: resp._dicExcs,
      });
      throw new Error(resp._strErrCode);
    } else if (dataSave.KB_Post.Detail === "") {
      toast.error(t("Chi tiết bài viết không được để trống!"));
    } else if (dataSave.Lst_KB_PostCategory?.length === 0) {
      toast.error(t("Danh mục không được để trống!"));
    }
  };
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
  const formSettings: any = [
    {
      colCount: 1,
      labelLocation: "left",
      typeForm: "textForm",
      hidden: false,
      items: [
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 1,
          cssClass: "",
          items: [
            {
              dataField: "Title",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: { text: t("Title") },
              editorType: "dxTextBox",
              caption: t("Title"),
              visible: true,
              validationRules: [requiredType],
            },
            {
              dataField: "Detail",
              label: { text: t("Detail") },
              editorOptions: {},
              render: (param: any) => {
                const { component: formComponent, dataField } = param;
                return (
                  <HtmlEditor
                    height="340px"
                    // defaultValue={markup}
                    valueType={"html"}
                    onValueChanged={(e) => {
                      formComponent.updateData(dataField, e.value);
                    }}
                  >
                    <MediaResizing enabled={true} />
                    <ImageUpload fileUploadMode="base64" />
                    <Toolbar

                    // multiline={this.state.isMultiline}
                    >
                      <ItemEditor cssClass="itemHTML" name="undo" />
                      <ItemEditor cssClass="itemHTML" name="redo" />
                      <ItemEditor cssClass="itemHTML" name="separator" />
                      <ItemEditor
                        cssClass="itemHTML"
                        name="size"
                        acceptedValues={sizeValues}
                      />
                      <ItemEditor
                        cssClass="itemHTML"
                        name="font"
                        acceptedValues={fontValues}
                      />
                      <ItemEditor cssClass="itemHTML" name="separator" />
                      <ItemEditor cssClass="itemHTML" name="bold" />
                      <ItemEditor cssClass="itemHTML" name="italic" />
                      <ItemEditor cssClass="itemHTML" name="strike" />
                      <ItemEditor cssClass="itemHTML" name="underline" />
                      <ItemEditor cssClass="itemHTML" name="separator" />
                      <ItemEditor cssClass="itemHTML" name="alignLeft" />
                      <ItemEditor cssClass="itemHTML" name="alignCenter" />
                      <ItemEditor cssClass="itemHTML" name="alignRight" />
                      <ItemEditor cssClass="itemHTML" name="alignJustify" />
                      <ItemEditor cssClass="itemHTML" name="separator" />
                      <ItemEditor cssClass="itemHTML" name="orderedList" />
                      <ItemEditor cssClass="itemHTML" name="bulletList" />
                      <ItemEditor cssClass="itemHTML" name="separator" />
                      {/* <Item name="header" acceptedValues={headerValues} /> */}
                      <ItemEditor cssClass="itemHTML" name="separator" />
                      <ItemEditor cssClass="itemHTML" name="color" />
                      <ItemEditor cssClass="itemHTML" name="background" />
                      <ItemEditor cssClass="itemHTML" name="separator" />
                      <ItemEditor cssClass="itemHTML" name="link" />
                      <ItemEditor cssClass="itemHTML" name="image" />
                      <Item name="separator" />
                      <ItemEditor cssClass="itemHTML" name="clear" />
                      <ItemEditor cssClass="itemHTML" name="codeBlock" />
                      <ItemEditor cssClass="itemHTML" name="blockquote" />
                      <ItemEditor cssClass="itemHTML" name="separator" />
                      <ItemEditor cssClass="itemHTML" name="insertTable" />
                      <ItemEditor cssClass="itemHTML" name="deleteTable" />
                      <ItemEditor cssClass="itemHTML" name="insertRowAbove" />
                      <ItemEditor cssClass="itemHTML" name="insertRowBelow" />
                      <ItemEditor cssClass="itemHTML" name="deleteRow" />
                      <ItemEditor cssClass="itemHTML" name="insertColumnLeft" />
                      <ItemEditor
                        cssClass="itemHTML"
                        name="insertColumnRight"
                      />
                      <ItemEditor cssClass="itemHTML" name="deleteColumn" />
                    </Toolbar>
                  </HtmlEditor>
                );
              },
              caption: t("Detail"),
              visible: true,
              validationRules: [requiredType],
            },
            {
              dataField: "UploadFiles", // file đính kèm
              caption: t("UploadFiles"),
              colSpan: 2,
              label: {
                location: "left",
                text: t("UploadFiles"),
              },
              editorOptions: {
                readOnly: true,
              },
              render: (paramValue: any) => {
                const { component: formComponent, dataField } = paramValue;
                return (
                  <UploadFilesField
                    formInstance={formComponent}
                    readonly={false}
                    controlFileInput={[
                      "DOCX",
                      "PDF",
                      "JPG",
                      "JPEG",
                      "PNG",
                      "XLSX",
                      "DOC",
                      "ZIP",
                      "RAR",
                      "GIF",
                      "BMP",
                      "PPT",
                      "PPTX",
                    ]}
                    onValueChanged={(files: any) => {
                      formComponent.updateData(dataField, files);
                    }}
                  />
                );
              },
              visible: checkPermision("BTN_ADMIN_POST_MANAGER_ATTACH_ADD")
                ? true
                : false,
            },
            {
              dataField: "Synopsis",
              editorOptions: {
                readOnly: false,
                placeholder: t("Input"),
                height: 70,
                maxLength: 120,
              },
              label: { text: t("Synopsis") },
              editorType: "dxTextArea",
              caption: t("Synopsis"),
              visible: true,
            },
          ],
        },
      ],
    },
    {
      colCount: 1,
      labelLocation: "left",
      typeForm: "FormRight",
      hidden: false,
      items: [
        {
          itemType: "group",
          caption: t("BASIC_INFORMATION"),
          colSpan: 1,
          cssClass: "",
          items: [
            {
              dataField: "PostStatus",
              editorOptions: {
                dataSource: PostStatus,
                valueExpr: "valuePost",
                displayExpr: "text",
                placeholder: t("Select"),
              },
              label: { text: t("PostStatus") },
              editorType: "dxSelectBox",
              caption: t("PostStatus"),
              visible: true,
              validationRules: [requiredType],
            },
            {
              dataField: "ShareType",
              editorOptions: {
                placeholder: t("Select"),
                dataSource: shareType,
                valueExpr: "valueShare",
                displayExpr: "text",
              },
              editorType: "dxSelectBox",
              caption: t("ShareType"),
              visible: true,
              validationRules: [requiredType],
              label: { text: t("ShareType") },
            },
            {
              dataField: "Category",
              label: { text: t("Category") },
              editorOptions: {
                placeholder: t("Input Select"),
              },
              validationRules: [requiredType],
              render: (param: any) => {
                const { component: formComponent, dataField } = param;
                return (
                  <TreeView
                    noDataText={t("No data")}
                    id="treeview"
                    displayExpr="CategoryName"
                    ref={treeViewRef}
                    width={"100%"}
                    scrollDirection="vertical"
                    showCheckBoxesMode="normal"
                    selectionMode="multiple"
                    className="max-h-[190px] overflow-y-auto"
                    // onSelectionChanged={(e) => {
                    //   formComponent.updateData("Category", e);
                    // }}
                    items={transformCategory(
                      dataCategory?.Data?.Lst_KB_Category
                    )}
                    onSelectionChanged={(e) => {
                      formComponent.updateData(
                        "Category",
                        e.component
                          .getSelectedNodes()
                          .map((node: any) => node.itemData)
                      );
                    }}
                  />
                );
              },
            },
            {
              dataField: "Tags",
              caption: t("Tags"),
              label: {
                text: t("Tags"),
              },
              visible: true,
              render: (param: any) => {
                const { component: formComponent, dataField } = param;
                return (
                  <TagboxCustom
                    formComponent={formComponent}
                    data={dataTagbox?.Data?.Lst_Mst_Tag}
                  />
                );
              },
            },
          ],
        },
      ],
    },
  ];
  const handleSubmitPopup = useCallback(async (e: any) => {
    validateRef.current.instance.validate();
    const dataForm = new FormData(formRef.current);
    const dataSaveForm: any = Object.fromEntries(dataForm.entries()); // chuyển thành form chính
    // console.log(dataSaveForm);
  }, []);

  const customizeItem = useCallback((item: any) => {
    // if (["OrgID", "CustomerGrpCode"].includes(item.dataField)) {
    // }
    // if (item.dataField === "PostStatus") {
    //   item.editorOptions.value = PostStatus[0].value;
    // }
    // if (item.dataField === "ShareType") {
    //   item.editorOptions.value = shareType[0].value;
    // }
  }, []);
  const customizeItem1 = (item: any) => {
    // if (["OrgID", "CustomerGrpCode"].includes(item.dataField)) {
    // }
    if (item.dataField === "PostStatus") {
      item.editorOptions.value = PostStatus[0].valuePost;
    }
    if (item.dataField === "ShareType") {
      item.editorOptions.value = shareType[0].valueShare;
    }
  };

  const handleFieldDataChanged = (changedData: any) => {
    // Handle the changed field data
  };
  const handleFieldDataChanged1 = (changedData: any) => {
    // Handle the changed field data
  };

  return (
    <AdminContentLayout className={"Post_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderNoSearchLayout>
          <PageHeaderNoSearchLayout.Slot name={"Before"}>
            <div className="flex gap-3 items-center">
              <div
                className="font-bold dx-font-m hover:underline cursor-pointer hover:text-green-600"
                onClick={() => navigate(-1)}
              >
                {t("Post Manager")}
              </div>
              <div className="">{">"}</div>
              <div className="text-header font-bold dx-font-m">
                {t("Post add")}
              </div>
            </div>
          </PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot
            name={"Center"}
          ></PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot name={"After"}>
            <PermissionContainer
              permission={"BTN_ADMIN_CAMPAIGN_POSTMANAGER_CREATE_SAVE"}
              children={
                <Button
                  stylingMode={"contained"}
                  type="default"
                  text={t("Save")}
                  onClick={handleAddNew}
                />
              }
            />
            <PermissionContainer
              permission={"BTN_ADMIN_CAMPAIGN_POSTMANAGER_CREATE_CANCEL"}
              children={
                <Button
                  stylingMode={"contained"}
                  type="default"
                  className="Cancel_Post_Detail"
                  text={t("Cancel")}
                  onClick={() => navigate(-1)}
                />
              }
            />
          </PageHeaderNoSearchLayout.Slot>
        </PageHeaderNoSearchLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div className="flex mx-5 my-2 gap-5 pb-[10px]">
          <div className="w-[65%]">
            <form action="" ref={formRef} onSubmit={handleSubmitPopup}>
              <Form
                className="form_detail_post"
                ref={validateRef}
                validationGroup="PostData"
                onInitialized={(e) => {
                  validateRef.current = e.component;
                }}
                readOnly={false}
                formData={{}}
                labelLocation="left"
                customizeItem={customizeItem}
                onFieldDataChanged={handleFieldDataChanged}
              >
                {formSettings
                  .filter((item: any) => item.typeForm === "textForm")
                  .map((value: any) => {
                    return (
                      <GroupItem colCount={value.colCount}>
                        {value.items.map((items: any) => {
                          return (
                            <GroupItem colSpan={items.colSpan}>
                              {items.items.map((valueFrom: any) => {
                                return (
                                  <SimpleItem
                                    key={valueFrom.caption}
                                    {...valueFrom}
                                  />
                                );
                              })}
                            </GroupItem>
                          );
                        })}
                      </GroupItem>
                    );
                  })}
              </Form>
            </form>
          </div>
          <div className="w-[34%]">
            <form action="" ref={formRef}>
              <Form
                className="form_detail_post"
                ref={formRef2}
                validationGroup="PostData"
                onInitialized={(e) => {
                  formRef2.current = e.component;
                }}
                readOnly={false}
                formData={{}}
                labelLocation="left"
                customizeItem={customizeItem1}
                onFieldDataChanged={handleFieldDataChanged1}
              >
                {formSettings
                  .filter((item: any) => item.typeForm === "FormRight")
                  .map((value: any) => {
                    return (
                      <GroupItem colCount={value.colCount}>
                        {value.items.map((items: any) => {
                          return (
                            <GroupItem colSpan={items.colSpan}>
                              {items.items.map((valueFrom: any) => {
                                return (
                                  <SimpleItem
                                    key={valueFrom.caption}
                                    {...valueFrom}
                                  />
                                );
                              })}
                            </GroupItem>
                          );
                        })}
                      </GroupItem>
                    );
                  })}
              </Form>
            </form>
          </div>
        </div>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
}
