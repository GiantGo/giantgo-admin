/** When your routing table is too long, you can split it into small modules**/

const DefaultLayout = () => import('../../layouts/Default/Index.vue')
const User = () => import(/* webpackChunkName: "system" */ '../../views/System/User/Index.vue')
const Role = () => import(/* webpackChunkName: "system" */ '../../views/System/Role/Index.vue')
const Menu = () => import(/* webpackChunkName: "system" */ '../../views/System/Menu/Index.vue')
const Dictionary = () => import(/* webpackChunkName: "system" */ '../../views/System/Dictionary/Index.vue')

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
          permissions: ['user:retrieve', 'user', 'admin']
        }
      }, {
        path: 'role',
        component: Role,
        name: 'Role',
        meta: {
          title: '角色管理',
          icon: 'user',
          permissions: ['role:retrieve', 'role', 'admin']
        }
      }, {
        path: 'menu',
        component: Menu,
        name: 'Menu',
        meta: {
          title: '菜单管理',
          icon: 'user',
          permissions: ['menu:retrieve', 'menu', 'admin']
        }
      }, {
        path: 'dictionary',
        component: Dictionary,
        name: 'Dictionary',
        meta: {
          title: '字典管理',
          icon: 'dictionary',
          permissions: ['dictionary:retrieve', 'dictionary', 'admin']
        }
      }
    ]
  }
]

export default systemRouter
