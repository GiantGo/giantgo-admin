import { routes, defaultRoute, moduleRoutes } from '@/router'
import { signIn, signUp, getMyInfo } from '@/api/user'
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

function checkRoute (roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterRoleRouter (routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {...route}
    if (checkRoute(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterRoleRouter(tmp.children, roles)
      }

      res.push(tmp)
    }
  })

  return res
}

const state = {
  email: '',
  avatar: '',
  roles: [],
  permissions: [],
  menus: []
}

const getters = {
  email: state => state.email,
  avatar: state => state.avatar,
  roles: state => state.roles,
  permissions: state => state.permissions,
  menus: state => state.menus,
  hasRole: state => required => hasRole(state.roles, required),
  hasPermission: state => required => hasPermission(state.permissions, required),
  checkRoute: state => route => checkRoute(state.roles, route)
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
      let userInfo = response.data

      commit('SET_EMAIL', userInfo.email)
      commit('SET_AVATAR', userInfo.avatar)
      commit('SET_ROLES', userInfo.roles)
      commit('SET_PERMISSIONS', userInfo.permissions)

      return userInfo
    })
  },
  generateRoutes ({commit}, {roles, pathName}) {
    // 根据roles权限生成可访问的路由表， 支持根据window.location.pathname区分模块
    return new Promise(resolve => {
      const moduleName = pathName.replace(/\//g, '')
      let accessedRouters

      // 根据模块路径过滤路由表
      if (moduleName) {
        accessedRouters = moduleRoutes.filter(route => {
          return route.path.indexOf(moduleName) > -1
        }).concat(defaultRoute)
      } else {
        accessedRouters = moduleRoutes.concat(defaultRoute)
      }

      // 根据角色过滤路由表
      accessedRouters = filterRoleRouter(accessedRouters, roles)

      commit('SET_MENUS', accessedRouters)
      resolve(accessedRouters)
    })
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
  SET_MENUS (state, menus) {
    state.menus = routes.concat(menus)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
