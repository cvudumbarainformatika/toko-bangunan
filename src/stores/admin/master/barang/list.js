import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const useAdminMasterBarangStore = defineStore('admin-master-barang-store', {
  state: () => ({
    items: [],
    isError: null,

    params: {
      q:null,
      page: 1,
      per_page: 5
    }
  }),
  // persist: true,
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },

  actions: {
    async getList()
    {
      this.isError = null
      const params = {
        params: this.params
      }
      try {
        const {data} = await api.get('/v1/master/barang/listbarang', params)
        console.log('get master barang',data);
        
        // this.items = data
      } catch (error) {
        console.log(error);
        this.isError = 'Maaf Ada Error'
      }
    }
    
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminMasterBarangStore, import.meta.hot))
}
