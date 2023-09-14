export const routes = [
  {
    path: "/displays",
    component: () => import("@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "displayList",
        path: "",
        component: () => import("../pages/Display/Displays.vue"),
      },
      {
        name: "displayIndex",
        path: "id/:id",
        component: () => import("../pages/Display/Queue.vue"),
      }
    ],
  },

  {
    path: "/queues",
    component: () => import("@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "queueList",
        path: "",
        component: () => import("../pages/Display/List.vue"),
      },
      {
        name: "queueIndex",
        path: "id/:id",
        component: () => import("../pages/Display/Queue.vue"),
      }
    ],
  },

];
