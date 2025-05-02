import { acceptHMRUpdate, defineStore } from "pinia"
import { api } from "src/boot/axios"
import { notifSuccess } from "src/modules/notifs"
import { useListReturPenjualanStore } from "./list"

export const useFormReturPenjualanStore = defineStore('form_retur-penjualan-store',{
  state: () => ({
    loading: false,
    list: useListReturPenjualanStore(),
    form:{},
    noRetur:'',
    item:null
  }),
  actions: {
    resetForm(){
      console.log('reset Form');
      this.form={}
    },
    initForm(key,val){
      this.form[key]=val
    },
    setForm(item){
      console.log('set Form', item);
      this.item={...item}
      this.item?.detail?.forEach(d=>{
          d.retur=item?.detail_retur.filter(f=>f.kodebarang===d.kodebarang && f.status === '')?.reduce((acc,cur)=>acc+cur.jumlah,0)
          const sudahRetur=item?.detail_retur.filter(f=>f.kodebarang===d.kodebarang && f.status !== '')?.reduce((acc,cur)=>acc+cur.jumlah,0)
          d.sisa=d.jumlah-sudahRetur-d.retur
        })
        this.noRetur=item?.draft_retur?.no_retur??''

    },
    async submit(item) {
      item.loading = true

      try {
        const resp = await api.post('/v1/transaksi/retur/simpan', this.form)
        item.loading = false
        const pj=resp?.data?.pj
        console.log('submit retur penjualan', pj)
        const index=this.list.items.findIndex(i=>i.id==pj.id)
        if(index>=0){
          this.list.items[index]=pj
        }
        this.setForm(pj)
        this.resetForm()
        this.noRetur=resp?.data?.noretur
        notifSuccess(resp?.data?.message)
        return resp
      } catch (error) {
        item.loading = false
        this.isError = true
        this.message = error?.response?.data?.message
        console.log('error submit retur penjualan', error)
        throw error
      }
    },
    selesai(form){
      return new Promise((resolve,reject) => {
        api.post('/v1/transaksi/retur/selesai', form)
        .then(({data}) => {

          resolve(data)
        })
        .catch((err)=>{
          reject(err)
        })

      })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFormReturPenjualanStore, import.meta.hot))
}
