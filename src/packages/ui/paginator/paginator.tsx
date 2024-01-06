import Button from "devextreme-react/button";
import { SelectBox } from "devextreme-react";
import { useTranslation } from "react-i18next";

import './paginator.scss';
import { useI18n } from "@/i18n/useI18n";

interface PaginatorProps {
  currentPage: number;
  totalCount: number;
  totalPages?: number;
  onNextPage?: (current: number) => void,
  onPreviousPage?: (current: number) => void;
  onChangePageSize?: (pageSize: number) => void;
  onChangePageIndex?: (pageIndex: number) => void;
  pageSize?: number;
  showPageRange?: boolean;
}

export const Paginator = ({
  currentPage,
  totalCount,
  showPageRange,
  totalPages = 0,
  onNextPage,
  onPreviousPage,
  onChangePageSize,
  onChangePageIndex,
  pageSize = 10,
}: PaginatorProps) => {
  const { t } = useI18n("Common");
  const start = currentPage * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalCount);

  return (
    <div className={'paginator'}>
      <div className={'summary flex items-center'}>
        <span className={'mx-1'}>{t('paginator.showing')}</span>
        <SelectBox items={[10, 20, 30]}
          className={'flex w-[50px] mx-1'}
          placeholder={''}
          defaultValue={10}
          onValueChanged={(e) => onChangePageSize?.(e.value)}
        />
        <span className={'mx-1'}>{t('paginator.summary', { start, end, totalCount })}</span>
      </div>
      <div className={'paginator__previous-page'}>
        <Button stylingMode={'outlined'} className={'border-2'} icon={'chevronleft'} disabled={currentPage < 1}
          onClick={() => onPreviousPage?.(currentPage - 1)} />
      </div>
      {showPageRange &&
        <div className={'paginator__pages'}>
          {
            Array(totalPages).fill(0)
              .map((item, index) => {
                return (
                  <div key={index} onClick={() => onChangePageIndex?.(index)}
                    className={`paginator__page-index 
                                 ${index === currentPage ? 'paginator__current rounded border-2 border-blue-400' : ''} 
                                 flex items-center px-4 cursor-pointer hover:text-emerald-500 hover:font-bold`}>
                    <span>{index + 1}</span>
                  </div>);
              })
          }
        </div>
      }
      <div className={'paginator__next-page'}>
        <Button stylingMode={'outlined'} icon={'chevronright'} disabled={currentPage >= totalPages - 1}
          onClick={() => onNextPage?.(currentPage + 1)} />
      </div>
    </div>
  );
};