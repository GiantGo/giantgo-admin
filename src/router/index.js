import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import store from '@/store'
import { getToken } from '@/utils/token'

NProgress.configure({showSpinner: false})// NProgress Configuration

const DefaultLayout = () => import(/* webpackChunkName: "passports" */ '../layouts/Default/Index.vue')
const SignIn = () => import(/* webpackChunkName: "passports" */ '../views/Passport/SignIn.vue')
const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard/Index.vue')

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/signIn',
      name: 'signIn',
      component: SignIn,
      meta: {authorization: false}
    }, {
      path: '',
      component: DefaultLayout,
      redirect: 'dashboard',
      children: [
        {
          path: 'dashboard',
          component: Dashboard,
          name: 'Dashboard',
          meta: {title: 'dashboard', icon: 'dashboard', noCache: true}
        }
      ]
    }, {
      path: '*',
      component: SignIn
    }
  ]
})

router.beforeEach(function (to, from, next) {
  const requireAuth = to.matched.some(record => record.meta.authorization)

  NProgress.start()

  if (!requireAuth) {
    return next()
  }

  if (!getToken()) {
    store.dispatch('logout')
    return next({
      name: 'signIn',
      query: {redirect: to.fullPath}
    })
  }

  next()
})

// When each route is finished evaluating...
router.afterEach(() => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router
