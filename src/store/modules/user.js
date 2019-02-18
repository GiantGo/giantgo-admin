import { signIn, signUp, getMyInfo, getUserList, createUser, updateUser } from '@/api/user'
import { setToken, removeToken } from '@/utils/token'
import { isString, isArray } from '@/utils'

function hasRole (roles, required) {
  return roles.some(role => required.includes(role))
}

function hasPermission (permissions, required) {
  if (isString(required)) {
    required = [[required]]
  } else if (isArray(required) && required.every(isString)) {
    required = [required]
  }

  return required.some((required) => {
    return required.every((permission) => {
      return permissions.indexOf(permission) !== -1
    })
  })
}

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
  permissions: state => state.permissions,
  hasRole: state => required => hasRole(state.roles, required),
  hasPermission: state => required => hasPermission(state.permissions, required)
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
    commit('SET_EMAIL', '')
    commit('SET_AVATAR', '')
    commit('SET_ROLES', '')
    commit('SET_PERMISSIONS', '')
    removeToken()
  },
  getMyInfo ({commit}) {
    return getMyInfo().then((response) => {
      let myInfo = response.data

      commit('SET_EMAIL', myInfo.email)
      commit('SET_AVATAR', myInfo.avatar)
      commit('SET_ROLES', myInfo.roles)
      commit('SET_PERMISSIONS', myInfo.permissions)

      return myInfo
    })
  },
  getUserList ({commit}, {page, limit}) {
    return getUserList(page, limit)
  },
  createUser ({commit}, userInfo) {
    return createUser(userInfo)
  },
  updateUser ({commit}, userInfo) {
    return updateUser(userInfo)
  }
}

const mutations = {
  SET_EMAIL (state, email) {
    state.email = email
  },
  SET_AVATAR (state, avatar) {
    state.avatar = avatar
  },
  SET_ROLES (state, roles) {
    state.roles = roles
  },
  SET_PERMISSIONS (state, permissions) {
    state.permissions = permissions
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
