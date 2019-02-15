import { getUserList, createUser, updateUser } from '@/api/users'

const state = {}

const getters = {}

const actions = {
  getUserList ({commit}, {page, limit}) {
    return getUserList(page, limit)
  },
  createUser ({commit}, userInfo) {
    return createUser(userInfo)
  },
  updateUser ({commit}, userInfo) {
    return updateUser(userInfo)
  }
}

const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations
}
