import Button from "devextreme-react/button";
import { forwardRef } from "react";

import "./page-navigator.scss";
interface PageNavigatorProps {
  itemCount: number;
  currentPage: number;
  onPageChanged: (pageIndex: number) => void;
  pageSize: number;
  pageCount: number;
}

export const PageNavigator = forwardRef(
  (
    {
      currentPage,
      itemCount,
      pageSize,
      pageCount,
      onPageChanged,
    }: PageNavigatorProps,
    ref: any
  ) => {
    return (
      <div ref={ref} className={"page-navigator min-w-fit flex items-center"}>
        <div className={"paginator__previous-page"}>
          <Button
            stylingMode={"outlined"}
            className={"border-2"}
            icon={"chevronleft"}
            disabled={currentPage < 1}
            onClick={() => onPageChanged(currentPage - 1)}
          />
        </div>

        <div
          className={
            "page-navigator__current-page w-full flex items-center justify-between"
          }
        >
          <div
            className={`paginator__page-index 
                                 paginator__current 
                                 flex items-center px-1 cursor-pointer hover:text-emerald-500 hover:font-bold`}
          >
            <span>{currentPage + 1}</span>
          </div>
        </div>
        <div className={"paginator__next-page"}>
          <Button
            stylingMode={"outlined"}
            icon={"chevronright"}
            disabled={currentPage >= pageCount - 1}
            onClick={() => onPageChanged(currentPage + 1)}
          />
        </div>
      </div>
    );
  }
);
PageNavigator.displayName = "PageNavigator";
