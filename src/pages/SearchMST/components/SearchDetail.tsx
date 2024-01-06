import { encodeFileType } from "@/components/ulti";
import { useI18n } from "@/i18n/useI18n";
import { useClientgateApi } from "@/packages/api";
import { useWindowSize } from "@/packages/hooks/useWindowSize";
import { authAtom, showErrorAtom } from "@/packages/store";
import { UploadFilesField } from "@/pages/admin/test-upload/upload-field";
import { ColumnOptions } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, LoadPanel } from "devextreme-react";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import { confirm } from "devextreme/ui/dialog";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TagComponent from "./TagComponent";
import PopupEdit from "./popupEdit";
import { showPopup } from "./store";

export default function SearchDetail() {
  const { t } = useI18n("SearchMST");
  const windowSize = useWindowSize();
  const navigate = useNavigate();
  const { idInforSearch } = useParams();

  const auth = useAtomValue(authAtom);
  const [iconShare, setIconShare] = useState<any>("");
  const [data, setData] = useState<any>({});
  const api = useClientgateApi();
  const [dataCurrent, setCurrentItemData] = useState<any>([]);
  const showError = useSetAtom(showErrorAtom);
  const setShowPopup = useSetAtom(showPopup);

  const {
    data: dataDetail,
    isLoading: isLoadingGetByCode,
    refetch: refetchGetByCode,
  } = useQuery({
    queryKey: ["SearchDetail", idInforSearch],
    queryFn: async () => {
      if (idInforSearch) {
        const response = await api.KB_PostData_GetByPostCode(
          idInforSearch,
          auth.networkId
        );

        if (response.isSuccess) {
          const listUpload = response?.Data?.Lst_KB_PostAttachFile ?? [];
          const newUpdateLoading = listUpload.map((item: any) => {
            return {
              ...item,
              FileFullName: item.FileName,
              FileType: encodeFileType(item.FileType),
              FileUrlLocal: item.FilePath,
            };
          });
          setCurrentItemData({
            uploadFiles: newUpdateLoading,
          });
          setData(response.Data?.KB_Post);
          if (response.Data?.KB_Post.ShareType === "PRIVATE") {
            setIconShare("lock.png");
          } else if (response.Data?.KB_Post.ShareType === "ORGANIZATION") {
            setIconShare("ORGANIZATION.png");
          } else if (response.Data?.KB_Post.ShareType === "PUBLIC") {
            setIconShare("public.png");
          }

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
        return [] as any;
      }
    },
  });
  useEffect(() => {
    refetchGetByCode();
  }, []);

  const shopPopupEdit = () => {
    setShowPopup(true);
  };

  const columns: ColumnOptions[] = [
    {
      dataField: "uploadFiles", // file đính kèm
      caption: t("uploadFiles"),
      label: {
        text: t("uploadFiles"),
      },
      editorOptions: {
        readOnly: false,
      },
      render: (paramValue: any) => {
        const { component: formComponent, dataField } = paramValue;
        return (
          <UploadFilesField
            formInstance={formComponent}
            className={"Upload_Detail_search"}
            readonly={false}
            controlFileInput={["DOCX", "PDF", "JPG", "PNG", "XLSX"]}
            onValueChanged={(files: any) => {
              formComponent.updateData(dataField, files);
            }}
          />
        );
      },
    },
  ];
  const { pathname, search } = useLocation();
  const tabResults = pathname.split("/").pop();
  const queryClient = useQueryClient();

  const handleBack = () => {
    queryClient.refetchQueries({
      queryKey: ["Search_Manager_History", tabResults],
    });
    navigate(-1);
  };

  const handleReport = async () => {
    const resp = await api.KB_Post_UpdateFlagEdit({
      KB_Post: {
        PostCode: idInforSearch,
        OrgID: dataDetail?.KB_Post?.OrgID,
        FlagEdit: dataDetail?.KB_Post?.FlagEdit === "1" ? "0" : "1",
      },
    });
    if (resp.isSuccess) {
      toast.success(t("Đã gửi yêu cầu!"));
      refetchGetByCode();
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
  const showPoupReport = (data: any) => {
    let result = confirm(
      `${t("Bạn có muốn báo cáo chỉnh sửa ?")}`,
      `${t("THÔNG BÁO")}`
    );
    result.then((dialogResult) => {
      if (dialogResult) {
        handleReport();
      }
    });
  };

  return (
    <div className="h-[800px]">
      <LoadPanel
        container={".dx-viewport"}
        position={"center"}
        visible={isLoadingGetByCode}
        showIndicator={true}
        showPane={true}
      />
      <div className="px-[16px] py-[14px] shadow-md">
        <div
          className="fixed bg-[#00703C] z-20 right-[10px] top-[80%] rounded-full"
          onClick={shopPopupEdit}
        >
          <div className="h-[40px] w-[40px] m-auto cursor-pointer">
            <img
              src="/images/icons/editIcon.png"
              alt=""
              className="h-[18px] absolute left-[13px] top-[10px] object-cover"
            />
          </div>
        </div>
        <div className="fixed searchDetail_header shadow-md z-10 bg-white left-[0px] top-[60px] px-[16px] py-[14px] w-full">
          <div className="flex gap-2 items-center">
            <div className="h-[15px] cursor-pointer" onClick={handleBack}>
              <img
                src="/images/icons/arrow_back.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="line-clamp-2 text-[16px] font-bold search_title">
              {data.Title}
            </div>
          </div>
          <div className="mt-2 flex gap-2 items-center">
            <div className="flex">
              <div className="h-[15px]">
                <img
                  src={`/images/icons/${
                    data.ShareType === "PRIVATE"
                      ? "lock.png"
                      : data.ShareType === "NETWORK"
                      ? "ORGANIZATION.png"
                      : data.ShareType === "ORGANIZATION"
                      ? "public.png"
                      : ""
                  }`}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="line-clamp-2 ml-[12px]">{data?.CreateBy}</div>
            </div>
            <div className="border-r-[2px] border-l-[2px] px-3">
              {data.LogLUDTimeUTC}
            </div>
            <div className="px-2">{data.kbc_CategoryName}</div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="w-[50%]">
              {
                <TagComponent
                  dataTag={dataDetail?.Lst_KB_PostTag}
                  totalTag={3}
                  nameTag={"mt_TagName"}
                />
              }
            </div>
            <div
              className={`flex gap-1 cursor-pointer items-center ${
                data?.FlagEdit === "1" ? "bg-[#00703C]" : "bg-red-600"
              }  px-1 py-[7px] rounded`}
              onClick={showPoupReport}
            >
              {data?.FlagEdit === "1" ? (
                ""
              ) : (
                <div>
                  <img src="/images/icons/warning.png" alt="" />
                </div>
              )}

              <div className="text-white">
                {data?.FlagEdit === "1"
                  ? t("Hủy yêu cầu sửa")
                  : t("Báo cáo cần sửa")}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative top-[10%]">
        <div className="px-[45px] py-[25px]">
          <div
            dangerouslySetInnerHTML={{
              __html: data.Detail,
            }}
          />
          <div>
            <Form formData={dataCurrent} labelMode="hidden">
              <GroupItem>
                {columns.map((item: any, index: number) => {
                  return <SimpleItem key={index} {...item} />;
                })}
              </GroupItem>
            </Form>
          </div>
        </div>
      </div>

      <PopupEdit title={t("Chỉnh sửa bài viết")} />
    </div>
  );
}
