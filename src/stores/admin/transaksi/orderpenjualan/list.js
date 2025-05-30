import { defineStore, acceptHMRUpdate } from 'pinia'
import { date } from 'quasar'
 
import { api } from 'src/boot/axios'
// eslint-disable-next-line no-unused-vars
import { notifError, notifSuccess } from 'src/modules/notifs'

export const useAdminOrderPenjualanStore = defineStore('admin-transaksi-order-penjualan-store', {
  state: () => ({
    meta: null,
    items: [],
    isError: false,
    loading: false,
    dialogFilter: false,
    dialogKartu: false,
    image: '',
    params: {
      q: null,
      page: 0,
      per_page: 15,
      bulan: date.formatDate(Date.now(), 'MM'),
      tahun: date.formatDate(Date.now(), 'YYYY'),
    },
    expand: false,
    
  }),
  // persist: true,
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },

  actions: {
    setExpand() {
      this.expand = !this.expand
    },
    async getList() {
      this.params.page = 1
      this.isError = false
      this.loading = true
      const params = {
        params: this.params,
      }
      try {
        const { data } = await api.get('/v1/orderpenjualan/list', params)
        console.log('get order penjualan', data)
        this.meta = data
        this.items = data?.data
      } catch (error) {
        console.log(error)
        this.isError = true
      } finally {
        this.loading = false
      }
    },

    loadMore(index, done) {
      console.log(index, done);
      
      this.isError = false
      this.params.page = index
      const params = {
        params: this.params,
      }

      console.log('load more', index)

      return new Promise((resolve) => {
        api
          .get('/v1/orderpenjualan/list', params)
          .then(({ data }) => {
            // console.log('get master barangxxxx', data.data)
            this.meta = data
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
  import.meta.hot.accept(acceptHMRUpdate(useAdminOrderPenjualanStore, import.meta.hot))
}
