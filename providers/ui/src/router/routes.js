export const routes = [
  {
    path     : '/providers/',
    component: () => import('../../../../../src/layouts/AdminLayout.vue'),
    children : [
      {
        name     : 'ProvidersIndex',
        path     : '',
        component: () => import('../pages/Providers/Index.vue')
      },
      {
        name     : 'ProvidersDetails',
        path     : 'id/:id',
        component: () => import('../pages/Providers/Details.vue')
      },
    ]
  },
];