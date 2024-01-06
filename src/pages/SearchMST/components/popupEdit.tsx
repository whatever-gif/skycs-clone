import { encodeFileType, revertEncodeFileType } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { requiredType } from "@/packages/common/Validation_Rules";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { authAtom, showErrorAtom } from "@/packages/store";
import {
  flattenCategorieV2,
  flattenCategories,
  getCategories,
} from "@/pages/Category_Manager/components/FormatCategoryGrid";
import { transformCategory } from "@/pages/Post_Manager/components/components/FormatCategory";
import TagboxCustom from "@/pages/Post_Manager/components/components/TagboxCustom";
import { UploadFilesField } from "@/pages/admin/test-upload/upload-field";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Popup, TreeView } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import HtmlEditor, {
  ImageUpload,
  Item as ItemEditor,
  MediaResizing,
  Toolbar,
} from "devextreme-react/html-editor";
import { confirm } from "devextreme/ui/dialog";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { showPopup } from "./store";

export default function PopupEdit({ title }: any) {
  const { t } = useI18n("SearchMST");
  const [popupVisible, setPopupVisible] = useAtom(showPopup);
  const [dataCurrent, setCurrentItemData] = useState<any>([]);
  const [dataCurrentRight, setCurrentItemDataRight] = useState<any>([]);
  const api = useClientgateApi();
  const validateRef = useRef<any>();
  const formRef = useRef<any>();
  const auth = useAtomValue(authAtom);
  const { idInforSearch } = useParams();
  const showError = useSetAtom(showErrorAtom);
  const [listTag, setListTag] = useState<any>([]);
  const queryClient = useQueryClient();
  const [listCateGories, setlistCateGories] = useState<any>([]);
  // const [showpopupSubmit, setShowPopupSubmit] = useState(false);

  const handleSubmitPopup = async () => {
    let result = confirm(
      `<div">${t("Bạn có muốn cập nhật mới?")}</div>`,
      `${t("Xác nhận")}`
    );
    result.then(async (dialogResult) => {
      if (dialogResult) {
        const formData = validateRef.current.instance.option("formData");
        const formData2 = formRef2.current.instance.option("formData");
        const resp = await api.Mst_Tag_GetAllActive();
        const newTag = resp?.Data?.Lst_Mst_Tag?.filter((item: any) =>
          formData2?.Tags?.includes(item?.TagName)
        );
        const dataSave = {
          KB_Post: {
            PostCode: idInforSearch,
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
            setPopupVisible(false);
            queryClient.invalidateQueries({
              queryKey: ["SearchDetail", idInforSearch],
            });

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
      }
    });
  };

  const {
    data: dataDetail,
    isLoading: isLoadingGetByCode,
    refetch: refetchGetByCode,
  } = useQuery({
    queryKey: ["dataDetail", idInforSearch],
    queryFn: async () => {
      if (idInforSearch) {
        const response = await api.KB_PostData_GetByPostCode(
          idInforSearch,
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
  }, [popupVisible]);
  const formRef2 = useRef<any>();
  const onNoClick = () => {
    setPopupVisible(false);
  };
  const handleCancel = () => {
    let Cancel = confirm(
      `<div>${t("Bạn muốn xóa hết dữ liệu đã chỉnh sửa?")}</div>`,
      `${t("Xác nhận")}`
    );
    Cancel.then((dialogResult) => {
      if (dialogResult) {
        setPopupVisible(false);
      }
    });
  };
  // const handleCancelSubmit = () => {
  //   setShowPopupSubmit(false);
  // };
  const { data: dataTagbox, refetch } = useQuery(["dataTagbox"], () =>
    api.Mst_Tag_GetAllActive()
  );
  const treeViewRef = useRef<any>();
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
  const PostStatus = [
    { text: t("Published"), value: "PUBLISHED" },
    { text: t("Draft"), value: "DRAFT" },
  ];
  const shareType = [
    { text: t("Organization"), value: "ORGANIZATION" },
    { text: t("Network"), value: "NETWORK" },
    { text: t("Private"), value: "PRIVATE" },
  ];
  const { data: dataCategory } = useQuery(["dataCategory"], () =>
    api.KB_Category_GetAllActive()
  );
  const formSettings: any = [
    {
      colCount: 1,
      labelLocation: "top",
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
                  <HtmlEditor
                    height="340px"
                    defaultValue={dataCurrent?.Detail}
                    // valueType={"html"}
                    onValueChanged={(e) => {
                      formComponent.updateData(dataField, e.value);
                    }}
                  >
                    <MediaResizing enabled={true} />
                    <ImageUpload fileUploadMode="base64" tabs={["file"]} />
                    <Toolbar>
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
                      <ItemEditor cssClass="itemHTML" name="separator" />
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
            },
            {
              dataField: "UploadFiles", // file đính kèm
              caption: t("UploadFiles"),
              colSpan: 2,
              label: {
                location: "top",
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
              label: { text: t("Synopsis") },
              dataField: "Synopsis",
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
              label: { text: t("PostStatus") },
              editorOptions: {
                dataSource: PostStatus,
                valueExpr: "value",
                displayExpr: "text",
                placeholder: t("Select"),
              },
              editorType: "dxSelectBox",
              caption: t("PostStatus"),
              visible: true,
              validationRules: [requiredType],
            },
            {
              label: { text: t("ShareType") },
              dataField: "ShareType",
              editorOptions: {
                placeholder: t("Select"),
                dataSource: shareType,
                valueExpr: "value",
                displayExpr: "text",
              },
              editorType: "dxSelectBox",
              caption: t("ShareType"),
              validationRules: [requiredType],
              visible: true,
            },
            {
              label: { text: t("Category") },
              dataField: "Category",
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
              label: { text: t("Tags") },
              caption: t("Tags"),
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
  const customizeItemRight = useCallback((item: any) => {}, []);
  const customizeItem = useCallback((item: any) => {}, []);
  const handleFieldDataChanged = (changedData: any) => {};
  const windowSize = useWindowSize();
  return (
    <Popup
      visible={popupVisible}
      showTitle={true}
      title={title}
      // hideOnOutsideClick
      showCloseButton={true}
      onHiding={onNoClick}
      width={`${windowSize.width - 220}px `}
      height={`${windowSize.height - 80}px `}
      wrapperAttr={{
        class: "popup-form-Category",
      }}
      toolbarItems={[
        {
          toolbar: "bottom",
          location: "after",
          widget: "dxButton",
          options: {
            text: t("Save"),
            stylingMode: "contained",
            type: "count",
            onClick: handleSubmitPopup,
          },
        },

        {
          toolbar: "bottom",
          location: "after",
          widget: "dxButton",
          options: {
            text: t("Cancel"),
            type: "default",
            onClick: handleCancel,
          },
        },
      ]}
    >
      <div className="flex mx-5 my-2 gap-5">
        <div className="w-[65%]">
          <form action="" ref={formRef} onSubmit={handleSubmitPopup}>
            <Form
              className="form_detail_post"
              ref={validateRef}
              validationGroup="PostData"
              onInitialized={(e) => {
                validateRef.current = e.component;
              }}
              formData={dataCurrent}
              labelLocation="top"
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
              formData={dataCurrentRight}
              labelLocation="top"
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
    </Popup>
  );
}
