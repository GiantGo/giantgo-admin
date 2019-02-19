import { getRoleList, getRole, createRole, updateRole, deleteRole } from '@/api/role'

const state = {}

const getters = {}

const actions = {
  getRoleList ({commit}, {page, limit}) {
    return getRoleList(page, limit)
  },
  getRole ({commit}, {roleId}) {
    return getRole(roleId)
  },
  createRole ({commit}, roleInfo) {
    return createRole(roleInfo)
  },
  updateRole ({commit}, roleInfo) {
    return updateRole(roleInfo)
  },
  deleteRole ({commit}, {roleId}) {
    return deleteRole(roleId)
  }
}

const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations
}
