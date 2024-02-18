export const routes = [
  {
    path: "/orders/",
    component: () =>
      import("@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "SalesOrderIndex",
        path: "sales",
        component: () => import("../pages/Orders"),
      },
    ],
  },
];
