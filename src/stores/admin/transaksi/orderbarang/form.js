import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { useAdminListTransaksiOrderBarangStore } from './list'
import { notifSuccess } from 'src/modules/notifs'

export const useAdminFormTransaksiOrderBarangStore = defineStore(
  'admin-form-transaksi-orderbarang-store',
  {
    state: () => ({
      fixed: false,
      item: null,
      form: {
        id: null,
        noorder: null,
        kdsuplier: null,
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
        this.form.jumlah = 1
      },

      async save() {
        this.loading = true
        return new Promise((resolve, reject) => {
          api
            .post('/v1/transaksi/orderpembelian/simpan', this.form)
            .then(({ data }) => {
              console.log('sasa', data?.result)
              this.loading = false
              const arr = useAdminListTransaksiOrderBarangStore()
              // const itemnya = [...arr.items]
              //arr.items.unshift(data?.result?.original[0])
              // if (!add) {
              //   itemnya.unshift(data?.result?.original[0])
              // } else {
              //   // arr?.items?.map((obj) =>
              //   //   obj?.id === data?.result?.original[0]?.id
              //   //     ? { ...obj, ...data?.result?.original[0] }
              //   //     : obj,
              //   // )
              //   const desah = itemnya.findIndex((f) => f.id === add.id)
              //   if (desah >= 0) itemnya[desah] = data?.result?.original[0]
              //   // desah = data?.result?.original[0]
              //   console.log('sasasasasasasasa', itemnya)
              // }
              if (!this.form.noorder) {
                console.log('weweweweww', data?.notrans)
                this.form.noorder = data?.notrans
              }
              arr.olahdata(data?.result)

              const hasil = data?.result[0]
              const total = hasil?.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
              hasil.total = total

              this.item = hasil

              console.log('addd', this.item)
              notifSuccess('Data berhasil disimpan')
              this.initResetRinci()
              // inject data

              // arr.items.unshift(data?.result?.original[0])
              //this.initReset(null)
              resolve(data)
            })
            .catch((err) => {
              this.loading = false
              reject(err)
            })
        })
      },

      initReset(data) {
        if (data) {
          console.log('fafafa', data)
          return new Promise((resolve) => {
            for (const key in this.form) {
              // console.log(`${key}: ${this.form[key]}`);
              // console.log(`${key}`);
              this.form[key] = data[key]
            }
            // this.form.noorder = data?.noorder
            console.log('aaaaaaaaaaaa', this.form)

            resolve()
          })
        } else {
          for (const key in this.form) {
            // console.log(`${key}: ${this.form[key]}`);
            this.form[key] = null
          }
          // this.form.isi = 1
          // this.form.hargajual1 = 0
          // this.form.hargajual2 = 0
        }
      },
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminFormTransaksiOrderBarangStore, import.meta.hot))
}
