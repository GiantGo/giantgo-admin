/** When your routing table is too long, you can split it into small modules**/

const DefaultLayout = () => import('../../layouts/Default/Index.vue')
const User = () => import(/* webpackChunkName: "system" */ '../../views/User/Index.vue')
const Role = () => import(/* webpackChunkName: "system" */ '../../views/Role/Index.vue')
const Menu = () => import(/* webpackChunkName: "system" */ '../../views/Menu/Index.vue')

const systemRouter = [
  {
    path: '/system',
    component: DefaultLayout,
    redirect: '/system/user',
    meta: {
      title: '系统设置',
      icon: 'chart'
    },
    children: [
      {
        path: 'user',
        component: User,
        name: 'User',
        meta: {
          title: '用户管理',
          icon: 'peoples',
          permissions: ['user:read']
        }
      }, {
        path: 'role',
        component: Role,
        name: 'Role',
        meta: {
          title: '角色管理',
          icon: 'user',
          permissions: ['role:read']
        }
      }, {
        path: 'menu',
        component: Menu,
        name: 'Menu',
        meta: {
          title: '菜单管理',
          icon: 'user',
          permissions: ['menu:write']
        }
      }
    ]
  }
]

export default systemRouter
