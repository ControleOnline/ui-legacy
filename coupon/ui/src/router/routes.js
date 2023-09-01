
export const routes = [   
    {
        path: '/coupon/',
        component: () =>  import ('@controleonline/quasar-layout-ui/src/layouts/AdminLayout.vue'),
        children: [
          {
            name: 'CouponIndex',
            path: '',
            component: () =>  import ('../pages/Coupon/Index.vue')
          }
        ]
      },
];
