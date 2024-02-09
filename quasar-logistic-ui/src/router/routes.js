export const routes = [
  {
    path: "/logistic/",
    component: () =>
      import("@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "ChecklistDetails",
        path: "checklist/id/:id/:token_url",
        component: () => import("../pages/Surveys/ChecklistDetails.vue"),
      },
      {
        name: "StretchSearching",
        path: "",
        component: () => import("../pages/Logistic/OrderLogisticSearching.vue"),
      },
    ],
  },
];
