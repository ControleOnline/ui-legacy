export const routes = [
  {
    path     : '/',
    component: () =>  import ('../../../../../src/layouts/AdminLayout.vue'),
    children : [
      {
        name     : 'queueIndex',
        path     : 'display/:id',
        component: () =>  import ('../pages/Display/Display.vue')
      },
      
    ]
  }
];
