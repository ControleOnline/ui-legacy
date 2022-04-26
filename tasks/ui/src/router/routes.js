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
      }
    ]
  },  {
    path     : '/task/',
    component: () => import('../../../../../src/layouts/MainLayout.vue'),
    children : [

      {
        name     : 'ChecklistDetails',
        path     : 'checklist/id/:id/:token_url',
        component: () => import('../pages/Tasks/ChecklistDetails.vue')
      },
    ]
  },
];
