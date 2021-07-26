export const routes = [
  {
    path     : '/customers/',
    component: () => import('../../../../../src/layouts/AdminLayout.vue'),
    children : [
      {
        name     : 'ClientsIndex',
        path     : '',
        component: () => import('../pages/Clients/Index.vue')
      },
      {
        name     : 'ClientsDetails',
        path     : 'id/:id',
        component: () => import('../pages/Clients/Details.vue')
      },
    ]
  },
];