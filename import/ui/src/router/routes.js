export const routes = [
  {
    path: '/imports/',
    component: () =>  import ('../../../../../src/layouts/AdminLayout.vue'),
    children: [
      {
        name: 'importIndex',
        path: '',
        component: () =>  import ('../pages/import/Index.vue')
      },

    ]
  }, {
    path: '/import/',
    component: () =>  import ('../../../../../src/layouts/MainLayout.vue'),
    children: [
      {
        name: 'importDetails',
        path: 'id/:id',
        component: () =>  import ('../pages/import/Details.vue')
      }
    ]
  },
];
