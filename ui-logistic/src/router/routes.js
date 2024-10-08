export const routes = [
  {
    path: "/sales/",
    component: () =>
      import("@controleonline/ui-layout/src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "ClientShippingQuoteIndex",
        path: "quote",
        component: () => import("../pages/ClientQuote.vue"),
      },
      {
        name: "ShippingQuoteIndex",
        path: "shipping-quote",
        component: () => import("../pages/Quote.vue"),
      },
    ],
  },
  {
    path: "/purchasing/",
    component: () =>
      import("@controleonline/ui-layout/src/layouts/AdminLayout.vue"),
    children: [
      {
        name: "ClientPurchasingShippingQuoteIndex",
        path: "quote",
        component: () => import("../pages/ClientQuote.vue"),
      },
      {
        name: "PurchasingShippingQuoteIndex",
        path: "shipping-quote",
        component: () => import("../pages/Quote.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () =>
      import("@controleonline/ui-layout/src/layouts/MainLayout.vue"),
    children: [
      {
        name: "QuoteIndex",
        path: "quote",
        component: () => import("../pages/ClientQuote.vue"),
      },
    ],
  },
];
