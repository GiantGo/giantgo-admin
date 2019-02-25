import { getPermissionList } from '@/api/permission'

const state = {}

const getters = {}

const actions = {
  getPermissionList ({commit}, {page, limit}) {
    return getPermissionList(page, limit)
  }
}

const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations
}
