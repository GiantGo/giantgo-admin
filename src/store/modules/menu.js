import { defaultRoute, moduleRoutes } from '@/router'
import { getMenuTree, createMenu, updateMenu, deleteMenu } from '@/api/menu'
import { getMyMenus } from '@/api/user'
import { find } from 'lodash'
import path from 'path'

const mapComponent = (result, tree, basePath = '') => {
  tree.forEach(item => {
    let menuPath = path.resolve(basePath, item.path)
    result[menuPath] = item

    if (item.children && item.children.length) {
      mapComponent(result, item.children, menuPath)
    }
  })
}

const matchComponent = (menus, routes, routeMapper) => {
  menus.forEach((menu, index) => {
    const match = find(routes, {path: menu.path})

    menu.name = menu.title
    menu.meta = {
      title: menu.title,
      icon: menu.icon
    }

    if (match) {
      menu.component = match.component

      if (menu.children && match.children && menu.children.length && match.children.length) {
        menu.alwaysShow = true
        menu.redirect = path.resolve(menu.path, menu.children[0].path)
        matchComponent(menu.children, match.children, routeMapper)
      }
      // 当只有一级菜单时
    } else if (menu.parentId === -1 && !menu.children) {
      menus[index] = {
        component: routeMapper['/defaultLayout'].component,
        path: menu.path,
        moduleId: menu.moduleId,
        children: [Object.assign({}, menu, {
          component: routeMapper.hasOwnProperty(menu.path) ? routeMapper[menu.path].component : undefined,
          path: ''
        })]
      }
    }
  })
}

const state = {
  menus: []
}

const getters = {
  menus: state => state.menus
}

const actions = {
  generateRoutes ({commit}) {
    return getMyMenus().then(response => {
      let menus = response.data
      let routeMapper = {}

      // 生成路径和组件映射
      mapComponent(routeMapper, moduleRoutes)
      // 根据路由设置菜单对应的组件
      matchComponent(menus, moduleRoutes, routeMapper)

      commit('SET_MENUS', menus)
      return menus.concat(defaultRoute)
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
