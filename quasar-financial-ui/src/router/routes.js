export const routes = [
  {
    path: "/finance",
    component: () =>
      import("@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "FinanceExpenseIndex",
        path: "expense",
        component: () => import("../pages/Expense/Invoice.vue"),
      },

      {
        name: "FinanceReceiveIndex",
        path: "receive",
        component: () => import("../pages/Receive/Invoice.vue"),
      },
      {
        name: "FinanceExpenseCategories",
        path: "categories/expense",
        component: () => import("../pages/Expense/Categories.vue"),
      },
      {
        name: "FinanceReceiveCategories",
        path: "categories/receive",
        component: () => import("../pages/Receive/Categories.vue"),
      },

      {
        name: "FinanceReports",
        path: "reports",
        component: () => import("../pages/Reports/Reports.vue"),
      },
    ],
  },
];
