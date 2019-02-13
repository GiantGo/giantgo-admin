const state = {
  imgSrc: ''
}

const getters = {
  imgSrc: state => state.imgSrc
}

const actions = {
  SOCKET_screenshots ({commit}, data) {
    commit('SET_IMG_SRC', data)
  }
}

const mutations = {
  SET_IMG_SRC: (state, data) => {
    state.imgSrc = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
