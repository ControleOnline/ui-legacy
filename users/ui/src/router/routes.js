export const routes = [
  {
    path: '/user/',
    component: () => import('../../../../../src/layouts/AdminLayout.vue'),
    children: [
      { name: 'UserProfile', path: 'profile', component: () => import('../pages/User/Profile.vue') },
    ]
  },
  {
    path: '/company/',
    component: () => import('../../../../../src/layouts/AdminLayout.vue'),
    children: [
      {
        name: 'CompanyIndex',
        path: '',
        component: () => import('../pages/admin/Company/Index.vue')
      },
      {
        name: 'CompanyDetailsPage',
        path: 'id/:id',
        component: () => import('../pages/admin/Company/Details.vue')
      },
    ]
  },
  {
    path: '/forgot-password',
    component: () => import('../../../../../src/layouts/MainLayout.vue'),
    children: [
      {
        path: ':hash/:lost',
        component: () => import('../pages/User/Recovery/AccessRecovery.vue')
      },
    ]
  },
];