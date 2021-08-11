export const routes = [
  {
    path     : '/tasks/',
    component: () => import('../../../../../src/layouts/AdminLayout.vue'),
    children : [
      {
        name     : 'TasksIndex',
        path     : '',
        component: () => import('../pages/Tasks/Index.vue')
      },
      {
        name     : 'TasksDetails',
        path     : 'id/:id',
        component: () => import('../pages/Tasks/Details.vue')
      },
      {
        name     : 'TaskCategoryDetails',
        path     : 'category/id/:id',
        component: () => import('../pages/Tasks/CategoryDetails.vue')
      },
    ]
  },
];