// 路由懒加载
const _import = file => () => import('@/views/' + file + '/' + file + '.vue')

// 路由配置表
const routes = [
  {
    path: '/',
    name: 'home',
    component: _import('home')
  },
  {
    path: '/list',
    name: 'list',
    component: _import('list')
  },
  {
    path: '*',
    redirect: '/'
  }
]

export default routes
