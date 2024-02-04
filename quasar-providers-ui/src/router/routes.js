export const routes = [
  {
    path: '/peoples/',
    component: () =>  import ('@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue'),
    children: [
      {
        name: 'ProvidersIndex',
        path: '',
        component: () =>  import ('../pages/Provider/Index.vue')
      },
      {
        name: 'ProvidersDetails',
        path: 'id/:id',
        component: () =>  import ('../pages/Provider/Details.vue')
      },
    ]
  },
];