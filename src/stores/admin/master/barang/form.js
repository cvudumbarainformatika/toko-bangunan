import { defineStore, acceptHMRUpdate } from 'pinia'
 
import { api } from 'src/boot/axios'
import { useAdminMasterBarangStore } from './list'

export const useAdminFormMasterBarangStore = defineStore('admin-form-master-barang-store', {
  state: () => ({
    form:{
      id: null,
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
    },
    loading: false
  }),
  // persist: true,
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },

  actions: {
    initReset() {
      for (const key in this.form) {
        // console.log(`${key}: ${this.form[key]}`);
        this.form[key] = null
      }
      this.form.isi = 1
      this.form.hargajual1 = 0
      this.form.hargajual2 = 0
    },

    async save() {
      this.loading = true
      return new Promise((resolve, reject) => {
        api.post('/v1/master/barang/simpanbarang', this.form)
          .then(({data}) => {

            console.log(data);
            this.loading = false

            // inject data
            const arr = useAdminMasterBarangStore()
            arr.items.unshift(data?.result)

            this.initReset()
            resolve(data)
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    }
    
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminFormMasterBarangStore, import.meta.hot))
}
