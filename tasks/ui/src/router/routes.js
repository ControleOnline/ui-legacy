export const routes = [
  {
    path     : '/tasks/',
    component: () =>  import ('@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue'),
    children : [
      {
        name     : 'SupportIndex',
        path     : '',
        component: () =>  import ('../pages/Tasks/Index.vue')
      },
      {
        name     : 'SupportDetails',
        path     : 'id/:id',
        component: () =>  import ('../pages/Tasks/Details.vue')
      }
    ]
  },  {
    path     : '/task/',
    component: () =>  import ('@controleonline/quasar-layout-ui/src/layouts/MainLayout.vue'),
    children : [

      {
        name     : 'ChecklistDetails',
        path     : 'checklist/id/:id/:token_url',
        component: () =>  import ('../pages/Tasks/ChecklistDetails.vue')
      },
    ]
  },
];
