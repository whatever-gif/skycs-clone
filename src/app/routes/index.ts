import AdminPage from "@/pages/admin-page/admin-page";

export const topBarItems = [
  {
    key: "sales",
    path: "/sales",
    element: AdminPage,
  },
  {
    key: "payment",
    path: "/payment",
    element: AdminPage,
  },
  {
    key: "contract",
    path: "/contract",
    element: AdminPage,
  },
  {
    key: "logistic",
    path: "/logistic",
    element: AdminPage,
  },
  {
    key: "report",
    path: "/report",
    element: AdminPage,
  },
  {
    path: "/admin",
    key: "admin",
    element: AdminPage,
    children: [
      {
        key: "cityManagement",
        path: "city",
        element: AdminPage,
      },
    ],
  },
];

export const adminSideBarItems = [
  {
    key: "cityManagement",
    path: "/admin/city",
    element: AdminPage,
  },
];
