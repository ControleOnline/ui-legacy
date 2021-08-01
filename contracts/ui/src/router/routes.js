export const routes = [
  {
    path: '/contracts/',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { name: 'ContractIndex'  , path: ''      , component: () => import('../pages/Contracts/Index.vue'  ) },
      { name: 'ContractDetails', path: 'id/:id', component: () => import('../pages/Contracts/Details.vue') },
    ]
  }
];