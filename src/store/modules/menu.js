import { defaultRoute, moduleRoutes } from '@/router'
import { getMenuTree, createMenu, updateMenu, deleteMenu } from '@/api/menu'
import { getMyMenus } from '@/api/user'
import { find } from 'lodash'

const matchComponent = (menus, matches) => {
  menus.forEach(menu => {
    const match = find(matches, {path: menu.path})

    if (match) {
      menu.component = match.component
      menu.name = menu.title
      menu.meta = {
        title: menu.title,
        icon: menu.icon
      }

      if (!menu.children) {
        menu.children = []
      }

      if (menu.children && match.children && menu.children.length && match.children.length) {
        matchComponent(menu.children, match.children)
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
      matchComponent(menus, moduleRoutes)
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
