export const routes = [
  {
    path     : '/crm/',
    component: () => import('../../../../../src/layouts/AdminLayout.vue'),
    children : [
      {
        name     : 'CustomerServices',
        path     : '',
        component: () => import('../pages/CRM/Index.vue')
      },
      {
        name     : 'CrmDetails',
        path     : 'id/:id',
        component: () => import('../pages/CRM/Details.vue')
      }
    ]
  } 
];
