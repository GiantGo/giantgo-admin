import { getModelList, getModel, createModel, updateModel, deleteModel } from '@/api/model'

const state = {
  models: {}
}

const getters = {
  models: state => state.models
}

const actions = {
  getModelList ({commit, state}, condition) {
    return getModelList({
      type: condition.type || ''
    })
  },
  getModel ({commit, state}, modelId) {
    return getModel(modelId)
  },
  createModel ({commit, state}, modelInfo) {
    return createModel(modelInfo)
  },
  updateModel ({commit, state}, modelInfo) {
    return updateModel(modelInfo)
  },
  deleteModel ({commit, state}, modelId) {
    return deleteModel(modelId)
  }
}

const mutations = {
  setModels (state, models) {
    state.models = models
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
