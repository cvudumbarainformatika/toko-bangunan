import { defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifError, notifSuccess } from "src/modules/notifs"
import { useListPenjualanStore } from "./list"

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
    noNota: null,
    item:null,
    list:useListPenjualanStore()
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
        this.item=data?.header
        // cari di list
        const index=this.list?.items?.findIndex(obj=>obj.id===this.item.id)
        if(index>=0) this.list.items[index]=this.item
        else this.list.items.unshift(this.item)
        this.resetForm()
      })
      .catch((err)=>{
        const msg=err?.response?.data?.message
        console.log('error cak',err?.response,msg);
        notifError(msg)
        this.loading=false
      })
    },
    async deleteDetail(item){
      item.loading=true
      await api.post('/v1/transaksi/penjualan/delete-detail',item)
      .then(({data})=>{
        item.loading=false
        console.log('data', data);
        notifSuccess(data?.message??'Data berhasil dihapus')
        if(data?.isDeleteHeader=='1') {
          const index=this.list?.items?.findIndex(obj=>obj.id===this.item.id)
          if(index>=0) this.list.items.splice(index,1)
            this.item=null
        }
        else this.item=data?.header
      })
      .catch((err)=>{
        const msg=err?.response?.data?.message
        console.log('error cak',err?.response,msg);
        notifError(msg)
        item.loading=false
      })
    }
  }
})
