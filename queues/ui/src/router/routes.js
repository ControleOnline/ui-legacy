export const routes = [
  {
    path     : '',
    component: () =>  import ('../../../../../src/layouts/AdminLayout.vue'),
    children : [

      {
        name     : 'queueList',
        path     : '/displays/',
        component: () =>  import ('../pages/Display/Displays.vue')
      },
      {
        name     : 'queueIndex',
        path     : '/displays/id/:id',
        component: () =>  import ('../pages/Display/Queue.vue')
      },
    ]
  }
];
