export const routes = [
  {
    path: "/displays",
    component: () => import("@controleonline/quasar-layout-ui/src/layouts/MainLayout.vue"),
    children: [
      {
        name: "queueList",
        path: "",
        component: () => import("../pages/Display/Displays.vue"),
      },
      {
        name: "queueIndex",
        path: "id/:id",
        component: () => import("../pages/Display/Queue.vue"),
      },
    ],
  },
];
