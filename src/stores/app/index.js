import { defineStore, acceptHMRUpdate } from 'pinia'

export const useAppStore = defineStore('app-store', {
  state: () => ({
    dark: false,
  }),
  persist: true,
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },

  actions: {
    // increment() {
    //   this.counter++
    // }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
