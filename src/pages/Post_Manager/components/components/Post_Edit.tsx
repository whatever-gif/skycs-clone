import { useI18n } from "@/i18n/useI18n";
import { requiredType } from "@/packages/common/Validation_Rules";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { Button, Form } from "devextreme-react";
import { GroupItem, Item, SimpleItem } from "devextreme-react/form";
import TreeView from "devextreme-react/tree-view";
import { useCallback, useEffect, useRef, useState } from "react";

import PermissionContainer, {
  checkPermision,
} from "@/components/PermissionContainer";
import { encodeFileType, revertEncodeFileType } from "@/components/ulti";
import { useNetworkNavigate } from "@/components/useNavigate";
import { useClientgateApi } from "@/packages/api";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { authAtom, showErrorAtom } from "@/packages/store";
import {
  flattenCategorieV2,
  flattenCategories,
  getCategories,
} from "@/pages/Category_Manager/components/FormatCategoryGrid";
import { UploadFilesField } from "@/pages/admin/test-upload/upload-field";
import { useQuery } from "@tanstack/react-query";
import HtmlEditor, {
  ImageUpload,
  Item as ItemEditor,
  MediaResizing,
  Toolbar,
} from "devextreme-react/html-editor";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { currentInfo, refechAtom } from "../store";
import { transformCategory } from "./FormatCategory";
import TagboxCustom from "./TagboxCustom";

