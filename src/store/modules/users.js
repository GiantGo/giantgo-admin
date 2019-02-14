import { getUserList } from '@/api/users'

const state = {}

const getters = {}

const actions = {
  getUserList ({commit}, {page, limit}) {
    return getUserList(page, limit)
  }
}

const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations
}
