import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const useAdminListTransaksiPenerimaanBarangStore = defineStore(
  'admin-list-transaksi-penerimaanbarang-store',
  {
    state: () => ({
      meta: null,
      items: [],
      isError: false,
      loading: false,
      params: {
        q: null,
        page: 0,
        per_page: 15,
      },
      getorderan: {
        noorder: null,
      },
      getorderhasil: [],
    }),
    // persist: true,
    // getters: {
    //   doubleCount: (state) => state.counter * 2
    // },

    actions: {
      async getList() {
        this.items = []
        console.log('ini penerimaan')
        this.params.page = 1
        this.isError = false
        this.loading = true
        const params = {
          params: this.params,
        }
        try {
          const { data } = await api.get('/v1/transaksi/penerimaan/getpenerimaan', params)
          console.log('get master barang', data)
          this.meta = data
          this.olahdata(data?.data)
          this.loading = false
          // this.items = data
        } catch (error) {
          console.log(error)
          this.isError = true
          this.loading = false
        }
      },

      loadMore(index, done) {
        this.isError = false
        this.params.page = index
        const params = {
          params: this.params,
        }

        // console.log('load more', index)

        return new Promise((resolve) => {
          api
            .get('/v1/transaksi/penerimaan/getpenerimaan', params)
            .then(({ data }) => {
              // console.log('heder order barang', data)
              this.meta = data
              this.olahdata(data?.data)
              //this.items.push(...data.data)
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
      getallbynoorder(val) {
        this.getorderan.noorder = val

        const params = {
          params: this.getorderan,
        }
        return new Promise((resolve) => {
          api
            .get('/v1/transaksi/orderpembelian/getallbynoorder', params)
            .then(({ data }) => {
              // console.log('wewewewe', data)
              this.getorderhasil = data
              this.items.push(...data.data)

              resolve()
            })
            .catch(() => {
              this.isError = true

              resolve()
            })
        })
      },
      olahdata(val) {
        console.log('asli', val)
        // const hasilglobal = []
        val?.forEach((x) => {
          const total = x.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
          const hasil = {
            id: x?.id,
            nopenerimaan: x?.nopenerimaan,
            noorder: x?.noorder,
            tgl: x?.tgl,
            kdsuplier: x?.kdsupllier,
            kunci: x?.kunci,
            suplier: x?.suplier?.nama,
            total: total,
            rinci: x?.rinci,
            orderan_h: x?.orderheder,
          }
          // console.log('hasil', hasil)
          // hasilglobal.push(hasil)
          const index = this.items.findIndex((q) => q.id === x?.id)

          if (index >= 0) this.items[index] = hasil
          else this.items.unshift(hasil)
        })
        // this.items = hasilglobal.sort(({ tgl: a }, { tgl: b }) => b - a)
      },
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useAdminListTransaksiPenerimaanBarangStore, import.meta.hot),
  )
}
