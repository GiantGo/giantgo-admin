import { getRoleList, getRole, createRole, updateRole, deleteRole, assignPermissions } from '@/api/role'

const state = {}

const getters = {}

const actions = {
  getRoleList ({commit}, {page, limit, keyword}) {
    return getRoleList(page, limit, keyword)
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
  },
  assignPermissions ({commit}, {roleId, permissions}) {
    return assignPermissions(roleId, permissions)
  }
}

const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations
}
