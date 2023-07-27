export const routes = [
  {
    path: "/products/",
    component: () => import("../../../../../src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "ProductList",
        path: "",
        component: () => import("../pages/Products/List.vue"),
      },
    ],
  },
  {
    path: "/product/",
    component: () => import("../../../../../src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "ProductDetails",
        path: "id/:id",
        component: () => import("../pages/Products/Details.vue"),
      },
      {
        name: "ProductNew",
        path: "new",
        component: () => import("../pages/new/product.vue"),
      },
    ],
  },
];
