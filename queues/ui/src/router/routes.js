export const routes = [
  {
    path     : '/queues/',
    component: () => import('../../../../../src/layouts/AdminLayout.vue'),
    children : [
      {
        name     : 'queueIndex',
        path     : '',
        component: () => import('@controleonline/quasar-queues-ui/src/pages/Queues/Index.vue')
      },
      {
        name     : 'queueCategory',
        path     : 'categories',
        component: () => import('@controleonline/quasar-queues-ui/src/pages/Queues/QueueCategory.vue')
      },
      {
        name     : 'queuePeople',
        path     : 'queue-people',
        component: () => import('@controleonline/quasar-queues-ui/src/pages/Queues/QueuePeople.vue')
      },
      {
        name     : 'queuePeopleQueue',
        path     : 'queue-people-queues',
        component: () => import('@controleonline/quasar-queues-ui/src/pages/Queues/QueuePeopleQueue.vue')
      },
    ]
  },
  {
    path     : '/hardwares/',
    component: () => import('../../../../../src/layouts/AdminLayout.vue'),
    children : [
      {
        name     : 'hardwares',
        path     : '',
        component: () => import('@controleonline/quasar-queues-ui/src/pages/Hardwares/Index.vue')
      },
      {
        name     : 'hardwareQueues',
        path     : 'queues',
        component: () => import('@controleonline/quasar-queues-ui/src/pages/Hardwares/HardwareQueue.vue')
      },
    ]
  },
];
