import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { useAdminMasterBarangStore } from './list'

export const useAdminFormTransaksiOrderBarangStore = defineStore(
  'admin-form-transaksi-orderbarang-store',
  {
    state: () => ({
      fixed: false,
      form: {
        id: null,
        noorder: null,
        tglorder: null,
        kdbarang: null,
        namabarang: null,
        brand: null,
        merk: null,
        seri: null,
        satuan_b: null,
        satuan_k: null,
        isi: null,
        kategori: null,
        hargajual1: null,
        hargajual2: null,
        ukuran: null,
        jumlah: 1,
      },
      loading: false,
    }),
    // persist: true,
    // getters: {
    //   doubleCount: (state) => state.counter * 2
    // },

    actions: {
      initResetRinci() {
        this.form.kdbarang = null
        this.form.namabarang = null
        this.form.brand = null
        this.form.merk = null
        this.form.seri = null
        this.form.satuan_b = null
        this.form.satuan_k = null
        this.form.isi = null
        this.form.harga = null
        this.form.ukuran = null
        this.form.jumlah = null
      },

      async save() {
        this.loading = true
        return new Promise((resolve, reject) => {
          api
            .post('/v1/transaksi/orderpembelian/simpan', this.form)
            .then(({ data }) => {
              console.log(data)
              this.loading = false
              if (this.form.noorder === null) {
                this.form.noorder = data?.notrans
              }
              this.initResetRinci()
              // inject data
              const arr = useAdminMasterBarangStore()
              arr.items.unshift(data?.result)

              resolve(data)
            })
            .catch((err) => {
              this.loading = false
              reject(err)
            })
        })
      },
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminFormTransaksiOrderBarangStore, import.meta.hot))
}
