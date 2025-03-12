import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useProfilStore = defineStore('profil-toko-store', {
  state: () => ({
    isError: false,
    loading: false,
    params: {
      q: null,
      page: 0,
      per_page: 15,
    },
  }),
  actions: {
    async getList() {
      this.params.page = 1
      this.isError = false
      this.loading = true
      const params = {
        params: this.params,
      }
      this.loading = true
      try {
        const { data } = await api.get('/v1/master/users/getprofil', params)
        console.log('list profil', data)

        this.meta = data?.meta
        this.items = data?.data
        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProfilStore, import.meta.hot))
}
