
export const routes = [
    {
        path: '/freight/',
        component: () =>  import ('../../../../../src/layouts/MainLayout.vue'),
        children: [
            {
                name: 'FreightQuoteIndex',
                path: 'quote',
                component: () =>  import ('../pages/FreightQuote.vue')
            }
        ]
    },
];
