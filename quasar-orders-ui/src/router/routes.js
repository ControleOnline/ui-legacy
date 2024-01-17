export const routes = [
  {
    path: "/sales/",
    component: () =>
      import("@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "SalesOrderIndex",
        path: "order",
        component: () => import("../pages/Orders/Sales/Index.vue"),
      },
      {
        name: "OrderDetails",
        path: "order/id/:id",
        component: () => import("../pages/Orders/Sales/Order.vue"),
      },
      {
        name: "StretchSearching",
        path: "stretchSearching",
        component: () =>
          import("../pages/Orders/Sales/OrderLogisticSearching.vue"),
      },
    ],
  },
  {
    path: "/client/",
    component: () =>
      import("@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "ClientOrderIndex",
        path: "order",
        component: () => import("../pages/Orders/Client/Index.vue"),
      },
      {
        name: "ClientOrderDetails",
        path: "order/id/:id",
        component: () => import("../pages/Orders/Client/Order.vue"),
      },
    ],
  },
  {
    path: "/purchasing/",
    component: () =>
      import("@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "PurchasingOrderIndex",
        path: "order",
        component: () => import("../pages/Orders/Purchasing/Index.vue"),
      },
      {
        name: "PurchasingOrderDetails",
        path: "order/id/:id",
        component: () => import("../pages/Orders/Purchasing/Order.vue"),
      },
    ],
  },
  {
    path: "/task/",
    component: () =>
      import("@controleonline/quasar-layout-ui/src/layouts/MainLayout.vue"),
    children: [
      {
        name: "ChecklistDetails",
        path: "checklist/id/:id/:token_url",
        component: () => import("../pages/Surveys/ChecklistDetails.vue"),
      },
    ],
  },
];
