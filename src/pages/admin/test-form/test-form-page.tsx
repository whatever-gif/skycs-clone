import { useClientgateApi } from "@/packages/api";
import { FlagActiveEnum } from "@/packages/types";
import { ColumnOptions } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, LoadPanel } from "devextreme-react";
import { SimpleItem } from "devextreme-react/form";
import { useRef, useState } from "react";

// import {text} from "msw";

export const TestFormPage = () => {
  const formData = {
    Province: "",
    District: "",
    Ward: "",
  };
  const [data, setFormData] = useState(formData);

  const api = useClientgateApi();

  const { data: dataProvince, isLoading: isLoadingProvince } = useQuery({
    queryKey: ["Mst_Province_Search"],
    queryFn: async () => {
      const response = await api.Mst_Province_Search({
        FlagActive: FlagActiveEnum.Active,
        KeyWord: "",
        Ft_PageIndex: 0,
        Ft_PageSize: 10,
      });
      if (response.isSuccess) {
        return response.DataList;
      } else {
        return [];
      }
    },
  });

  const {
    data: dataDistrict,
    isLoading: isLoadingDistrict,
    refetch: refetchDistrict,
  } = useQuery({
    queryKey: ["Mst_District_Search"],
    queryFn: async () => {
      if (data.Province && data.Province !== "") {
        const response = await api.Mst_District_Search({
          KeyWord: data.Province,
          FlagActive: FlagActiveEnum.Active,
          Ft_PageIndex: 0,
          Ft_PageSize: 9999,
        });
        if (response.isSuccess) {
          return response.DataList;
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
  });

  const {
    data: dataWard,
    isLoading: isLoadingWard,
    refetch: refetchWard,
  } = useQuery({
    queryKey: ["Mst_MstWard_Search"],
    queryFn: async () => {
      if (
        data.Province &&
        data.District &&
        data.District !== "" &&
        data.Province !== ""
      ) {
        const response = await api.Mst_MstWard_Search({
          KeyWord: data.Province,
          FlagActive: FlagActiveEnum.Active,
          Ft_PageIndex: 0,
          Ft_PageSize: 9999,
        });
        if (response.isSuccess) {
          return response.DataList;
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
  });

  const handleChangeProvince = async (e: any) => {
    await setFormData((prev: any) => {
      return {
        ...prev,
        Province: e.value,
        District: "",
      };
    });
    await refetchDistrict();
  };

  const handleChangeDistrict = async (e: any) => {
    await setFormData((prev: any) => {
      return {
        ...prev,
        District: e.value,
      };
    });
    await refetchWard();
  };

  let formRef = useRef<any>(null);
  const column: ColumnOptions[] = [
    {
      dataField: "Province",
      caption: "Tỉnh",
      editorType: "dxSelectBox",
      editorOptions: {
        onValueChanged: handleChangeProvince,
        dataSource: dataProvince ?? [],
        displayExpr: "ProvinceName",
        valueExpr: "ProvinceCode",
      },
    },
    {
      dataField: "District",
      caption: "Quận Huyện",
      editorType: "dxSelectBox",
      editorOptions: {
        onValueChanged: handleChangeDistrict,
        dataSource: dataDistrict ?? [],
        displayExpr: "DistrictName",
        valueExpr: "DistrictCode",
      },
    },
    {
      dataField: "Ward",
      caption: "Phường Xã",
      editorType: "dxSelectBox",
      editorOptions: {
        dataSource: dataWard ?? [],
        displayExpr: "WardName",
        valueExpr: "WardCode",
      },
    },
  ];

  const handleSubmit = (e: any) => {
    const formData = formRef?.current.instance.option("formData");
  };

  if (isLoadingWard || isLoadingDistrict || isLoadingProvince) {
    return <LoadPanel visible={true} />;
  }

  return (
    <div>
      <Form ref={formRef} formData={data}>
        {column.map((item: any, idx: number) => {
          return <SimpleItem {...item} key={idx} />;
        })}
      </Form>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};
