/** When your routing table is too long, you can split it into small modules**/

const DefaultLayout = () => import('../../layouts/Default/Index.vue')
const User = () => import(/* webpackChunkName: "system" */ '../../views/User/Index.vue')
const Role = () => import(/* webpackChunkName: "system" */ '../../views/Role/Index.vue')

const systemRouter = [
  {
    path: '/system',
    component: DefaultLayout,
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
          roles: ['admin'] // you can set roles in root nav
        }
      }, {
        path: 'role',
        component: Role,
        name: 'Role',
        meta: {
          title: '角色管理',
          icon: 'user',
          roles: ['admin'] // you can set roles in root nav
        }
      }
    ]
  }
]

export default systemRouter
