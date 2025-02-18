import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { useAdminMasterBarangStore } from './list'
import { notifSuccess } from 'src/modules/notifs'

export const useAdminFormMasterBarangStore = defineStore('admin-form-master-barang-store', {
  state: () => ({
    form: {
      id: null,
      kodebarang: null,
      namabarang: null,
      brand: null,
      kualitas: null,
      seri: null,
      satuan_b: null,
      satuan_k: null,
      isi: 1,
      kategori: null,
      hargajual1: 0,
      hargajual2: 0,
      hargabeli: 0,
      ukuran: null,
      rincians: [], // Array untuk menyimpan file gambar
    },
    loading: false,
    pilihkategori: [{ keterangan: 'Keramik' }, { keterangan: 'Non Keramik' }],
  }),

  actions: {
    initReset(data) {
      if (data) {
        return new Promise((resolve) => {
          for (const key in this.form) {
            this.form[key] = data[key]
          }
          this.form.kodebarang = data?.kodebarang
          console.log(this.form)
          resolve()
        })
      } else {
        for (const key in this.form) {
          this.form[key] = null
        }
        this.form.isi = 1
        this.form.hargajual1 = 0
        this.form.hargajual2 = 0
        this.form.rincians = [] // Reset rincians gambar
      }
    },

    async save(add) {
      this.loading = true

      // Buat FormData untuk mengirim data dan file
      const formData = new FormData()

      // Tambahkan field data barang ke FormData
      for (const key in this.form) {
        if (key !== 'rincians' && this.form[key] !== null) {
          formData.append(key, this.form[key])
        }
      }
      // Jika kodebarang tidak ada, kirim sebagai null
      if (!this.form.kodebarang) {
        formData.append('kodebarang', '') // Atau null, sesuai backend
      }

      // Tambahkan file gambar ke FormData
      this.form.rincians.forEach((rincian, index) => {
        if (rincian.gambar instanceof File) {
          formData.append(`rincians[${index}][gambar]`, rincian.gambar)
        }
      })

      console.log('Data yang dikirim:', this.form)

      return new Promise((resolve, reject) => {
        api
          .post('/v1/master/barang/simpanbarang', formData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Penting untuk upload file
            },
          })
          .then(({ data }) => {
            console.log('Data tersimpan:', data)
            this.form.rincians.kodebarang = data.result.kodebarang

            this.loading = false

            // Inject ke store list
            const arr = useAdminMasterBarangStore()
            if (!add) {
              arr.items.unshift(data?.result) // Sesuaikan dengan response backend
            } else {
              arr.items = arr.items.map((obj) =>
                obj?.id === data.result.id ? { ...obj, ...data.result } : obj,
              )
            }

            notifSuccess('Data berhasil disimpan')
            this.initReset(null) // Reset form setelah simpan
            resolve(data)
          })
          .catch((err) => {
            this.loading = false
            reject(err)
          })
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminFormMasterBarangStore, import.meta.hot))
}
