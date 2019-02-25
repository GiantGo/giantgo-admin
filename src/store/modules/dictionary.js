import {
  getDictionaryTypeList,
  getDictionaryType,
  createDictionaryType,
  updateDictionaryType,
  deleteDictionaryType,
  getDictionaryItemList,
  getDictionaryItem,
  createDictionaryItem,
  updateDictionaryItem,
  deleteDictionaryItem
} from '@/api/dictionary'

const state = {}

const getters = {}

const actions = {
  getDictionaryTypeList ({commit}, {page, limit}) {
    return getDictionaryTypeList(page, limit)
  },
  getDictionaryType ({commit}, {dictionaryTypeId}) {
    return getDictionaryType(dictionaryTypeId)
  },
  createDictionaryType ({commit}, dictionaryTypeInfo) {
    return createDictionaryType(dictionaryTypeInfo)
  },
  updateDictionaryType ({commit}, dictionaryTypeInfo) {
    return updateDictionaryType(dictionaryTypeInfo)
  },
  deleteDictionaryType ({commit}, {dictionaryTypeId}) {
    return deleteDictionaryType(dictionaryTypeId)
  },
  getDictionaryItemList ({commit}, {dictionaryTypeId}) {
    return getDictionaryItemList(dictionaryTypeId)
  },
  getDictionaryItem ({commit}, {dictionaryItemId}) {
    return getDictionaryItem(dictionaryItemId)
  },
  createDictionaryItem ({commit}, {dictionaryTypeId, dictionaryItemInfo}) {
    return createDictionaryItem(dictionaryTypeId, dictionaryItemInfo)
  },
  updateDictionaryItem ({commit}, {dictionaryTypeId, dictionaryItemInfo}) {
    return updateDictionaryItem(dictionaryTypeId, dictionaryItemInfo)
  },
  deleteDictionaryItem ({commit}, {dictionaryTypeId, dictionaryItemId}) {
    return deleteDictionaryItem(dictionaryTypeId, dictionaryItemId)
  }
}

const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations
}
