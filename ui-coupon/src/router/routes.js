
export const routes = [   
    {
        path: '/coupon/',
        component: () =>  import ('@controleonline/ui-layout/src/layouts/AdminLayout.vue'),
        children: [
          {
            name: 'CouponIndex',
            path: '',
            component: () =>  import ('../pages/Coupon/Index.vue')
          }
        ]
      },
];
