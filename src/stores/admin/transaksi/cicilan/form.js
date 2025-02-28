import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifError, notifSuccess } from "src/modules/notifs"
import { useListCicilanPenjualanStore } from "./list"

export const useCicilanPenjualanFormStore=defineStore('form_cicilan_penjualan',{
  state:()=>({
    loading:false,
    isOpen:false,
    isOpenList:false,
    form:{},
    item:{},
  }),
  actions:{
    setForm(key,val){
      this.form[key]=val
    },
    async simpanCicilan(){
      this.loading=true
      await api.post('v1/transaksi/cicilan/simpan-cicilan',this.form)
      .then(({data})=>{
        console.log('simpan cicilan', data);
        this.loading=false
        this.isOpen=false
        const list=useListCicilanPenjualanStore()
        const index=list.items?.findIndex(obj=>obj.id===data?.data.id)
        if(index>=0) list.items[index]=data?.data
        notifSuccess(data?.message)
      }).catch((err)=>{
        this.loading=false
        const msg=err?.response?.data?.message
        notifError(msg)
      })
    },
    async hapusCicilan(item){
      item.loading=true
      const form={
        id:item?.id,
      }
      await
      api.post('/v1/transaksi/cicilan/hapus-cicilan',form).then(({data})=>{
        item.loading=false
        console.log('hapus cicilan', data)
        const list=useListCicilanPenjualanStore()
        const index=list.items?.findIndex(obj=>obj.id===data?.data?.id)
        if(index>=0) list.items[index]=data?.data

        this.isOpenList=false,
        notifSuccess(data?.message)

      }).catch((err)=>{
        item.loading=false
        const msg=err?.response?.data?.message
        notifError(msg)
      })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCicilanPenjualanFormStore, import.meta.hot))
}
