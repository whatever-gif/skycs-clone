import { PageHeaderNoSearchLayout } from "@layouts/page-header-layout-2/page-header-nosearch-layout";

interface HeaderPartProps {
  title: string;
}

export const ReportPageHeader = ({ title }: HeaderPartProps) => {
  return (
    <PageHeaderNoSearchLayout>
      <PageHeaderNoSearchLayout.Slot name={"Before"}>
        <div className="text-header font-bold dx-font-m">{title}</div>
      </PageHeaderNoSearchLayout.Slot>
      <PageHeaderNoSearchLayout.Slot
        name={"After"}
      ></PageHeaderNoSearchLayout.Slot>
    </PageHeaderNoSearchLayout>
  );
};
