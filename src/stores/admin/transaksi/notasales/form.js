import { defineStore } from 'pinia'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { notifSuccess } from 'src/modules/notifs'
import { useAdminListTransaksiNotaSalesstore } from './list'

export const useAdminFormTransaksiNotaSalesStore = defineStore(
  'admin-form-transaksi-notasales-store',
  {
    state: () => ({
      meta: null,
      metapiutang: null,
      basicpiutang: false,
      loadingcarinota: false,
      loadingsimpan: false,
      items: [],
      itemspiutang: [],
      allItemspiutang: [],
      rinci: [],
      form: {
        notrans: '',
        kdsales: '',
        keterangan: '',
        notaPenjualan: '',
        tgljatuhtempo: '',
        lamatempo: 0,
        total: 0,
        terbayar: 0,
        tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      },
      dateDisplay: {
        tgl: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      },
    }),
    actions: {
      async listnotapiutang() {
        this.loadingcarinota = true
        try {
          const res = await api.get('/v1/transaksi/notasales/list', {
            params: this.params,
          })
          this.items = res.data.data
          this.meta = res.data.meta
          this.loadingcarinota = false
        } catch (error) {
          console.log(error)
          this.loadingcarinota = false
        }
      },
      async getList() {
        this.items = []
        // console.log('ini list pembayaran hutang')
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
      async caripiutang() {
        this.itemspiutang = []
        this.allItemspiutang = []
        this.loadingcarinota = true
        try {
          const { data } = await api.get('/v1/transaksi/notasales/caripiutang')
          console.log('asdasdasdasd', data)
          this.itemspiutang = data
          this.allItemspiutang = data
          this.loadingcarinota = false
        } catch (error) {
          console.log(error)
          this.loadingcarinota = false
        }
      },
      async simpan() {
        this.loadingsimpan = true
        console.log('form', this.loadingsimpan)
        try {
          const { data } = await api.post('/v1/transaksi/notasales/simpan', this.form)
          // console.log('data', this.items)
          this.form.notrans = data?.data[0]?.notrans
          // console.log('this.form.notrans', this.form.notrans)
          const notrans = data?.notapenjualan
          const arr = this.itemspiutang.filter((item) => item.no_penjualan !== notrans)
          this.itemspiutang = arr
          const list = useAdminListTransaksiNotaSalesstore()
          list.olahdata(data?.data)
          list.rinci = data?.data[0]?.rinci
          // this.olahdatahutang(data?.newhutang)
          notifSuccess('Data berhasil disimpan')
          this.loadingsimpan = false
        } catch (error) {
          console.log(error)
          this.loadingsimpan = false
        }
      },
    },
  },
)
