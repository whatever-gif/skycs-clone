import { useI18n } from "@/i18n/useI18n";
import Button from "devextreme-react/button";
import Popup, { ToolbarItem } from "devextreme-react/popup";
import {PropsWithChildren} from "react";
import {VisibilityControl} from "@packages/hooks";
import {useSlot, withSlot} from "@packages/hooks/useSlot";

export interface ModalBoxProps {
  control: VisibilityControl
  onYesClick?: Function;
  onNoClick?: Function;
  title: string;
}
const ModalBoxRaw = ({control, title, onNoClick, onYesClick, children}: PropsWithChildren<ModalBoxProps>) => {
  const { t } = useI18n("Common");
  const handleYesClick = () => {
    control.close();
    onYesClick?.();
  };

  const handleNoClick = () => {
    control.close();
    onNoClick?.();
  };
  
  const BottomSlot = useSlot({
    name: "Bottom",
    children,
    fallback: (
      <>
      </>
    )
  })
  
  const ContentSlot = useSlot({
    name: "Content",
    children,
  })

  if(!control.visible) return "";
  
  return (
    <Popup
      visible={true}
      dragEnabled={false}
      showTitle={true}
      title={title}
      onHiding={handleNoClick}
      height={200}
      width={400}
    >
      <BottomSlot />
      <ContentSlot />
      <ToolbarItem location='after' toolbar={'bottom'}>
        <Button className="w-[120px]" type="default" stylingMode="contained" text={t('Yes')} onClick={handleYesClick} />
      </ToolbarItem>
      <ToolbarItem location='after' toolbar={'bottom'}>
        <Button className="w-[100px]" text={t('No')} onClick={handleNoClick} stylingMode="contained" />
      </ToolbarItem>
    </Popup>
  )
}
export const ModalBox = withSlot(ModalBoxRaw);