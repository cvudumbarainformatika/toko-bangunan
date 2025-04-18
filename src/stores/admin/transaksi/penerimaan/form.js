import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { useAdminListTransaksiPenerimaanBarangStore } from './list'
import { notifError, notifSuccess } from 'src/modules/notifs'

export const useAdminFormTransaksiPenerimaanBarangStore = defineStore(
  'admin-form-transaksi-penerimaanbarang-store',
  {
    state: () => ({
      fixed: false,
      itemPenerimaan: null,
      form: {
        nopenerimaan: '',
        noorder: '',
        kdsuplier: '',
        suplier: '',
        jumlahpo: 0,
        hargaasli: 0,
        id: '',
        kunci: null,
      },
      rinci: [],
      loading: false,
      loadingstok: false,
      lock: false,
      hiden: false,
      kunci: null,
      dataprops: [],
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
              this.loading = false
              const arr = useAdminListTransaksiPenerimaanBarangStore()
              if (!this.form.nopenerimaan) {
                this.form.nopenerimaan = data?.result[0]?.nopenerimaan
              }
              arr.olahdata(data?.result)

              const hasil = data?.result[0]
              const total = hasil?.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
              const totalfix = hasil?.rinci.reduce(
                (a, b) => parseFloat(a) + parseFloat(b.subtotalfix),
                0,
              )

              hasil.total = total
              hasil.totalfix = totalfix

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
              this.loading = false
              const msg = err?.response?.data?.message
              notifError(msg)
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
      async deleteData(id, nopenerimaan, noorder, kdbarang) {
        const payload = { id, nopenerimaan, noorder, kdbarang }
        try {
          const resp = await api.post('v1/transaksi/penerimaan/hapusrincian', payload)
          // console.log(resp)
          if (resp.status === 200) {
            // console.log('sasasa', resp?.data?.result)
            const arr = useAdminListTransaksiPenerimaanBarangStore()
            arr.olahdata(resp?.data?.result, id)

            const hasil = resp?.data?.result[0]
            // console.log('ccc', hasil)
            const total = hasil?.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
            const totalfix = hasil?.rinci.reduce(
              (a, b) => parseFloat(a) + parseFloat(b.subtotalfix),
              0,
            )

            hasil.total = total
            hasil.totalfix = totalfix

            this.itemPenerimaan = hasil
            notifSuccess('Data berhasil dihapus')
          }
        } catch (error) {
          notifError(error)
        }
      },
      async kirimstok(list, nopenerimaan) {
        this.loadingstok = true
        const payload = { list, nopenerimaan }
        return new Promise((resolve, reject) => {
          api
            .post('/v1/transaksi/penerimaan/kirimstok', payload)
            .then(({ data }) => {
              this.loadingstok = false

              const arr = useAdminListTransaksiPenerimaanBarangStore()
              arr.olahdata(data?.result)

              const hasil = data?.result[0]
              const total = hasil?.rinci.reduce((a, b) => parseFloat(a) + parseFloat(b.subtotal), 0)
              const totalfix = hasil?.rinci.reduce(
                (a, b) => parseFloat(a) + parseFloat(b.subtotalfix),
                0,
              )
              hasil.total = total
              hasil.totalfix = totalfix

              this.itemPenerimaan = hasil
              notifSuccess('Data berhasil Ditambahkan ke stok...!!!')
              resolve(data)
            })
            .catch((err) => {
              // console.log('sasasx', err)
              this.loadingstok = false
              const msg = err?.response?.data?.message
              notifError(msg)
              reject(err?.data)
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
