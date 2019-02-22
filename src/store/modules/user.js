import { signIn, signUp, getMyInfo, getUserList, createUser, updateUser, assignRoles } from '@/api/user'
import { setToken, removeToken } from '@/utils/token'
import { isString, isArray } from '@/utils'

/**
 * 验证角色
 * @param roles
 * @param required  数组内是"或"的关系
 * @returns {*}
 */
function hasRole (roles, required) {
  return roles.some(role => required.includes(role))
}

/**
 * 验证权限
 * @param permissions 拥有的权限
 * @param required  一维数组代表"且"， 二位数组代表"或"
 * @returns {*}
 */
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
  permissions: [],
  tokenValid: false
}

const getters = {
  email: state => state.email,
  avatar: state => state.avatar,
  roles: state => state.roles,
  permissions: state => state.permissions,
  tokenValid: state => state.tokenValid,
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
    commit('SET_TOKEN_VALID', false)
    removeToken()
  },
  getMyInfo ({commit}) {
    return getMyInfo().then((response) => {
      let myInfo = response.data

      commit('SET_EMAIL', myInfo.email)
      commit('SET_AVATAR', myInfo.avatar)
      commit('SET_ROLES', myInfo.roles)
      commit('SET_PERMISSIONS', myInfo.permissions)
      commit('SET_TOKEN_VALID', true)

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
  },
  assignRoles ({commit}, {userId, roles}) {
    return assignRoles(userId, roles)
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
  },
  SET_TOKEN_VALID (state, valid) {
    state.tokenValid = valid
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
