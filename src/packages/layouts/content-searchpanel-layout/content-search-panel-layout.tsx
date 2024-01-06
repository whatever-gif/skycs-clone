import { usePermissions } from "@packages/contexts/permission";
import { useSlot, withSlot } from "@packages/hooks/useSlot";
import { useWindowSize } from "@packages/hooks/useWindowSize";
import { ScrollView } from "devextreme-react";
import Drawer from "devextreme-react/drawer";
import { useAtomValue } from "jotai";
import { PropsWithChildren, useMemo } from "react";
import "./content-search-panel-layout.scss";
import { searchPanelVisibleAtom } from "./store";

interface ContentSearchPanelLayoutProps {
  searchPermissionCode?: string;
}

export const InnerContentSearchPanelLayout = ({
  children,
  searchPermissionCode,
}: PropsWithChildren<ContentSearchPanelLayoutProps>) => {
  const searchPanelVisible = useAtomValue(searchPanelVisibleAtom);
  const windowSize = useWindowSize();
  const SearchPanelSlot = useSlot({
    children,
    name: "SearchPanel",
  });
  const ContentPanelSlot = useSlot({
    children,
    name: "ContentPanel",
  });
  const { hasButtonPermission } = usePermissions();
  // avoid re-render when toggling search panel
  const contentMemo = useMemo(() => <ContentPanelSlot />, []);

  // avoid re-render when toggling search panel
  const searchMemo = useMemo(() => <SearchPanelSlot />, []);

  const hasPermissionToSearch = !searchPermissionCode
    ? true
    : hasButtonPermission(searchPermissionCode);
  return (
    <div className={"h-full content-with-search-layout"}>
      <Drawer
        opened={searchPanelVisible && hasPermissionToSearch}
        openedStateMode={"shrink"}
        position="left"
        revealMode={"slide"}
        height={"100%"}
        render={() => (
          <ScrollView
            width={"20%"}
            className={"min-w-[300px] relative"}
            id={"search-pane"}
          >
            {searchMemo}
          </ScrollView>
        )}
      >
        {contentMemo}
      </Drawer>
    </div>
  );
};

export const ContentSearchPanelLayout = withSlot(InnerContentSearchPanelLayout);
