
export const routes = [
    {
      path     : '/finance/',
      component: () => import('../../../../../src/layouts/AdminLayout.vue'),
      children : [
        { 
            name: 'InvoiceIndex', 
            path: 'pay', 
            component: () => import('../pages/Invoice/Pay/Index.vue')
        },
        { 
            name: 'Admin.InvoicePay.Details', 
            path: 'pay/id/:id', 
            component: () => import('../pages/Invoice/Pay/Details.vue') 
        },
        { 
            name: 'ReceiveIndex', 
            path: 'receive', 
            component: () => import('../pages/Invoice/Receive/Index.vue')
        },
        { 
            name: 'ReceiveDetails', 
            path: 'receive/id/:id', 
            component: () => import('../pages/Invoice/Receive/Details.vue')
        },
      ]
    },
];
