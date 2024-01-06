import {useAtomValue} from "jotai";
import {gridStateAtom} from "@packages/ui/base-gridview/store/normal-grid-store";
import {PageNavigator} from "@packages/ui/page-navigator";

interface NormalGridPageNavigatorProps {
  onPageChanged: (pageIndex: number) => void;
}

export const NormalGridPageNavigator = ({onPageChanged}: NormalGridPageNavigatorProps) => {
  const {pageIndex, pageSize, pageCount, totalCount} = useAtomValue(gridStateAtom)
  return (
    <PageNavigator 
      itemCount={totalCount ?? 0} 
      currentPage={pageIndex}
      onPageChanged={onPageChanged}
      pageSize={pageSize}
      pageCount={pageCount ?? 0}
    />

  )
}