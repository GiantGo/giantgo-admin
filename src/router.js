import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress/nprogress'
import store from './store'
import { getToken } from '@/utils/token'

const signIn = () => import(/* webpackChunkName: "passports" */ './views/Passport/SignIn.vue')

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/signIn',
      name: 'signIn',
      component: signIn,
      meta: {authorization: false}
    }, {
      path: '*',
      component: signIn
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
