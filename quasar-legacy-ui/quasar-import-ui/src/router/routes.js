export const routes = [
  {
    path: '/imports/',
    component: () =>  import ('@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue'),
    children: [
      {
        name: 'ImportIndex',
        path: '',
        component: () =>  import ('../pages/Import/Index.vue')
      },

    ]
  }, {
    path: '/import/',
    component: () =>  import ('@controleonline/quasar-layout-ui/src/layouts/MainLayout.vue'),
    children: [
      {
        name: 'ImportDetails',
        path: 'id/:id',
        component: () =>  import ('../pages/Import/Details.vue')
      }
    ]
  },
];
