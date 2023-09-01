
export const routes = [
    {
      path     : '/finance/',
      component: () =>  import ('@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue'),
      children : [
        { name: 'ClientInvoiceIndex', path: 'client', component: () =>  import ('../pages/Invoice/Client/Index.vue') },
        { name: 'ClientInvoiceDetails', path: 'client/id/:id', component: () =>  import ('../pages/Invoice/Client/Details.vue') },
  
        { 
            name: 'FinancePayIndex', 
            path: 'pay', 
            component: () =>  import ('../pages/Invoice/Pay/Index.vue')
        },
        { 
            name: 'PayDetails', 
            path: 'pay/id/:id', 
            component: () =>  import ('../pages/Invoice/Pay/Details.vue') 
        },
        { 
            name: 'FinanceReceiveIndex', 
            path: 'receive', 
            component: () =>  import ('../pages/Invoice/Receive/Index.vue')
        },
        { 
            name: 'ReceiveDetails', 
            path: 'receive/id/:id', 
            component: () =>  import ('../pages/Invoice/Receive/Details.vue')
        },
        { 
            name: 'PayCategories', 
            path: 'categories', 
            component: () =>  import ('../pages/Invoice/Categories.vue')
        },

      ]
    },
];
