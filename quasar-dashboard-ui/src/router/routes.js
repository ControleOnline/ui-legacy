export const routes = [
  {
    path: "/home/",
    component: () =>
      import("@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "DashboardIndex",
        path: "dashboard",
        component: () => import("../pages/Dashboard.vue"),
      },
    ],
  },
];
