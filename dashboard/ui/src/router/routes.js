export const routes = [
    {
    path: '/home/',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { name: 'DashboardIndex', path: 'dashboard', component: () => import('pages/Home/Dashboard.vue') },
      { name: 'MainPage', path: 'mainpage', component: () => import('pages/Home/MainPage.vue') },
    ]
  }
];