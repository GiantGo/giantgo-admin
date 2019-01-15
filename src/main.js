import Vue from 'vue'
import moment from 'vue-moment'
import Element from 'element-ui'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import router from './router'
import store from './store'
import App from './App.vue'
import './errorLog' // error log

Vue.use(Element)
Vue.use(moment)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
