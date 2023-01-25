
export const routes = [
    {
        path: '/shop/',
        component: () => import('../../../../../src/layouts/AdminLayout.vue'),
        children: [
            {
                name: 'ProductsIndex',
                path: 'products',
                component: () => import('../pages/Products.vue')
            },
            {
              name: 'CategoriesIndex',
              path: 'categories',
              component: () => import('../pages/Categories.vue')
          }
        ]
    }
];
