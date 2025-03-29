import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'

export const useAdminListTransaksiOrderBarangStore = defineStore(
  'admin-list-transaksi-orderbarang-store',
  {
    state: () => ({
      meta: null,
      items: [],
      itemsdialog: [],
      isError: false,
      loading: false,
      fixed: false,
      itemorderan: [],
      cariorderan: {
        noorder: null,
      },
      params: {
        q: null,
        page: 0,
        per_page: 15,
      },
      getorderan: {
        noorder: null,
      },
      getorderhasil: [],
      opendialogCetak: false,
    }),
    // persist: true,
    // getters: {
    //   doubleCount: (state) => state.counter * 2
    // },

    actions: {
      async getList() {
        this.items = []
        // console.log('get master barang page', this.params.page);
        this.params.page = 1
        this.isError = false
        this.loading = true
        const params = {
          params: this.params,
        }
        try {
          const { data } = await api.get('/v1/transaksi/orderpembelian/getlistorder', params)
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
            .get('/v1/transaksi/orderpembelian/getlistorder', params)
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
        // console.log('asli', val)
        // const hasilglobal = []
        val?.forEach((x) => {
          const total = x.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
          const hasil = {
            id: x?.id,
            noorder: x?.noorder,
            tglorder: x?.tglorder,
            kdsuplier: x?.kdsuplier,
            flaging: x?.flaging,
            suplier: x?.suplier,
            total: total,
            rinci: x?.rinci,
          }
          // console.log('hasil', hasil)
          // hasilglobal.push(hasil)
          const index = this.items.findIndex((q) => q.id === x?.id)

          if (index >= 0) this.items[index] = hasil
          else this.items.unshift(hasil)
        })
        // this.items = hasilglobal.sort(({ tgl: a }, { tgl: b }) => b - a)
      },
      // async getbyhedernoorder() {
      //   console.log('sasa')
      //   const params = { params: this.cariorderan }
      //   await api
      //     .get('/v1/transaksi/orderpembelian/gethederbynoorder', params)
      //     .then((resp) => {
      //       this.loading = false
      //       if (resp.status === 200) {
      //         this.meta = resp?.data
      //         this.items = resp?.data?.data
      //         this.meta.total = resp?.data?.total
      //         console.log('wew', this.items)
      //       }
      //     })
      //     .catch((err) => {
      //       console.log(err)
      //       this.loading = false
      //     })
      // },
      async getorderanfix() {
        try {
          const { data } = await api.get('/v1/transaksi/orderpembelian/getlistorderfixheder')
          this.loading = false
          const hasilglobal = []
          data?.forEach((x) => {
            const total = x.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
            const hasil = {
              id: x?.id,
              noorder: x?.noorder,
              tglorder: x?.tglorder,
              kdsuplier: x?.kdsuplier,
              flaging: x?.flaging,
              suplier: x?.suplier,
              total: total,
              rinci: x?.rinci,
            }
            console.log('hasil', hasil)
            hasilglobal.push(hasil)
            this.itemorderan = hasilglobal
          })
        } catch (error) {
          console.log(error)
          this.isError = true
          this.loading = false
        }
      },
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminListTransaksiOrderBarangStore, import.meta.hot))
}
