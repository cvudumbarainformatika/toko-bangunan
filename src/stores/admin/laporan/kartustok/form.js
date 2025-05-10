import { defineStore } from 'pinia'
import { date } from 'quasar'

export const useFormKartuStokStore = defineStore('form-kartustok-store', {
  state: () => ({
    loading: false,
    params: {
      tglawal: date.formatDate(new Date(), 'YYYY-MM-DD'),
      tglakhir: date.formatDate(new Date(), 'YYYY-MM-DD'),
      kdbarang: null,
      namabarang: null,
    },
    dialogCetak: false,
  }),
  actions: {
    initReset() {
      this.params.tglawal = date.formatDate(new Date(), 'YYYY-MM-DD')
      this.params.tglakhir = date.formatDate(new Date(), 'YYYY-MM-DD')
      this.params.kdbarang = null
    },
  },
})
