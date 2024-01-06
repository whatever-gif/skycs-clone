import { DateRangeField } from "@/pages/admin/test-upload/date-range-field";
import { NumberRangeField } from "@/pages/admin/test-upload/number-range-field";
import { UploadFilesField } from "@/pages/admin/test-upload/upload-field";
import { AdminContentLayout } from "@layouts/admin-content-layout";
import Form, { ButtonItem, ButtonOptions, Item } from "devextreme-react/form";
import { useRef } from "react";

export const TestUploadPage = () => {
  const formRef = useRef<Form | null>(null);
  const handleSubmit = (e: any) => {
    e.preventDefault();
  };
  const formData = {
    uploadFiles: [
      {
        FileFullName: "036K4131M.C9C5ED1722734583A00302A7599EE6EA.xlsx",
        FileType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        FileSize: 0.034271240234375,
        isUploading: false,
        FileId: "036K61K1B.C690C98542D243A48DCBF80AD13D8CA02",
        NodeID: null,
        NetworkID: null,
        SolutionCode: null,
        FileUrlLocal:
          "https://devsyscm.inos.vn:12189/idocNet.Test.FileCenter.WA/api/File/UploadedFiles/AllFile/7206207001/20230620/036K61K1B.C690C98542D243A48DCBF80AD13D8CA0.xlsx",
        FileUrlFS:
          "https://ftest.ecore.vn/20230620/036K61K1B.C690C98542D243A48DCBF80AD13D8CA0.xlsx",
        FileContent: null,
        RefNo: null,
        RefType: null,
        FileIdDelete: null,
        CreateDTimeUTC: null,
        CreateBy: null,
        LUDTimeUTC: null,
        LUBy: null,
        UpdDTimeUTC: null,
        UpdBy: null,
        DeleteDTimeUTC: null,
        DeleteBy: null,
        FlagIsDeleted: null,
        FlagIsRecycle: null,
        LogLUDTimeUTC: null,
        LogLUBy: null,
      },
      {
        FileFullName: "1036K4131M.C9C5ED1722734583A00302A7599EE6EA.xlsx",
        FileType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        FileSize: 0.034271240234375,
        isUploading: false,
        FileId: "036K61K1B.C690C98542D243A48DCBF80AD13D8CA0",
        NodeID: null,
        NetworkID: null,
        SolutionCode: null,
        FileUrlLocal:
          "https://devsyscm.inos.vn:12189/idocNet.Test.FileCenter.WA/api/File/UploadedFiles/AllFile/7206207001/20230620/036K61K1B.C690C98542D243A48DCBF80AD13D8CA0.xlsx",
        FileUrlFS:
          "https://ftest.ecore.vn/20230620/036K61K1B.C690C198542D243A48DCBF80AD13D8CA0.xlsx",
        FileContent: null,
        RefNo: null,
        RefType: null,
        FileIdDelete: null,
        CreateDTimeUTC: null,
        CreateBy: null,
        LUDTimeUTC: null,
        LUBy: null,
        UpdDTimeUTC: null,
        UpdBy: null,
        DeleteDTimeUTC: null,
        DeleteBy: null,
        FlagIsDeleted: null,
        FlagIsRecycle: null,
        LogLUDTimeUTC: null,
        LogLUBy: null,
      },
    ],
  };
  return (
    <AdminContentLayout className={"province-management"}>
      <AdminContentLayout.Slot name={"Header"}>
        <h4>Upload Files</h4>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <form onSubmit={handleSubmit}>
          <Form ref={formRef} formData={formData}>
            <Item
              itemType={"simple"}
              dataField={"uploadFiles"}
              label={{
                location: "left",
                text: "Upload files",
              }}
              render={(param: any) => {
                const { component: formComponent, dataField } = param;
                return (
                  <UploadFilesField
                    formInstance={formComponent}
                    onValueChanged={(files: any) => {
                      formComponent.updateData(dataField, files);
                    }}
                  />
                );
              }}
            ></Item>
            <Item
              itemType={"simple"}
              dataField={"dateRange"}
              label={{
                location: "top",
                text: "Date range",
              }}
              render={(param: any) => {
                const { component: formComponent, dataField } = param;
                return (
                  <DateRangeField
                    dataField={dataField}
                    className={"ml-2"}
                    formInstance={formComponent}
                    onValueChanged={(value: any) => {
                      formComponent.updateData(dataField, value);
                    }}
                  />
                );
              }}
            ></Item>
            <Item
              itemType={"simple"}
              label={{
                location: "top",
                text: "Number range",
              }}
              render={(param: any) => {
                const { component: formComponent, dataField } = param;
                return (
                  <NumberRangeField
                    dataField={dataField}
                    formInstance={formComponent}
                    onValueChanged={(value: any) => {
                      formComponent.updateData(dataField, value);
                    }}
                  />
                );
              }}
            ></Item>
            <ButtonItem>
              <ButtonOptions
                width={"100%"}
                type={"default"}
                useSubmitBehavior={true}
              >
                <span>Submit</span>
              </ButtonOptions>
            </ButtonItem>
          </Form>
        </form>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
};
