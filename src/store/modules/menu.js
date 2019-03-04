import { checkRoleRoute, checkPermissionRoute } from '@/utils/route'
import { routes, defaultRoute, moduleRoutes } from '@/router'
import { getMenuTree, createMenu, updateMenu, deleteMenu } from '@/api/menu'
import { getMyMenus } from '@/api/user'

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 * @param permissions
 */
function filterRouter (routes, roles, permissions) {
  const res = []

  routes.forEach(route => {
    const tmp = {...route}
    if (checkRoleRoute(roles, tmp) && checkPermissionRoute(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterRouter(tmp.children, roles, permissions)
      }

      res.push(tmp)
    }
  })

  return res
}

function formatMenus (menus) {
  const res = []

  menus.forEach(menu => {
    const tmp = {
      path: menu.path || '',
      meta: {
        title: menu.title,
        icon: menu.icon
      },
      children: menu.children || []
    }

    if (tmp.children) {
      tmp.children = formatMenus(tmp.children)
    }

    res.push(tmp)
  })

  return res
}

const state = {
  menus: []
}

const getters = {
  menus: state => state.menus
}

const actions = {
  /**
   * 根据路由设置生成菜单
   * @param commit
   * @param roles
   * @param permissions
   * @param pathName  location路径名称，可用来区分菜单模块
   * @returns {Promise<any>}
   */
  generateRouterMenus ({commit}, {roles, permissions, pathName}) {
    // 根据角色和权限生成可访问的路由表， 支持根据window.location.pathname区分模块
    return new Promise(resolve => {
      const moduleName = pathName
      let accessedRouters

      // 根据模块路径过滤路由表
      if (moduleName) {
        accessedRouters = moduleRoutes.filter(route => {
          return route.path.indexOf(moduleName) > -1
        }).concat(defaultRoute)
      } else {
        accessedRouters = moduleRoutes.concat(defaultRoute)
      }

      // 根据角色和权限过滤路由表
      accessedRouters = filterRouter(accessedRouters, roles, permissions)
      // 使用路由作为菜单
      commit('SET_MENUS', routes.concat(accessedRouters))
      resolve(accessedRouters)
    })
  },
  /**
   * 动态获取系统菜单
   * @param commit
   * @param roles
   * @param permissions
   * @returns {Q.Promise<Array<*>> | Q.Promise<Array<*> | never> | PromiseLike<Array | never> | Promise<Array | never>}
   */
  generateDynamicMenus ({commit}, {roles, permissions}) {
    return getMyMenus().then(response => {
      let menus = formatMenus(response.data)
      let accessedRouters = moduleRoutes.concat(defaultRoute)
      // 根据角色和权限过滤路由表
      accessedRouters = filterRouter(accessedRouters, roles, permissions)
      commit('SET_MENUS', menus)
      return accessedRouters
    })
  },
  getMenuTree () {
    return getMenuTree()
  },
  createMenu ({commit}, menuInfo) {
    return createMenu(menuInfo)
  },
  updateMenu ({commit}, menuInfo) {
    return updateMenu(menuInfo)
  },
  deleteMenu ({commit}, {menuId}) {
    return deleteMenu(menuId)
  }
}

const mutations = {
  SET_MENUS (state, menus) {
    state.menus = menus
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
