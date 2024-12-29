import { defineStore, acceptHMRUpdate } from 'pinia'
// eslint-disable-next-line no-unused-vars
import { api } from 'src/boot/axios'

export const useAdminFormMasterBarangStore = defineStore('admin-form-master-barang-store', {
  state: () => ({
    form:{
      id: null,
      namabarang: null,
      kategori: null,
      merk: null,
    }
  }),
  // persist: true,
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },

  actions: {
    
    
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminFormMasterBarangStore, import.meta.hot))
}
