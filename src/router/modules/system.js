/** When your routing table is too long, you can split it into small modules**/

const DefaultLayout = () => import('../../layouts/Default/Index.vue')
const User = () => import(/* webpackChunkName: "system" */ '../../views/User/Index.vue')
const Role = () => import(/* webpackChunkName: "system" */ '../../views/Role/Index.vue')

const systemRouter = [
  {
    path: '/system/user',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: User,
        name: 'User',
        meta: {
          title: '用户管理',
          icon: 'peoples',
          roles: ['admin'] // you can set roles in root nav
        }
      }
    ]
  }, {
    path: '/system/role',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: Role,
        name: 'Role',
        meta: {
          title: '角色',
          icon: 'user',
          roles: ['admin'] // you can set roles in root nav
        }
      }
    ]
  }
]

export default systemRouter
