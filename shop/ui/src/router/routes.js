
export const routes = [
    {
        path: '/shop/',
        name: 'ShopIndex',
        component: () => import('../../../../../src/layouts/ShopLayout.vue'),
        children: [
            {
              name: 'ShopDefoult',
              path: '/shop/',
              component: () => import('../pages/Categories.vue')
            },
            {
              name: 'CategoriesIndex',
              path: 'id/:id',
              component: () => import('../pages/Products.vue')
            },
            {
                name: 'ProductsIndex',
                path: 'products',
                component: () => import('../pages/Products.vue')
            },
        ],
        meta: {
          requiresAuth: false,
        }
    }
];
