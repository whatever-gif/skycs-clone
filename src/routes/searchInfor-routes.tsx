import SearchCategory from "@/pages/SearchMST/components/SearchCategory";
import SearchDetail from "@/pages/SearchMST/components/SearchDetail";
import SearchHistory from "@/pages/SearchMST/components/SearchHistory";
import SearchResults from "@/pages/SearchMST/components/SearchResults";
import { SearchMSTPage } from "@/pages/SearchMST/list/SearchMST";
import { RouteItem } from "@/types";

export const searchRoutes: RouteItem[] = [
  {
    key: "SearchMSTPage",
    path: "search/SearchInformation",
    mainMenuKey: "search",
    permissionCode: "MNU_SEARCH_INFORMATION",
    getPageElement: () => <SearchMSTPage />,
    children: [
      {
        key: "History",
        path: "History",
        subMenuTitle: "",
        mainMenuKey: "search",
        permissionCode: "BTN_ADMIN_TRACUU_RECENT",
        getPageElement: () => <SearchHistory />,
      },
      {
        key: "Category",
        path: "Category",
        subMenuTitle: "",
        mainMenuKey: "search",
        permissionCode: "MNU_SEARCH_INFORMATION",
        getPageElement: () => <SearchCategory />,
      },
      {
        key: "Results",
        path: "Results",
        subMenuTitle: "",
        mainMenuKey: "search",
        permissionCode: "MNU_SEARCH_INFORMATION",
        getPageElement: () => <SearchResults />,
      },
    ],
  },

  {
    key: "SearchDetail",
    path: "search/SearchInformation/Detail/:idInforSearch",
    subMenuTitle: "",
    mainMenuKey: "search",
    permissionCode: "MNU_SEARCH_INFORMATION",
    getPageElement: () => <SearchDetail />,
  },
];
