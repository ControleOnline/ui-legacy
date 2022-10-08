export const routes = [
  {
    path: "/",
    component: () => import("../../../../../src/layouts/MainLayout.vue"),
    children: [
      {
        name: "LoginIndex",
        path: "login",
        component: () => import("../pages/Login.vue"),
      },
    ],
  },
];
