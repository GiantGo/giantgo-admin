import { checkRoute } from '@/utils/route'
import { routes, defaultRoute, moduleRoutes } from '@/router'
import { getMenuList } from '@/api/menu'

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

function formatMenus (menus) {
  const res = []

  menus.forEach(menu => {
    const tmp = {
      path: menu.path,
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
  generateRouterMenus ({commit}, {roles, pathName}) {
    // 根据roles权限生成可访问的路由表， 支持根据window.location.pathname区分模块
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

      // 根据角色过滤路由表
      accessedRouters = filterRoleRouter(accessedRouters, roles)

      commit('SET_MENUS', routes.concat(accessedRouters))
      resolve(accessedRouters)
    })
  },
  generateDynamicMenus ({commit}, {pathName}) {
    return getMenuList(pathName).then(response => {
      let menus = formatMenus(response.data)
      commit('SET_MENUS', menus)
      return moduleRoutes.concat(defaultRoute)
    })
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
