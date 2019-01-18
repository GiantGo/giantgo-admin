const state = {
  errorLogs: []
}

const getters = {
  errorLogs: state => state.errorLogs
}

const actions = {
  addErrorLog ({commit}, log) {
    commit('ADD_ERROR_LOG', log)
  }
}

const mutations = {
  ADD_ERROR_LOG: (state, log) => {
    state.errorLogs.push(log)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
