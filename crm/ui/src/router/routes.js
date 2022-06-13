export const routes = [
  {
    path     : '/customer-services/',
    component: () => import('../../../../../src/layouts/AdminLayout.vue'),
    children : [
      {
        name     : 'customerServices',
        path     : '',
        component: () => import('../pages/CustomerServices.vue')
      },
      {
        name     : 'customerServiceEdit',
        path     : 'edit/:id',
        component: () => import('../pages/CustomerServiceEdit.vue')
      },
    ]
  }
]
