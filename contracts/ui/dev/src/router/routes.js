import pages from './pages'

const children = pages.map(page => ({
  path: page.path,
  component: () => import('pages/' + page.file + '.vue')
}))

const routes = [
  {
    path     : '/',
    component: () => import('layouts/MyLayout.vue'),
    children : [
      {
        path     : '',
        component: () => import('pages/Index.vue')
      }
    ].concat(children)
  },
  {
    path: '/contracts/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        name     : 'ContractDetails',
        path     : 'id/:id',
        component: () => import('pages/ContractDetails.vue')
      },
    ]
  },
]

export default routes
