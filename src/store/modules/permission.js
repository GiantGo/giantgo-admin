import { getPermissionTree } from '@/api/permission'

const state = {}

const getters = {}

const actions = {
  getPermissionTree ({commit}, {page, limit}) {
    return getPermissionTree(page, limit)
  }
}

const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations
}
