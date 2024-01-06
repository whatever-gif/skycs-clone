import { useI18n } from "@/i18n/useI18n";
import { requiredType } from "@/packages/common/Validation_Rules";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";
import { Button, Form } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import TreeView from "devextreme-react/tree-view";
import { useCallback, useEffect, useRef, useState } from "react";

import PermissionContainer from "@/components/PermissionContainer";
import { encodeFileType } from "@/components/ulti";
import { useClientgateApi } from "@/packages/api";
import { PageHeaderNoSearchLayout } from "@/packages/layouts/page-header-layout-2/page-header-nosearch-layout";
import { authAtom, showErrorAtom } from "@/packages/store";
import TagComponent from "@/pages/SearchMST/components/TagComponent";
import { UploadFilesField } from "@/pages/admin/test-upload/upload-field";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { currentInfo, refechAtom } from "../store";
import { transformCategory } from "./FormatCategory";

export default function Post_detail() {
  const { t } = useI18n("Post_Manager_detail");
  const { idPost } = useParams();
  const formData = useAtomValue(currentInfo);
  const api = useClientgateApi();
  const validateRef = useRef<any>();
  const formRef = useRef<any>();
  const formRef2 = useRef<any>();
  const treeViewRef = useRef<any>();
  const auth = useAtomValue(authAtom);
  const showError = useSetAtom(showErrorAtom);
  const setRefech = useSetAtom(refechAtom);
  const [dataCurrent, setCurrentItemData] = useState<any>([]);
  const [dataCurrentRight, setCurrentItemDataRight] = useState<any>([]);

  const PostStatus = [
    { text: t("Published"), value: "PUBLISHED" },
    { text: t("Draft"), value: "DRAFT" },
  ];
  const shareType = [
    { text: t("Organization"), value: "ORGANIZATION" },
    { text: t("Network"), value: "NETWORK" },
    { text: t("Private"), value: "PRIVATE" },
  ];
  const navigate = useNavigate();

  const { data: dataTagbox, refetch } = useQuery(["dataTagbox"], () =>
    api.Mst_Tag_GetAllActive()
  );
  // const { data: dataDetail } = useQuery(["dataDetail", idPost], () =>
  //   api.KB_PostData_GetByPostCode(idPost, auth.networkId)
  // );
  const { data: dataCategory } = useQuery(["dataCategory"], () =>
    api.KB_Category_GetAllActive()
  );

  const {
    data: dataDetail,
    isLoading: isLoadingGetByCode,
    refetch: refetchGetByCode,
  } = useQuery({
    queryKey: ["dataDetail", idPost],
    queryFn: async () => {
      if (idPost) {
        const response = await api.KB_PostData_GetByPostCode(
          idPost,
          auth.networkId ?? ""
        );
        const item: any = response.Data?.KB_Post;
        if (response.isSuccess) {
          const listUpload = response?.Data?.Lst_KB_PostAttachFile ?? [];
          const listTag = response?.Data?.Lst_KB_PostTag ?? [];
          const newUpdateLoading = listUpload.map((item: any) => {
            return {
              ...item,
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
            Tag: listTag.map((item: any) => {
              return {
                TagID: item.TagID,
                TagName: item.mt_TagName,
              };
            }),
          });

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
  const handleAddNew = async () => {
    const formData = validateRef.current.instance.option("formData");
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
        ShareType: formData2.ShareType ?? "",
        FlagShare: "1",
        PostStatus: formData2.PostStatus ?? "",
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
            Idx: (index + 1)?.toString(),
            FileName: item?.FileFullName,
            FilePath: item?.FileUrlFS,
            FileType: item?.FileType,
          }))
        : [],
    };
    // console.log(96, dataSave);
    // const respDataSave = await api.KB_PostData_Create(dataSave);
    // if (respDataSave.isSuccess) {
    //   toast.success(t("Create Successfully"));
    //   setRefech(true);
    //   navigate(`/${auth.networkId}/admin/Post_Manager`);
    //   // await refetch();
    //   return true;
    // }
    // showError({
    //   message: (resp.errorCode),
    //   debugInfo: resp.debugInfo,
    //   errorInfo: resp.errorInfo,
    // });
    // throw new Error(resp._strErrCode);
  };

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
              label: {
                text: t("Title"),
              },
              editorType: "dxTextBox",
              caption: t("Title"),
              visible: true,
              validationRules: [requiredType],
              render: (param: any) => {
                const { editorOptions } = param;
                return (
                  <span className="font-bold text-[13px]">
                    {editorOptions?.value ?? "---"}
                  </span>
                );
              },
            },
            {
              dataField: "Detail",
              label: {
                text: t("Detail"),
              },
              editorOptions: {},
              render: (param: any) => {
                const { editorOptions } = param;
                return (
                  <>
                    {editorOptions?.value ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: editorOptions?.value,
                        }}
                        className="h-[400px] overflow-y-scroll "
                      />
                    ) : (
                      "---"
                    )}
                  </>
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
                text: t("UploadFiles"),
              },
              editorOptions: {
                readOnly: true,
              },
              render: (param: any) => {
                const {
                  component: formComponent,
                  dataField,
                  editorOptions,
                } = param;
                const files = formComponent?.option("formData.uploadFiles");

                return (
                  <>
                    {files ? (
                      files[0]?.FileFullName === null || "" || undefined ? (
                        <div>---</div>
                      ) : (
                        <UploadFilesField
                          hiddenRemoveIcon={true}
                          readonly={true}
                          className={"Upload_Detail_Post"}
                          formInstance={formComponent}
                          onValueChanged={(files: any) => {
                            formComponent.updateData("UploadFiles", files);
                          }}
                        />
                      )
                    ) : (
                      <div>---</div>
                    )}
                  </>
                );
              },
            },
            {
              dataField: "Synopsis",
              editorOptions: {
                placeholder: t("Input"),
                height: 70,
                maxLength: 200,
              },
              label: {
                text: t("Synopsis"),
              },
              editorType: "dxTextArea",
              caption: t("Synopsis"),
              visible: true,
              render: (param: any) => {
                const { editorOptions } = param;
                return (
                  <span className="text-[13px]">
                    {editorOptions?.value ?? "---"}
                  </span>
                );
              },
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
              label: {
                text: t("PostStatus"),
              },
              editorOptions: {
                dataSource: PostStatus,
                valueExpr: "value",
                displayExpr: "text",
                placeholder: t("Select"),
              },
              editorType: "dxSelectBox",
              caption: t("PostStatus"),
              visible: true,
              render: (param: any) => {
                const { editorOptions } = param;
                return (
                  <span className="text-[13px]">
                    {t(
                      `${
                        editorOptions?.value?.charAt(0).toUpperCase() +
                        editorOptions?.value?.slice(1).toLowerCase()
                      }`
                    ) ?? "---"}
                  </span>
                );
              },
            },
            {
              label: {
                text: t("ShareType"),
              },
              dataField: "ShareType",
              editorOptions: {
                placeholder: t("Select"),
                dataSource: shareType,
                valueExpr: "value",
                displayExpr: "text",
              },
              editorType: "dxSelectBox",
              caption: t("ShareType"),
              visible: true,
              render: (param: any) => {
                const { editorOptions } = param;
                return (
                  <span className="text-[13px]">
                    {t(
                      `${
                        editorOptions?.value?.charAt(0).toUpperCase() +
                        editorOptions?.value?.slice(1).toLowerCase()
                      }`
                    ) ?? "---"}
                  </span>
                );
              },
            },
            {
              dataField: "Category",
              label: { text: t("Category") },
              editorOptions: {
                placeholder: t("Select"),
              },
              render: (param: any) => {
                const { component: formComponent, dataField } = param;
                return (
                  <TreeView
                    id="treeview"
                    disabledExpr={"CategoryName"}
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
                const { editorOptions } = param;

                return (
                  <div>
                    {dataCurrentRight?.Tag?.length === 0 ? (
                      <div>---</div>
                    ) : (
                      <TagComponent
                        dataTag={dataCurrentRight?.Tag}
                        totalTag={3}
                        nameTag={"TagName"}
                      />
                    )}
                  </div>
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
            {
              dataField: "LastViewDTimeUTC",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("LastViewDTimeUTC"),
              },
              editorType: "dxTextBox",
              caption: t("LastViewDTimeUTC"),
              visible: true,
              render: (param: any) => {
                const { editorOptions } = param;
                return (
                  <span className="text-[13px]">
                    {editorOptions?.value ?? "---"}
                  </span>
                );
              },
            },
            {
              dataField: "TotalView",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("TotalView"),
              },
              editorType: "dxTextBox",
              caption: t("TotalView"),
              visible: true,
              render: (param: any) => {
                const { editorOptions } = param;
                return (
                  <span className="text-[13px]">
                    {editorOptions?.value ?? "---"}
                  </span>
                );
              },
            },
            {
              dataField: "CreateBy",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("CreateBy"),
              },
              editorType: "dxTextBox",
              caption: t("CreateBy"),
              visible: true,
              render: (param: any) => {
                const { editorOptions } = param;
                return (
                  <span className="text-[13px]">
                    {editorOptions?.value ?? "---"}
                  </span>
                );
              },
            },
            {
              dataField: "CreateDTimeUTC",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("CreateDTimeUTC"),
              },
              editorType: "dxTextBox",
              caption: t("CreateDTimeUTC"),
              visible: true,
              render: (param: any) => {
                const { editorOptions } = param;
                return (
                  <span className="text-[13px]">
                    {editorOptions?.value ?? "---"}
                  </span>
                );
              },
            },
            {
              dataField: "LogLUBy",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("LogLUBy"),
              },
              editorType: "dxTextBox",
              caption: t("LogLUBy"),
              visible: true,
              render: (param: any) => {
                const { editorOptions } = param;
                return (
                  <span className="text-[13px]">
                    {editorOptions?.value ?? "---"}
                  </span>
                );
              },
            },
            {
              dataField: "LogLUDTimeUTC",
              editorOptions: {
                placeholder: t("Input"),
              },
              label: {
                text: t("LogLUDTimeUTC"),
              },
              editorType: "dxTextBox",
              caption: t("LogLUDTimeUTC"),
              visible: true,
              render: (param: any) => {
                const { editorOptions } = param;
                return (
                  <span className="text-[13px]">
                    {editorOptions?.value ?? "---"}
                  </span>
                );
              },
            },
          ],
        },
      ],
    },
  ];
  const handleSubmitPopup = useCallback(async (e: any) => {}, []);

  const customizeItemRight = useCallback((item: any) => {}, []);
  const customizeItem = useCallback((item: any) => {}, []);
  const handleFieldDataChanged = (changedData: any) => {};
  const handleEdit = () => {
    navigate(`/${auth.networkId}/admin/Post_Edit/${idPost}`);
  };

  const handleDeleteRows = async (rows: any) => {
    const dataDelete = {
      KB_Post: {
        PostCode: idPost,
        OrgID: auth.orgId.toString(),
      },
    };
    const resp = await api.KB_PostData_Delete(dataDelete);
    if (resp.isSuccess) {
      toast.success(t("Delete Successfully"));
      navigate(`/${auth.networkId}/admin/Post_Manager`);
      await refetch();
    } else {
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
                onClick={() => navigate(-1)}
              >
                {t("Post Manager")}
              </div>
              <div className="">{">"}</div>
              <div className="text-header font-bold dx-font-m">
                {t("Post Detail")}
              </div>
            </div>
          </PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot
            name={"Center"}
          ></PageHeaderNoSearchLayout.Slot>
          <PageHeaderNoSearchLayout.Slot name={"After"}>
            <PermissionContainer
              permission={"BTN_ADMIN_CAMPAIGN_POSTMANAGER_DETAIL_EDIT"}
              children={
                <Button
                  stylingMode={"contained"}
                  type="default"
                  text={t("Edit")}
                  onClick={handleEdit}
                />
              }
            />
            <PermissionContainer
              permission={"BTN_ADMIN_CAMPAIGN_POSTMANAGER_DETAIL_DELETE"}
              children={
                <Button
                  className="ml-2"
                  stylingMode={"contained"}
                  type="default"
                  text={t("Delete")}
                  onClick={handleDeleteRows}
                />
              }
            />

            <PermissionContainer
              permission={"BTN_ADMIN_CAMPAIGN_POSTMANAGER_DETAIL_CANCEL"}
            >
              <Button
                stylingMode={"contained"}
                type="default"
                className="Cancel_Post_Detail"
                text={t("Cancel")}
                onClick={() => navigate(-1)}
              />
            </PermissionContainer>
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
                readOnly={true}
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
          <div className="w-[34%]">
            <form action="" ref={formRef}>
              <Form
                className="form_detail_post"
                ref={formRef2}
                validationGroup="PostData"
                onInitialized={(e) => {
                  formRef2.current = e.component;
                }}
                readOnly={true}
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
