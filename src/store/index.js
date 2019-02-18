import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import errorLog from './modules/errorLog'
import tagsView from './modules/tagsView'
import user from './modules/user'
import socket from './modules/socket'
import menu from './modules/menu'

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  modules: {
    app,
    errorLog,
    tagsView,
    user,
    socket,
    menu
  }
})
