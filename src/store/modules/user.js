import { signIn, signUp, getMyInfo } from '@/api/user'
import { setToken, removeToken } from '@/utils/token'

const state = {
  email: '',
  avatar: '',
  roles: [],
  permissions: []
}

const getters = {
  email: state => state.email,
  avatar: state => state.avatar,
  roles: state => state.roles,
  permissions: state => state.permissions
}

const actions = {
  signUp ({commit}, userInfo) {
    return signUp(userInfo).then((response) => {
      setToken(response.data.token)
    })
  },
  signIn ({commit}, {userName, password}) {
    return signIn(userName, password).then((response) => {
      setToken(response.data.token)
    })
  },
  logout ({commit}) {
    commit('setEmail', '')
    commit('setAvatar', '')
    commit('setRoles', '')
    commit('setPermissions', '')
    removeToken()
  },
  getMyInfo ({commit}) {
    return getMyInfo().then((response) => {
      let userInfo = response.data

      commit('setEmail', userInfo.email)
      commit('setAvatar', userInfo.avatar)
      commit('setRoles', userInfo.roles)
      commit('setPermissions', userInfo.permissions)
    })
  }
}

const mutations = {
  setEmail (state, email) {
    state.email = email
  },
  setAvatar (state, avatar) {
    state.avatar = avatar
  },
  setRoles (state, roles) {
    state.roles = roles
  },
  setPermissions (state, permissions) {
    state.permissions = permissions
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
