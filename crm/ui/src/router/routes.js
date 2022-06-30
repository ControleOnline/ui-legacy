export const routes = [
  {
    path: '/crm/',
    component: () => import('../../../../../src/layouts/AdminLayout.vue'),
    children: [
      {
        name: 'CustomerServices',
        path: '',
        component: () => import('@controleonline/quasar-customers-ui/src/pages/Customer/Index.vue')
      },
      {
        name: 'RelationshipDetails',
        path: 'id/:id',
        component: () => import('../pages/CRM/Details.vue')
      }
    ]
  }
];
