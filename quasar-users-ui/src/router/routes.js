export const routes = [
  {
    path: "/user/",
    component: () =>
      import("@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "UserProfile",
        path: "profile",
        component: () => import("../pages/Profile.vue"),
      },
    ],
  },
  // {
  //   path: "/oauth/",
  //   component: () =>
  //     import("@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue"),
  //   children: [
  //     {
  //       path: "/mercadolivre/return",
  //       name: "mercadolivre-return",
  //       component: () => import("../pages/Oauth/MercadoLivre/return.vue"),
  //     },
  //   ],
  // },'
];
