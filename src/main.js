import Vue from 'vue'
import Cookies from 'js-cookie'
import Element from 'element-ui'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import router from './router'
import store from './store'
import App from './App.vue'
import io from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'

import './errorLog' // error log
import './icons' // icon

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  zIndex: 3000
})
Vue.use(new VueSocketIO({
  debug: false,
  connection: io.connect('/webinar', {
    path: '/socketio/socket.io',
    query: {
      room: 726286
    }
  }),
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}))

Vue.config.productionTip = false

new Vue({
  sockets: {
    connect: function () {
      console.log('socket connected')
    }
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
