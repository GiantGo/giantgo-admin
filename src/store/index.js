import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import app from './modules/app'
import errorLog from './modules/errorLog'
import tagsView from './modules/tagsView'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  actions,
  modules: {
    app,
    errorLog,
    tagsView,
    user
  }
})
