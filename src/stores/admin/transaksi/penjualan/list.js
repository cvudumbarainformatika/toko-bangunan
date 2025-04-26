import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useListPenjualanStore = defineStore('list-penjualan-store', {
  state: () => ({
    isError: false,
    loading: false,
    opendialogCetak: false,
    params: {
      q: null,
      page: 0,
      per_page: 15,
    },
    itemCetak: [],
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
        const { data } = await api.get('/v1/transaksi/penjualan/list', params)
        console.log('list penjualan', data)

        this.meta = data?.meta
        this.items = data?.data
        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    async getListNull() {
      this.params.page = 1
      this.isError = false
      this.loading = true
      const params = {
        params: this.params,
      }
      this.loading = true
      try {
        const { data } = await api.get('/v1/transaksi/penjualan/list-null', params)

        console.log('list penjualan null', data)
        data.forEach((item) => {
          const index = this.items?.findIndex((obj) => obj.id === item.id)
          if (index >= 0) this.items.splice(index, 1)
          this.items.unshift(item)
        })

        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    loadMore(index, done) {
      this.isError = false
      this.params.page = index
      const params = {
        params: this.params,
      }

      console.log('load more', index)

      return new Promise((resolve) => {
        api
          .get('/v1/transaksi/penjualan/list', params)
          .then(({ data }) => {
            console.log('list penjualan', data)
            this.meta = data?.meta
            this.items.push(...data.data)
            done()
            resolve()
          })
          .catch(() => {
            this.isError = true
            done(true)
            resolve()
          })
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useListPenjualanStore, import.meta.hot))
}
