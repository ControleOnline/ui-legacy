
export const routes = [
    {
        path: '/shop/',
        component: () => import('../../../../../src/layouts/AdminLayout.vue'),
        children: [
            {
                name: 'ClientShippingQuoteIndex',
                path: 'quote',
                component: () => import('../pages/ClientQuote.vue')
            },
            {
                name: 'ShippingQuoteIndex',
                path: 'shipping-quote',
                component: () => import('../pages/Quote.vue')
            }
        ]
    }
];
