import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { acceptHMRUpdate } from 'pinia'

export const useFormPengembalianStore = defineStore('pengembalian-form-store', {
  state: () => ({
    item: null,
    loading: false,
    keterangan: '',
    details: []
  }),

  actions: {
    setForm(penjualan) {
      this.item = penjualan
      this.keterangan = ''
      this.details = penjualan?.details?.map(d => ({
        ...d,
        qty_retur: 0,
        keterangan: ''
      })) || []
    },

    resetForm() {
      this.item = null
      this.keterangan = ''
      this.details = []
    },

    async simpan() {
      this.loading = true
      try {
        // Filter hanya barang yang diretur
        const validDetails = this.details.filter(d => d.qty_retur > 0)
        if (!validDetails.length) {
          throw new Error('Minimal satu barang harus diretur')
        }

        const payload = {
          penjualan_id: this.item.id,
          keterangan: this.keterangan,
          details: validDetails.map(d => ({
            barang_id: d.barang_id,
            qty: d.qty_retur,
            keterangan_rusak: d.keterangan
          }))
        }

        const { data } = await api.post('/v1/transaksi/pengembalianbarang', payload)
        return data
      } catch (error) {
        console.error('Error saving pengembalian:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFormPengembalianStore, import.meta.hot))
}
