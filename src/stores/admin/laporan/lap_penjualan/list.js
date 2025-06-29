import { defineStore, acceptHMRUpdate } from 'pinia'

import { api } from 'src/boot/axios'
import { date } from 'quasar'

export const useLaporanPenjualanStore = defineStore('laporan-penjualan-store', {
  state: () => ({
    params: {
      q: null,
      page: 0,
      per_page: 15,
      tglawal: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      tglakhir: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      sales: null,
      jnsbayar: null,
    },
    dateDisplay: {
      from: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      to: date.formatDate(Date.now(), 'DD MMMM YYYY'),
    },
    loading: false,
    dialogCetak: false,

    sales: null,
    jnsbayar: null,
    pelanggan: null,
    items: [],
  }),

  actions: {
    initReset(data) {
      if (data) {
        return new Promise((resolve) => {
          for (const key in this.params) {
            // console.log(`${key}: ${this.form[key]}`);
            // console.log(`${key}`);
            this.params[key] = data[key]
          }
          console.log(this.params)

          resolve()
        })
      } else {
        for (const key in this.params) {
          // console.log(`${key}: ${this.form[key]}`);
          this.params[key] = null
        }
      }
    },

    async getdata() {
      this.loading = true
      const params = {
        params: this.params,
      }
      console.log('params', params)
      return new Promise((resolve, reject) => {
        api
          .get('/v1/laporan/penjualan/getpenjualan', params)
          .then(({ data }) => {
            console.log('getdata', data)
            this.items = data
            this.loading = false
            resolve(data)
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLaporanPenjualanStore, import.meta.hot))
}
