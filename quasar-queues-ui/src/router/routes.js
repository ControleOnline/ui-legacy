export const routes = [
  {
    path: "/hardwares",
    component: () => import("@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "hardwareList",
        path: "",
        component: () => import("../pages/Hardware/List.vue"),
      },
      {
        name: "hardwareDetails",
        path: "id/:id",
        component: () => import("../pages/Displays/Queue.vue"),
      }
    ],
  },

  {
    path: "/displays  ",
    component: () => import("@controleonline/quasar-layout-ui/src/layouts/MainLayout.vue"),
    children: [
      {
        name: "displayList",
        path: "",
        component: () => import("../pages/Displays/Displays.vue"),
      },
      {
        name: "displayDetails",
        path: "id/:id",
        component: () => import("../pages/Displays/Queue.vue"),
      }
    ],
  },

];
