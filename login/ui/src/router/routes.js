
export const routes = [
    {
      path     : '/',
      component: () => import('../../../../../src/layouts/MainLayout.vue'),
      children : [
        { name: 'LoginIndex', path: ''     , component: () => import('../pages/Login.vue') }
      ]
    },
];