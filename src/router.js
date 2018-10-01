import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress/nprogress'
import store from './store'
import { getToken } from '@/utils/token'

const dashboard = () => import(/* webpackChunkName: "home" */ './views/Home/Dashboard.vue')
const main = () => import(/* webpackChunkName: "home" */ './views/Main.vue')

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/passports',
      name: 'passports',
      component: () => import(/* webpackChunkName: "passports" */ './views/Passport.vue'),
      meta: {authorization: false},
      children: [
        {
          path: 'signin',
          name: 'signIn',
          component: () => import(/* webpackChunkName: "passports" */ './views/Passport/SignIn.vue')
        },
        {
          path: 'signup',
          name: 'signUp',
          component: () => import(/* webpackChunkName: "passports" */ './views/Passport/SignUp.vue')
        }
      ]
    }, {
      path: '/',
      name: 'home',
      redirect: 'dashboard',
      component: main,
      meta: {authorization: true},
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: dashboard
        }
      ]
    }, {
      path: '/system',
      name: 'system',
      component: main,
      redirect: '/system/models',
      meta: {authorization: true},
      children: [
        {
          path: 'models',
          name: 'system_models',
          component: () => import(/* webpackChunkName: "system" */ './views/System/Models/ModelList.vue')
        }
      ]
    }, {
      path: '*',
      component: dashboard
    }
  ]
})

router.beforeEach(function (to, from, next) {
  const requireAuth = to.matched.some(record => record.meta.authorization)

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

// After navigation is confirmed, but before resolving...
router.beforeResolve((routeTo, routeFrom, next) => {
  // If this isn't an initial page load...
  if (routeFrom.name) {
    // Start the route progress bar.
    NProgress.start()
  }

  next()
})

// When each route is finished evaluating...
router.afterEach((routeTo, routeFrom) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router
