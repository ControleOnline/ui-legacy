export const routes = [
  {
    path: "/finance",
    component: () =>
      import("@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "FinanceIndex",
        path: ":context",
        component: () => import("../pages/Invoice/Invoice.vue"),
      },
      {
        name: "FinanceCategories",
        path: "categories/:context",
        component: () => import("../pages/Invoice/Categories.vue"),
      },
    ],
  },
];
