import { defineStore, acceptHMRUpdate } from 'pinia'

import { api } from 'src/boot/axios'
import { useListTransaksiPenyesuaianStore } from './list'
import { notifSuccess } from 'src/modules/notifs'
import { date } from 'quasar'

export const useFormTransaksiPenyesuaianStore = defineStore(
  'admin-form-transaksi-penyesuaian-store',
  {
    state: () => ({
      form: {
        id: null,
        nopenyesuaian: null,
        stok_id: null,
        kdbarang: null,
        namabarang: null,
        jumlah_k: 0,
        tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        keterangan: null,
      },
      tambahkurang: [
        { label: 'Bertambah', value: 1 },
        { label: 'Berkurang', value: 2 },
      ],
      dateDisplay: {
        tgl: date.formatDate(Date.now(), 'DD MMMM YYYY'),
      },
      loading: false,
      dialogBarang: false,
    }),
    // persist: true,
    // getters: {
    //   doubleCount: (state) => state.counter * 2
    // },

    actions: {
      initReset(data) {
        if (data) {
          return new Promise((resolve) => {
            this.form = {
              id: data?.id || null,
              nopenyesuaian: data?.nopenyesuaian || null,
              stok_id: data?.stok_id || null,
              kdbarang: data?.kdbarang || null,
              namabarang: data?.namabarang || null,
              jumlah_k: data?.jumlah_k || 0,
              tgl: data?.tgl || date.formatDate(Date.now(), 'YYYY-MM-DD'), // Pastikan default
              keterangan: data?.keterangan || null,
            }
            this.dateDisplay.tgl = data?.tgl
              ? date.formatDate(data.tgl, 'DD MMMM YYYY')
              : date.formatDate(Date.now(), 'DD MMMM YYYY') // Pastikan default
            console.log('Form after initReset:', this.form)
            resolve()
          })
        } else {
          this.form = {
            id: null,
            nopenyesuaian: null,
            stok_id: null,
            kdbarang: null,
            namabarang: null,
            jumlah_k: 0,
            tgl: date.formatDate(Date.now(), 'YYYY-MM-DD'), // Atur default, bukan null
            keterangan: null,
          }
          this.dateDisplay.tgl = date.formatDate(Date.now(), 'DD MMMM YYYY') // Atur default, bukan null
        }
      },

      jumlahBaru(val) {
        // Validasi tambahkurang
        // if (![1, 2].includes(val)) {
        //   console.warn('Nilai tambahkurang tidak valid, harus 1 atau 2')
        //   return
        // }

        if (!['Bertambah', 'Berkurang'].includes(val)) {
          console.warn('Nilai keterangan tidak valid, harus "Bertambah" atau "Berkurang"')
          return
        }

        // Terapkan aturan positif/negatif
        this.form.jumlah_k =
          val === 'Berkurang' ? -Math.abs(this.form.jumlah_k) : Math.abs(this.form.jumlah_k)
      },

      updateJumlahK(value) {
        // Validasi nilai baru
        const parsedValue = parseFloat(value)
        if (isNaN(parsedValue)) {
          console.warn('Input jumlah_k tidak valid')
          this.form.jumlah_k = 0
          return
        }

        // Terapkan aturan berdasarkan tambahkurang
        this.form.jumlah_k = parsedValue
        if (this.form.keterangan) {
          this.jumlahBaru(this.form.keterangan)
        }
      },

      async save(add) {
        this.loading = true
        return new Promise((resolve, reject) => {
          api
            .post('/v1/transaksi/penyesuaian/save', this.form)
            .then(({ data }) => {
              console.log('saved', data)
              this.form.nopenyesuaian = data?.result?.nopenyesuaian
              this.loading = false

              // inject data
              const arr = useListTransaksiPenyesuaianStore()
              if (!add) {
                arr.items.unshift(data?.result)
              } else {
                if (arr?.items && data?.result?.id) {
                  arr.items = arr.items.map((obj) =>
                    obj?.id === data.result.id ? { ...obj, ...data.result } : obj,
                  )
                }
              }
              notifSuccess('Data berhasil disimpan')
              this.initReset(null)
              resolve(data)
            })
            .catch((err) => {
              this.loading = false
              reject(err)
            })
        })
      },
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFormTransaksiPenyesuaianStore, import.meta.hot))
}
