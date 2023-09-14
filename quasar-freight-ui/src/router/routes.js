
export const routes = [
    {
        path: '/freight/',
        component: () =>  import ('@controleonline/quasar-layout-ui/src/layouts/MainLayout.vue'),
        children: [
            {
                name: 'FreightQuoteIndex',
                path: 'quote',
                component: () =>  import ('../pages/FreightQuote.vue')
            }
        ]
    },
];
