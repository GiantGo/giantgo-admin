import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import store from '@/store'
import { getToken } from '@/utils/token'
import { checkRoleRoute, checkPermissionRoute } from '@/utils/route'
import systemRouter from './modules/system'

NProgress.configure({showSpinner: false})// NProgress Configuration

const Redirect = () => import('../views/Redirect/Index.vue')
const DefaultLayout = () => import('../layouts/Default/Index.vue')
const SignIn = () => import('../views/Passport/SignIn.vue')
const Dashboard = () => import('../views/Dashboard/Index.vue')
const Icon = () => import('../views/Icon/Index')

Vue.use(Router)

export const moduleRoutes = [
  ...systemRouter
]

export const defaultRoute = {path: '*', redirect: '/404', hidden: true}

export const routes = [
  {
    path: '/redirect',
    component: DefaultLayout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: Redirect
      }
    ]
  }, {
    path: '/signIn',
    name: 'signIn',
    component: SignIn,
    hidden: true
  }, {
    path: '',
    component: DefaultLayout,
    redirect: 'dashboard',
    hidden: false,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        name: 'Dashboard',
        meta: {
          title: '首页',
          icon: 'dashboard',
          noCache: true
        }
      }
    ]
  }, {
    path: '/404',
    component: () => import('../views/ErrorPage/404'),
    hidden: true
  }, {
    path: '/401',
    component: () => import('../views/ErrorPage/401'),
    hidden: true
  }, {
    path: '/icon',
    component: DefaultLayout,
    children: [
      {
        path: 'index',
        component: Icon,
        name: 'Icons',
        meta: {
          title: '图标',
          icon: 'icon',
          noCache: true
        }
      }
    ]
  }
]

const router = new Router({
  mode: 'hash',
  linkActiveClass: 'active',
  scrollBehavior: () => ({y: 0}),
  routes: routes
})

const whiteList = ['/signIn']// no redirect whitelist

router.beforeEach(function (to, from, next) {
  NProgress.start()

  if (getToken()) {
    if (to.path === '/signIn') {
      next({path: '/'})
      NProgress.done()
    } else {
      // 判断当前用户是否已拉取完user_info信息
      if (store.getters.roles.length === 0) {
        // 拉取user_info
        store.dispatch('getMyInfo').then(myInfo => {
          store.dispatch('generateDynamicMenus', {
            roles: myInfo.roles,
            permissions: myInfo.permissions,
            pathName: window.location.pathname.replace(/\//g, '')
          }).then(routes => {
            router.addRoutes(routes) // 动态添加可访问路由表
            next({...to, replace: true}) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch(() => {
          store.dispatch('logout')
          next({
            name: 'signIn',
            query: {redirect: to.fullPath}
          })
        })
      } else {
        // 验证路由角色和权限
        if (checkRoleRoute(store.getters.roles, to) && checkPermissionRoute(store.getters.permissions, to)) {
          next()
        } else {
          next({path: '/401', replace: true, query: {noGoBack: true}})
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      store.dispatch('logout')
      next({
        name: 'signIn',
        query: {redirect: to.fullPath}
      })
      NProgress.done()
    }
  }
})

// When each route is finished evaluating...
router.afterEach(() => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router
