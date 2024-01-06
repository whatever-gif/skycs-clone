import { Tabs } from "devextreme-react/tabs";
import { Outlet, useLocation } from "react-router-dom";
import { useNetworkNavigate } from "@packages/hooks";

export const TestTabsPage = () => {
  const { pathname, search } = useLocation();
  const navigate = useNetworkNavigate();
  const tabName = pathname.split("/").pop();

  const items = [
    {
      id: "tab1",
      text: "Tab 1",
    },
    {
      id: "tab2",
      text: "Tab 2",
    },
  ];
  const selectedIndex = items.findIndex((item) => item.id === tabName);
  const handleItemClick = ({ itemIndex, itemData }: any) => {
    navigate(`/admin/testTabs/${itemData.id}`);
  };
  return (
    <div>
      <h1>TestTabsPage</h1>
      <Tabs
        onItemClick={handleItemClick}
        items={items}
        selectedIndex={selectedIndex}
      />
      <Outlet />
    </div>
  );
};

export const Tab1Page = () => {
  const { pathname, search } = useLocation();
  return (
    <div>
      <h1>Tab1Page</h1>
    </div>
  );
};

export const Tab2Page = () => {
  return (
    <div>
      <h1>Tab2Page</h1>
    </div>
  );
};
