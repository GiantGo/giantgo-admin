import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import store from '@/store'
import { getToken } from '@/utils/token'

NProgress.configure({showSpinner: false})// NProgress Configuration

const Redirect = () => import('../views/Redirect/Index.vue')
const DefaultLayout = () => import('../layouts/Default/Index.vue')
const SignIn = () => import(/* webpackChunkName: "passports" */ '../views/Passport/SignIn.vue')
const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard/Index.vue')

Vue.use(Router)

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
    hidden: true,
    meta: {
      authorization: false
    }
  }, {
    path: '',
    component: DefaultLayout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        name: 'Dashboard',
        meta: {
          authorization: true,
          title: 'Dashboard',
          icon: 'dashboard',
          noCache: true
        }
      }
    ]
  },
  {path: '*', redirect: '/dashboard', hidden: true}
]

const router = new Router({
  mode: 'hash',
  linkActiveClass: 'active',
  scrollBehavior: () => ({y: 0}),
  routes: routes
})

router.beforeEach(function (to, from, next) {
  const requireAuth = to.matched.some(record => record.meta.authorization)

  NProgress.start()

  if (getToken()) {
    if (to.path === '/signIn') {
      next({path: '/'})
      NProgress.done()
    } else {
      // 判断当前用户是否已拉取完user_info信息
      if (store.getters.roles.length === 0) {
        // 拉取user_info
        store.dispatch('getMyInfo').then(() => {
          next({...to, replace: true})
        }).catch(() => {
          store.dispatch('logout')
          next({
            name: 'signIn',
            query: {redirect: to.fullPath}
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (!requireAuth) {
      return next()
    } else {
      store.dispatch('logout')
      return next({
        name: 'signIn',
        query: {redirect: to.fullPath}
      })
    }
  }
})

// When each route is finished evaluating...
router.afterEach(() => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router