export default function Post_Edit() {
  const { t } = useI18n("Post_Manager_edit");
  const { idPostEdit } = useParams();
  const formData = useAtomValue(currentInfo);
  const api = useClientgateApi();
  const validateRef = useRef<any>();
  const formRef = useRef<any>();
  const formRef2 = useRef<any>();
  const treeViewRef = useRef<any>();
  const auth = useAtomValue(authAtom);
  const showError = useSetAtom(showErrorAtom);
  const setRefech = useSetAtom(refechAtom);
  const check = checkPermision("BTN_ADMIN_POST_MANAGER_ATTACH_DELETE");

  const [dataCurrent, setCurrentItemData] = useState<any>([]);
  const [dataCurrentRight, setCurrentItemDataRight] = useState<any>([]);

  const [listTag, setListTag] = useState<any>([]);
  const [listCateGories, setlistCateGories] = useState<any>([]);

  const PostStatus = [
    { text: t("Published"), value: "PUBLISHED" },
    { text: t("Draft"), value: "DRAFT" },
  ];
  const shareType = [
    { text: t("Organization"), value: "ORGANIZATION" },
    { text: t("Network"), value: "NETWORK" },
    { text: t("Private"), value: "PRIVATE" },
  ];
  const navigate = useNetworkNavigate();
  const nav = useNavigate();

  const { data: dataTagbox, refetch } = useQuery(["dataTagbox"], () =>
    api.Mst_Tag_GetAllActive()
  );
  const { data: dataCategory } = useQuery(["dataCategory"], () =>
    api.KB_Category_GetAllActive()
  );

  const {
    data: dataDetail,
    isLoading: isLoadingGetByCode,
    refetch: refetchGetByCode,
  } = useQuery({
    queryKey: ["dataDetail", idPostEdit],
    queryFn: async () => {
      if (idPostEdit) {
        const response = await api.KB_PostData_GetByPostCode(
          idPostEdit,
          auth.networkId ?? ""
        );
        const item: any = response.Data?.KB_Post;
        if (response.isSuccess) {
          const listUpload = response?.Data?.Lst_KB_PostAttachFile ?? [];
          const listTag = response?.Data?.Lst_KB_PostTag ?? [];
          const newUpdateLoading = listUpload.map((item: any, index: any) => {
            return {
              ...item,
              FileId: nanoid(),
              Idx: (index + 1)?.toString(),
              FileFullName: item.FileName,
              FileType: encodeFileType(item.FileType),
              FileUrlLocal: item.FilePath,
            };
          });
          setCurrentItemData({
            ...item,
            uploadFiles: newUpdateLoading ?? [],
          });
          setCurrentItemDataRight({
            ...item,
            Category: response?.Data?.Lst_KB_PostCategory,
            Tag: listTag.map((obj: any) => obj.mt_TagName),
          });
          setListTag(listTag);
          setlistCateGories(response?.Data?.Lst_KB_PostCategory);
          return response.Data;
        } else {
          showError({
            message: response._strErrCode,
            _strErrCode: response._strErrCode,
            _strTId: response._strTId,
            _strAppTId: response._strAppTId,
            _objTTime: response._objTTime,
            _strType: response._strType,
            _dicDebug: response._dicDebug,
            _dicExcs: response._dicExcs,
          });
        }
      } else {
        return {};
      }
    },
  });
  useEffect(() => {
    refetchGetByCode();
  }, []);
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
              validationRules: [requiredType],
              render: (param: any) => {
                const { component: formComponent, dataField } = param;
                return (
                  <div className="w-[99.99%]">
                    <HtmlEditor
                      height="340px"
                      width={"100%"}
                      defaultValue={dataCurrent?.Detail}
                      valueType={"html"}
                      onValueChanged={(e) => {
                        formComponent.updateData(dataField, e.value);
                      }}
                    >
                      <MediaResizing enabled={false} />
                      <ImageUpload fileUploadMode="base64" tabs={["file"]} />
                      <Toolbar multiline={false}>
                        <ItemEditor name="undo" cssClass="itemHTML" />
                        <ItemEditor name="redo" cssClass="itemHTML" />
                        <ItemEditor name="separator" cssClass="itemHTML" />
                        <ItemEditor
                          name="size"
                          cssClass="itemHTML"
                          acceptedValues={sizeValues}
                        />
                        <ItemEditor
                          name="font"
                          cssClass="itemHTML"
                          acceptedValues={fontValues}
                        />
                        <ItemEditor name="separator" cssClass="itemHTML" />
                        <ItemEditor name="bold" cssClass="itemHTML" />
                        <ItemEditor name="italic" cssClass="itemHTML" />
                        <ItemEditor name="strike" cssClass="itemHTML" />
                        <ItemEditor name="underline" cssClass="itemHTML" />
                        <ItemEditor name="separator" cssClass="itemHTML" />
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
                        <ItemEditor
                          cssClass="itemHTML"
                          name="insertColumnLeft"
                        />
                        <ItemEditor
                          cssClass="itemHTML"
                          name="insertColumnRight"
                        />
                        <ItemEditor cssClass="itemHTML" name="deleteColumn" />
                      </Toolbar>
                    </HtmlEditor>
                  </div>
                );
              },
              caption: t("Detail"),
              visible: true,
            },
            {
              dataField: "UploadFiles", // file đính kèm
              caption: t("UploadFiles"),
              colSpan: 2,
              label: {
                location: "left",
                text: t("Uploadfiles"),
              },
              editorOptions: {
                readOnly: true,
              },
              render: (paramValue: any) => {
                const { component: formComponent, dataField } = paramValue;
                return (
                  <UploadFilesField
                    hiddenRemoveIcon={check ? false : true}
                    formInstance={formComponent}
                    readonly={false}
                    controlFileInput={[
                      "DOCX",
                      "PDF",
                      "JPG",
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
            },
            {
              dataField: "Synopsis",
              label: { text: t("Synopsis") },
              editorOptions: {
                placeholder: t("Input"),
                height: 70,
                maxLength: 200,
              },
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
                valueExpr: "value",
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
              label: { text: t("ShareType") },
              editorOptions: {
                placeholder: t("Select"),
                dataSource: shareType,
                valueExpr: "value",
                displayExpr: "text",
              },
              editorType: "dxSelectBox",
              caption: t("ShareType"),
              visible: true,
              validationRules: [requiredType],
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
                    id="treeview"
                    displayExpr="CategoryName"
                    ref={treeViewRef}
                    defaultItems={transformCategory(dataCurrentRight.Category)}
                    width={"100%"}
                    scrollDirection="vertical"
                    showCheckBoxesMode="normal"
                    selectionMode="multiple"
                    className="max-h-[190px] overflow-y-auto"
                    // onSelectionChanged={(e) => {
                    //   formComponent.updateData("Category", e);
                    // }}
                    items={transformCategory(
                      dataCurrentRight?.Category?.length === 0
                        ? dataCategory?.Data?.Lst_KB_Category
                        : dataCurrentRight?.Category
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
                text: "Tags",
              },
              editorOptions: {
                readOnly: true,
              },
              visible: true,
              render: (param: any) => {
                const { component: formComponent, dataField } = param;
                return (
                  <TagboxCustom
                    readOnly={false}
                    dataDefault={dataCurrentRight.Tag}
                    formComponent={formComponent}
                    data={dataTagbox?.Data?.Lst_Mst_Tag}
                  />
                );
              },
            },
            // {
            //   dataField: "ShareType",
            //   editorOptions: {
            //     placeholder: t("Select"),
            //     dataSource: shareType,
            //     valueExpr: "value",
            //     displayExpr: "text",
            //   },
            //   editorType: "dxSelectBox",
            //   caption: t("ShareType"),
            //   visible: true,
            // },
          ],
        },
      ],
    },
  ];

  const handleSubmitPopup = useCallback(async (e: any) => {}, []);
  const customizeItemRight = useCallback((item: any) => {}, []);
  const customizeItem = useCallback((item: any) => {}, []);
  const handleFieldDataChanged = (changedData: any) => {};

  const handleSave = async () => {
    const formData = validateRef.current.instance.option("formData");
    const formData2 = formRef2.current.instance.option("formData");

    const resp = await api.Mst_Tag_GetAllActive();
    const newTag = resp?.Data?.Lst_Mst_Tag?.filter((item: any) =>
      formData2?.Tags?.includes(item?.TagName)
    );

    const dataSave = {
      KB_Post: {
        PostCode: idPostEdit,
        OrgID: auth.orgId.toString(),
        Detail: formData.Detail ?? "",
        Title: formData.Title ?? "",
        Synopsis: formData.Synopsis ?? "",
        ShareType: formData2.ShareType ?? "",
        FlagShare: "1",
        PostStatus: formData2.PostStatus ?? "",
      },
      Lst_KB_PostCategory:
        flattenCategories(
          getCategories(formData2?.Category).filter(
            (item: any) => item.selected === true
          )
        ).map((item: any) => ({
          CategoryCode: item?.CategoryCode,
        })).length !== 0
          ? flattenCategories(
              getCategories(formData2?.Category).filter(
                (item: any) => item.selected === true
              )
            ).map((item: any) => ({
              CategoryCode: item?.CategoryCode,
            }))
          : flattenCategorieV2(listCateGories)
              .filter((item: any) => item.selected === true)
              .map((item: any) => ({
                CategoryCode: item?.CategoryCode,
              })),
      Lst_KB_PostTag:
        newTag?.length !== 0
          ? newTag?.map((item: any) => ({
              TagID: item.TagID,
            }))
          : listTag.map((item: any) => ({
              TagID: item.TagID,
            })),
      Lst_KB_PostAttachFile: formData?.UploadFiles
        ? formData?.UploadFiles.map((item: any, index: any) => ({
            Idx: (index + 1)?.toString(),
            FileName: item?.FileFullName,
            FilePath: item?.FileUrlFS || item.FilePath,
            FileType: revertEncodeFileType(item?.FileType),
          }))
        : dataCurrent?.uploadFiles[0]?.FileName === null
        ? []
        : dataCurrent?.uploadFiles.map((item: any, index: any) => ({
            Idx: (index + 1)?.toString(),
            FileName: item?.FileName,
            FilePath: item?.FilePath,
            FileType: revertEncodeFileType(item?.FileType),
          })) ?? [],
    };

    if (
      dataSave.Lst_KB_PostCategory?.length !== 0 &&
      dataSave.KB_Post.Detail !== "" &&
      dataSave.KB_Post.Title !== ""
    ) {
      const respDataSave = await api.KB_PostData_Update(dataSave);
      if (respDataSave.isSuccess) {
        toast.success(t("Edit Successfully"));
        setRefech(true);
        navigate(`admin/Post_Manager`);
        return true;
      }
      showError({
        message: respDataSave._strErrCode,
        _strErrCode: respDataSave._strErrCode,
        _strTId: respDataSave._strTId,
        _strAppTId: respDataSave._strAppTId,
        _objTTime: respDataSave._objTTime,
        _strType: respDataSave._strType,
        _dicDebug: respDataSave._dicDebug,
        _dicExcs: respDataSave._dicExcs,
      });
      throw new Error(respDataSave._strErrCode);
    } else if (dataSave.KB_Post.Detail === "") {
      toast.error(t("Chi tiết bài viết không được để trống!"));
    } else if (dataSave.Lst_KB_PostCategory?.length === 0) {
      toast.error(t("Danh mục không được để trống!"));
    }
  };

  return (
    <AdminContentLayout className={"Post_Manager"}>
      <AdminContentLayout.Slot name={"Header"}>
        <PageHeaderNoSearchLayout>
          <PageHeaderNoSearchLayout.Slot name={"Before"}>
            <div className="flex gap-3 items-center">
              <div
                className="font-bold dx-font-m hover:underline cursor-pointer hover:text-green-600"
                onClick={() => navigate("admin/Post_Manager")}
              >
                {t("Post Manager")}
              </div>
              <div className="">{">"}</div>
              <div className="text-header font-bold dx-font-m">
                {t("Post Edit")}
              </div>
            </div>
          </PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot
            name={"Center"}
          ></PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot name={"After"}>
            <PermissionContainer
              permission={"BTN_ADMIN_CAMPAIGN_POSTMANAGER_UPDATE_SAVE"}
              children={
                <Button
                  className="mr-2"
                  stylingMode={"contained"}
                  type="default"
                  text={t("Save")}
                  onClick={handleSave}
                />
              }
            />
            <PermissionContainer
              permission={"BTN_ADMIN_CAMPAIGN_POSTMANAGER_UPDATE_CANCEL"}
              children={
                <Button
                  stylingMode={"contained"}
                  type="normal"
                  className="Cancel_Post_Detail bg-white"
                  text={t("Cancel")}
                  onClick={() => nav(-1)}
                />
              }
            />
          </PageHeaderNoSearchLayout.Slot>
        </PageHeaderNoSearchLayout>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <div className="flex mx-5 my-2 gap-5 pb-[10px]">
          <div className="w-[60%]">
            <form action="" ref={formRef} onSubmit={handleSubmitPopup}>
              <Form
                className="form_detail_post"
                ref={validateRef}
                validationGroup="PostData"
                onInitialized={(e) => {
                  validateRef.current = e.component;
                }}
                formData={dataCurrent}
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
          <div className="w-[40%]">
            <form action="" className="w-full" ref={formRef}>
              <Form
                className="form_detail_post"
                ref={formRef2}
                validationGroup="PostData"
                onInitialized={(e) => {
                  formRef2.current = e.component;
                }}
                width={"100%"}
                formData={dataCurrentRight}
                labelLocation="left"
                customizeItem={customizeItemRight}
                onFieldDataChanged={handleFieldDataChanged}
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
