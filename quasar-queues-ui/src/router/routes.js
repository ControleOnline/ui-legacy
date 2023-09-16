export const routes = [
  {
    path: "/hardwares",
    component: () => import("@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "hardwareList",
        path: "",
        component: () => import("../pages/Hardware/Hardwares.vue"),
      },
      {
        name: "hardwareDetails",
        path: "id/:id",
        component: () => import("../pages/Hardware/Queue.vue"),
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
        component: () => import("../pages/Hardware/List.vue"),
      }
    ],
  },

];
