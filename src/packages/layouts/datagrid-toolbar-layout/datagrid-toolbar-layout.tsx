import {PropsWithChildren} from "react";
import {withSlot} from "@packages/hooks/useSlot";

export const Layout = ({children}: PropsWithChildren<{}>) => {
  const LastTemplate = withSlot({
    children,
    name: "Last",
  })
  return (
    <div className={'w-full flex'}>

    </div>
  )
}


export const DataGridToolbarLayout = withSlot(Layout);