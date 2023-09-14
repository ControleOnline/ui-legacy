
export const routes = [
    {
      path     : '/',
      component: () =>  import ('@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue'),
      children : [  
        { 
            name: 'ProductList', 
            path: 'products/', 
            component: () =>  import ('../pages/Products/List.vue')
        },
        { 
            name: 'ProductDetails', 
            path: 'product/id/:id', 
            component: () =>  import ('../pages/Products/Details.vue') 
        },
        
      ]
    },
];
