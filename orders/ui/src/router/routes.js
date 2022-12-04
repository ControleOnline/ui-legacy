
export const routes = [
    {
        path: '/sales/',
        component: () => import('../../../../../src/layouts/AdminLayout.vue'),
        children: [
            {
                name: 'SalesOrderIndex',
                path: 'order',
                component: () => import('../pages/Orders/Sales/Index.vue')
            },
            {
                name: 'OrderDetails',
                path: 'order/id/:id',
                component: () => import('../pages/Orders/Sales/Order.vue')
            },
            {
                name: 'stretchSearching',
                path: 'stretchSearching',
                component: () => import('../pages/Orders/Sales/searching.vue')
            },
        ]
    },
    {
        path: '/client/',
        component: () => import('../../../../../src/layouts/AdminLayout.vue'),
        children: [
            {
                name: 'ClientOrderIndex',
                path: 'order',
                component: () => import('../pages/Orders/Client/Index.vue')
            },
            {
                name: 'ClientOrderDetails',
                path: 'order/id/:id',
                component: () => import('../pages/Orders/Client/Order.vue')
            },
        ]
    },
    {
        path: '/purchasing/',
        component: () => import('../../../../../src/layouts/AdminLayout.vue'),
        children: [
            {
                name: 'PurchasingOrderIndex',
                path: 'order',
                component: () => import('../pages/Orders/Purchasing/Index.vue')
            },
            {
                name: 'PurchasingOrderDetails',
                path: 'order/id/:id',
                component: () => import('../pages/Orders/Purchasing/Order.vue')
            },
        ]
    },
];
