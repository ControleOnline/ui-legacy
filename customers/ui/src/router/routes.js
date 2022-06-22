export const routes = [
  {
    path: '/customers/',
    component: () => import('../../../../../src/layouts/AdminLayout.vue'),
    children: [
      {
        name: 'CustomersIndex',
        path: '',
        component: () => import('../pages/Customer/Index.vue')
      },
      {
        name: 'CustomersDetails',
        path: 'id/:id',
        component: () => import('../pages/Customer/Details.vue')
      },
    ]
  },
];