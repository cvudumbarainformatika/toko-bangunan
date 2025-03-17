import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { useAdminListTransaksiPenerimaanBarangStore } from './list'
import { notifError, notifSuccess } from 'src/modules/notifs'

export const useAdminFormTransaksiPenerimaanBarangStore = defineStore(
  'admin-form-transaksi-orderbarang-store',
  {
    state: () => ({
      fixed: false,
      itemPenerimaan: null,
      form: {
        nopenerimaan: '',
        noorder: '',
        kdsuplier: '',
        // jumlahpo: 0,
        // hargaasli: 0,
        id: '',
      },
      rinci: [],
      loading: false,
      lock: false,
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
            .post('/v1/transaksi/penerimaan/simpan', this.form)
            .then(({ data }) => {
              console.log('sasa', data?.result)
              this.loading = false
              const arr = useAdminListTransaksiPenerimaanBarangStore()
              if (!this.form.nopenerimaan) {
                console.log('weweweweww', data?.result[0]?.nopenerimaan)
                this.form.nopenerimaan = data?.result[0]?.nopenerimaan
                console.log('sasas', this.form.nopenerimaan)
              }
              arr.olahdata(data?.result)

              const hasil = data?.result[0]
              const total = hasil?.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
              hasil.total = total

              this.itemPenerimaan = hasil

              //console.log('addd', this.item)
              notifSuccess('Data berhasil disimpan')
              this.initResetRinci()
              // inject data

              // arr.items.unshift(data?.result?.original[0])
              //this.initReset(null)
              resolve(data)
            })
            .catch((err) => {
              // console.log('sasasx', err)
              // this.loading = false
              reject(err?.data)
            })
        })
      },

      initReset(data) {
        if (data) {
          // console.log('fafafa', data)
          return new Promise((resolve) => {
            for (const key in this.form) {
              // console.log(`${key}: ${this.form[key]}`);
              // console.log(`${key}`);
              this.form[key] = data[key]
            }
            // this.form.noorder = data?.noorder
            // console.log('aaaaaaaaaaaa', this.form)

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
      async deleteData(id, noorder) {
        const payload = { id, noorder }
        try {
          const resp = await api.post('v1/transaksi/orderpembelian/hapusrincian', payload)
          // console.log(resp)
          if (resp.status === 200) {
            // console.log('sasasa', resp?.data?.result)
            const arr = useAdminListTransaksiPenerimaanBarangStore()
            arr.olahdata(resp?.data?.result, id)

            const hasil = resp?.data?.result[0]
            // console.log('ccc', hasil)
            const total = hasil?.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
            hasil.total = total

            this.itemPenerimaan = hasil
            notifSuccess('Data berhasil dihapus')
          }
        } catch (error) {
          notifError(error)
        }
      },
      async kunci(val, noorder) {
        this.lock = true
        const payload = { val, noorder }
        return new Promise((resolve, reject) => {
          api
            .post('/v1/transaksi/orderpembelian/kunci', payload)
            .then(({ data }) => {
              this.lock = false

              const arr = useAdminListTransaksiPenerimaanBarangStore()
              arr.olahdata(data?.result)

              const hasil = data?.result[0]
              // console.log('ccc', hasil)
              const total = hasil?.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
              hasil.total = total

              this.itemPenerimaan = hasil
              notifSuccess('Data berhasil disimpan')
              resolve(data)
            })
            .catch((err) => {
              this.lock = false
              reject(err)
            })
        })
      },
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useAdminFormTransaksiPenerimaanBarangStore, import.meta.hot),
  )
}
