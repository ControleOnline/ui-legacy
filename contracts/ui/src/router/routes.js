export const routes = [
  {
    path: '/contracts/',
    component: () => import('../../../../../src/layouts/AdminLayout.vue'),
    children: [
      { 
        name: 'ContractIndex'  , 
        path: ''      , 
        component: () => import('../pages/Contracts/Index.vue'  ) 
      },
      { 
        name: 'ContractDetails', 
        path: 'id/:id', 
        component: () => import('../pages/Contracts/Details.vue') 
      },
    ]
  },
  {
    path: '/contract/',
    component: () => import('layouts/MainLayout.vue'),
    children: [      
      { name: 'ContractAccept', path: '/accept/:id', component: () => import('../pages/Contracts/Accept.vue') },      
    ]
  }
];