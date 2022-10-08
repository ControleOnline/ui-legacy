
export const routes = [   
    {
        path: '/coupon/',
        component: () => import('../../../../../src/layouts/AdminLayout.vue'),
        children: [
          {
            name: 'CouponIndex',
            path: '',
            component: () => import('../pages/Coupon/Index.vue')
          }
        ]
      },
];
