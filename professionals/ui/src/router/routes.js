export const routes = [
  {
    path: '/professionals/',
    component: () => import('../../../../../src/layouts/AdminLayout.vue'),
    children: [
      {
        name: 'ProfessionalsIndex',
        path: '',
        component: () => import('../pages/Professional/Index.vue')
      },
      {
        name: 'ProfessionalsDetails',
        path: 'id/:id',
        component: () => import('../pages/Professional/Details.vue')
      },
    ]
  },
];