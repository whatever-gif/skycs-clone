import {useAtomValue} from "jotai";
import {normalGridSelectionKeysAtom} from "@packages/ui/base-gridview/store/normal-grid-store";
import {Button} from "devextreme-react";
import {useI18n} from "@/i18n/useI18n";

export const DeleteButton = ({onClick}: {onClick: () => void}) => {
  const {t} = useI18n("Common")
  const selectionKeys = useAtomValue(normalGridSelectionKeysAtom)
  if(selectionKeys.length === 0) return null
  return (
    <Button stylingMode={'contained'}
            type={'default'}
            text={t('Delete')}
            onClick={onClick}
            />
    
  )
}