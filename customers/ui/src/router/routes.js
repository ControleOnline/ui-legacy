export const routes = [

    {
        path     : '/customers/',
        component: () => import('../../../../../src/layouts/AdminLayout.vue'),
        children : [
          {
            name     : 'ClientsIndex',
            path     : '',
            component: () => import('@controleonline/quasar-customers-ui/src/pages/Clients/Index.vue')
          },
          {
            name     : 'ClientsDetails',
            path     : 'id/:id',
            component: () => import('@controleonline/quasar-customers-ui/src/pages/Clients/Details.vue')
          },
        ]
      },
      {
        path: '*', redirect: '/finance/receive'
      },

]