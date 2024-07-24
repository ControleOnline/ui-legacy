export const routes = [
  {
    path: "/home/",
    component: () =>
      import("@controleonline/ui-layout/src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "DashboardIndex",
        path: "dashboard",
        component: () => import("../pages/Dashboard.vue"),
      },
    ],
  },
];
