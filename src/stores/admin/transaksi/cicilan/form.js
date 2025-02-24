import { defineStore } from "pinia"

export const useCicilanPenjualanFormStore=defineStore('form_cicilan_penjualan',{
  state:()=>({
    loading:false,
    form:{},
  }),
  actions:{
    setForm(key,val){
      this.form[key]=val
    }
  }
})
