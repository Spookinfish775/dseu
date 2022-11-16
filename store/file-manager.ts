import Vue from "vue"
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { dataApi } from "~/static/dataApi";

import { DocumentLoader } from "~/infrastructure/classes/DocumentLoader";

export const state = () => ({
  openState: false,
  currentDocument: null,
  cache: {},
  files: []
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  openState(state) {
    return state.openState
  },
  files(state) {
    return state.files
  },
  currentDocument(state) {
    return state.currentDocument
  },
}

export const mutations: MutationTree<RootState> = {
  OPEN_MANAGER(state) {
    state.openState = true
  },
  CLOSE_MANAGER(state) {
    state.openState = false
  },
  REMOVE_FILE(state, id) {
    state.files.forEach((element, index) => {
      if (element.id === id) {
        Vue.delete(state.files, index)
      }
    })
  },
  ADD_UPLOADED_FILE(state, file) {
    state.files.push(file)
  },
  SET_LOADED_FILES(state, { key, data }) {
    state.cache[key] = data
    state.files = state.cache[key]
  },
  SET_CURRENT_DOCUMENT(state, data) {
    state.currentDocument = data
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async loadFiles({ commit }, options) {
    let { data } = await this.$axios.get(options.loadUrl)

    commit("SET_LOADED_FILES", {
      key: options.loadUrl,
      data: data.data
    })
  },
  async uploadFile() {
    await this.$axios.post(dataApi.uploadedDocument)
  },
  downloadFile({ }, options) {
    DocumentLoader.load(options.context, {
      loadUrl: options.loadUrl,
      name: options.name
    });
  },
  async removeFile({ commit }, id) {
    await this.$axios.delete(`${dataApi.uploadedDocument}/${id}`)
    commit("REMOVE_FILE", id)
  },
}
