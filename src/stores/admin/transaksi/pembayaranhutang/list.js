import { defineStore, acceptHMRUpdate } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'

export const useAdminListTransaksiPembayaranHutangStore = defineStore(
  'admin-list-transaksi-pembayaranhutang-store',
  {
    state: () => ({
      meta: null,
      items: [],
      isError: false,
      loading: false,
      loadingdeleteall: false,
      params: {
        q: null,
        page: 0,
        per_page: 15,
        from: date.formatDate(Date.now(), 'YYYY-MM-01'),
        to: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      },
      getorderan: {
        noorder: null,
      },
      getorderhasil: [],
      dateDisplay: {
        from: date.formatDate(Date.now(), '01 MMMM YYYY'),
        to: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      },
    }),

    actions: {
      async getList() {
        this.items = []
        console.log('ini list pembayaran hutang')
        this.params.page = 1
        this.isError = false
        this.loading = true
        const params = {
          params: this.params,
        }
        try {
          const { data } = await api.get('/v1/transaksi/pembayaranhutang/list', params)
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
              console.log('heder order barang', data)
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

      olahdata(val) {
        console.log('asli', val)
        // const hasilglobal = []
        val?.forEach((x) => {
          const total = x.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
          const totalfix = x.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotalfix), 0)
          const hasil = {
            id: x?.id,
            nopenerimaan: x?.nopenerimaan,
            nofaktur: x?.nofaktur,
            noorder: x?.noorder,
            tgl: x?.updated_at,
            kdsuplier: x?.kdsupllier,
            kunci: x?.kunci,
            suplier: x?.nama,
            total: total,
            totalfix: totalfix,
            rinci: x?.rinci,
            orderan_h: x?.orderheder,
            jenis_pembayaran: x?.jenis_pembayaran,
          }
          console.log('hasilccccc', hasil)
          // hasilglobal.push(hasil)
          const index = this.items.findIndex((q) => q.id === x?.id)

          if (index >= 0) this.items[index] = hasil
          else this.items.unshift(hasil)
          console.log('this.items', this.items)
        })
        // this.items.sort(({ tgl: a }, { tgl: b }) => b - a)
      },
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useAdminListTransaksiPembayaranHutangStore, import.meta.hot),
  )
}
