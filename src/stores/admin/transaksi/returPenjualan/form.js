import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifSuccess } from "src/modules/notifs"

export const useFormReturPenjualanStore = defineStore('form_retur-penjualan-store',{
  state: () => ({
    loading: false,
    form: {
      id: null,
      no_retur: null,
      no_penjualan: null,
      id_customer: null,
      id_sales: null,
      id_barang: null,
      qty_retur: null,
      keterangan: null
    },
    item:null
  }),
  actions: {
    resetForm(){
      console.log('reset Form');

    },
    setForm(item){
      console.log('set Form', item);

    },
    async submit() {
      this.loading = true

      try {
        const resp = await api.post('/v1/transaksi/retur/penjualan', this.form)
        this.loading = false
        this.form = {
          id: null,
          no_retur: null,
          no_penjualan: null,
          id_customer: null,
          id_sales: null,
          id_barang: null,
          qty_retur: null,
          keterangan: null
        }
        // console.log('submit retur penjualan', data)
        notifSuccess(resp)
        return resp
      } catch (error) {
        this.loading = false
        this.isError = true
        this.message = error?.response?.data?.message
        console.log('error submit retur penjualan', error)
        throw error
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFormReturPenjualanStore, import.meta.hot))
}
