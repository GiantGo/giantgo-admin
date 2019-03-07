/** When your routing table is too long, you can split it into small modules**/

const DefaultLayout = () => import('../../layouts/Default/Index.vue')
const User = () => import(/* webpackChunkName: "system" */ '../../views/System/User/Index.vue')
const Role = () => import(/* webpackChunkName: "system" */ '../../views/System/Role/Index.vue')
const Menu = () => import(/* webpackChunkName: "system" */ '../../views/System/Menu/Index.vue')
const Dictionary = () => import(/* webpackChunkName: "system" */ '../../views/System/Dictionary/Index.vue')
const Permission = () => import(/* webpackChunkName: "system" */ '../../views/System/Permission/Index.vue')

const systemRouter = [
  {
    path: '/system',
    component: DefaultLayout,
    children: [
      {
        path: 'user',
        component: User
      }, {
        path: 'role',
        component: Role
      }, {
        path: 'menu',
        component: Menu
      }, {
        path: 'dictionary',
        component: Dictionary
      }, {
        path: 'permission',
        component: Permission
      }
    ]
  }
]

export default systemRouter
