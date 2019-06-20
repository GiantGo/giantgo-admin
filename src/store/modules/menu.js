import { defaultRoute, moduleRoutes } from '@/router'
import { getMenuTree, createMenu, updateMenu, deleteMenu } from '@/api/menu'
import { getMyMenus } from '@/api/user'
import path from 'path'

const mapComponent = (tree, result = {}, basePath = '') => {
  tree.forEach(item => {
    let menuPath = path.resolve(basePath, item.path)
    result[menuPath] = item

    if (item.children && item.children.length) {
      mapComponent(item.children, result, menuPath)
    }
  })

  return result
}

const matchComponent = (menus, routeMapper, basePath) => {
  menus.forEach((menu, index) => {
    const menuPath = path.resolve(basePath, menu.path)

    if (!menu.children) {
      if (menu.parentId === -1) {
        menus[index] = {
          component: routeMapper['/defaultLayout'].component,
          path: menu.path,
          children: [Object.assign({}, menu, {
            component: routeMapper.hasOwnProperty(menu.path) ? routeMapper[menu.path].component : undefined,
            path: ''
          })]
        }
      } else {
        menu.component = routeMapper.hasOwnProperty(menuPath) ? routeMapper[menuPath].component : undefined
      }
    } else {
      menu.component = routeMapper.hasOwnProperty(menuPath) ? routeMapper[menuPath].component : undefined
      menu.alwaysShow = true
      menu.redirect = path.resolve(menu.path, menu.children[0].path)
      matchComponent(menu.children, routeMapper, menu.path)
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
      // 生成路径和组件映射
      let routeMapper = mapComponent(moduleRoutes)

      // 根据路由设置菜单对应的组件
      matchComponent(menus, routeMapper, '/')

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
