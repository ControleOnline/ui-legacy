export const routes = [{
  path: '/config/',
  component: () => import('../../../../../src/layouts/AdminLayout.vue'),
  children: [
    {
      name: 'MenuIndex',
      path: 'menu',
      component: () => import('../pages/Config/Menu.vue'),
    },    
  ]
}];

export default routes
