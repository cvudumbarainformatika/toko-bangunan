import { defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifError, notifSuccess } from "src/modules/notifs"

export const useFromPenjualanStore=defineStore('from-penjualan-store',{
  state: () => ({
    loading: false,
    barang:null,
    form: {
      kodebarang:'',
      jumlah:0,
      harga_beli:0,
      harga_jual:0,
      diskon:0,
      subtotal:0,
      pelanggan_id:null,
    },
    noNota: null
  }),
  actions: {
    setForm(key,val){
      this.form[key] = val
    },
    resetForm(){
      this.barang=null
      this.form = {
        kodebarang:'',
        jumlah:0,
        harga_beli:0,
        harga_jual:0,
        diskon:0,
        subtotal:0,
        pelanggan_id:null
      }
    },
    async simpanDetail(){
      this.loading=true
      if(this.noNota!==null) this.setForm('nota',this.noNota)
      await api.post('/v1/transaksi/penjualan/simpan-detail',this.form)
      .then(({data})=>{
        this.loading=false
        console.log('data', data);
        notifSuccess(data?.message??'Data berhasil disimpan')
        this.noNota=data?.nota
        // this.resetForm()
      })
      .catch((err)=>{
        const msg=err?.response?.data?.message
        console.log('error cak',err?.response,msg);
        notifError(msg)
        this.loading=false
      })
    },
  }
})
