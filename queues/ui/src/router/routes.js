export const routes = [
  {
    path: "/displays",
    component: () => import("../../../../../src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "queueList",
        path: "",
        component: () => import("../pages/Display/Displays.vue"),
      },
      {
        name: "queueIndex",
        path: "/id/:id",
        component: () => import("../pages/Display/Queue.vue"),
      },
    ],
  },
];
