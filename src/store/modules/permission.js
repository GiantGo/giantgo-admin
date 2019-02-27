import { getPermissionTree, createPermission, updatePermission, deletePermission } from '@/api/permission'

const state = {}

const getters = {}

const actions = {
  getPermissionTree ({commit}, {page, limit}) {
    return getPermissionTree(page, limit)
  },
  createPermission ({commit}, permissionInfo) {
    return createPermission(permissionInfo)
  },
  updatePermission ({commit}, permissionInfo) {
    return updatePermission(permissionInfo)
  },
  deletePermission ({commit}, {permissionId}) {
    return deletePermission(permissionId)
  }
}

const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations
}
