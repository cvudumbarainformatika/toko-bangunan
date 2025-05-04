import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { routerInstance } from 'src/boot/router'
import { notifError } from 'src/modules/notifs'
import * as storage from 'src/modules/storage'
import { waitLoad } from 'src/modules/utils'
import { useLeftDrawerStore } from './leftdrawer'
import { useAdminMasterSatuanSelectStore } from '../admin/master/satuan/select'
import { useAdminMasterBrandSelectStore } from '../admin/master/brand/select'
import { useProfilStore } from '../admin/profil'

export const useAppStore = defineStore('app-store', {
  state: () => ({
    dark: true,
    auth: false,
    user: null,
    token: null,
    loading: false,
    titleLoading: '',
    inactivityTimer: null,
    // inactivityTimeout: 15 * 60 * 1000, // 15 menit dalam milidetik
    inactivityTimeout: 3 * 60 * 1000, // 3 menit dalam milidetik
  }),
  persist: true,

  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },

  actions: {
    // Inisialisasi timer inaktivitas
    initInactivityTimer() {
      if (!this.auth) return // Jangan inisialisasi jika belum login

      // Reset timer yang ada jika sudah ada
      this.resetInactivityTimer()

      // Buat timer baru
      this.inactivityTimer = setTimeout(() => {
        // Logout otomatis setelah timeout
        this.logout()
        notifError('Anda telah logout otomatis karena tidak aktif selama 15 menit')
      }, this.inactivityTimeout)

      // Tambahkan event listener untuk reset timer saat ada aktivitas
      const resetTimer = this.resetInactivityTimer.bind(this)

      // Daftar event yang akan di-monitor
      const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll']

      // Tambahkan event listener untuk setiap event
      events.forEach((event) => {
        document.addEventListener(event, resetTimer)
      })
    },

    // Reset timer inaktivitas
    resetInactivityTimer() {
      if (this.inactivityTimer) {
        clearTimeout(this.inactivityTimer)
        this.inactivityTimer = null
      }

      // Buat timer baru
      this.initInactivityTimer()
    },

    // Hentikan timer inaktivitas
    stopInactivityTimer() {
      if (this.inactivityTimer) {
        clearTimeout(this.inactivityTimer)
        this.inactivityTimer = null
      }

      // Hapus event listener
      const resetTimer = this.resetInactivityTimer.bind(this)
      const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll']

      events.forEach((event) => {
        document.removeEventListener(event, resetTimer)
      })
    },

    checkTokenExpiration() {
      const activeTime = localStorage.getItem('activeTime')
      if (activeTime) {
        const lastActive = new Date(activeTime)
        const now = new Date()
        const hoursDiff = (now - lastActive) / (1000 * 60 * 60)

        if (hoursDiff > 24) {
          this.logout()
          notifError('Session expired. Please login again.')
          return false
        }
      }
      return true
    },

    restoreSession(token, user) {
      if (!this.checkTokenExpiration()) {
        return false
      }

      storage.setHeaderToken(token)
      this.token = token
      this.user = user
      this.auth = true
      this.updateLastActive()

      // Inisialisasi timer inaktivitas saat restore session
      this.initInactivityTimer()

      return true
    },

    updateLastActive() {
      localStorage.setItem('activeTime', new Date().toString())
    },

    login(payload) {
      this.loading = true
      this.titleLoading = 'SEDANG SINKRON DATA'
      return new Promise((resolve, reject) => {
        api
          .post('/login', payload)
          .then((resp) => {
            storage.setLocalToken(resp.data.token)
            storage.setUser(resp.data.user)
            localStorage.setItem('activeTime', new Date())
            console.log('login', resp)
            const hdd = storage.getLocalToken()
            const hddUser = storage.getUser()
            if (hdd && hddUser) {
              this.SET_TOKEN_USER(hdd, hddUser)
            }
            const adminLeftMenu = useLeftDrawerStore()
            const selectSatuan = useAdminMasterSatuanSelectStore()
            const selectBrands = useAdminMasterBrandSelectStore()
            const profiltoko = useProfilStore()
            Promise.all([
              adminLeftMenu.getMenu(),
              selectSatuan.getDataAll(),
              selectBrands.getDataAll(),
              profiltoko.getProfil(),
            ]).finally(() => {
              setTimeout(() => {
                routerInstance.push('/')
                this.loading = false

                // Inisialisasi timer inaktivitas setelah login
                this.initInactivityTimer()
              }, 500)
            })
            resolve(resp)
          })
          .catch((error) => {
            console.log(error)
            this.loading = false
            notifError('Login Gagal')
            reject(error)
          })
      })
    },
    SET_TOKEN_USER(token, auth) {
      storage
        .setHeaderToken(token)
        .then(() => {
          this.token = token
          this.user = auth
          this.auth = true

          setTimeout(() => {
            waitLoad('show')
            routerInstance.push({ path: '/' })
            this.loading = false
            waitLoad('done')

            // Inisialisasi timer inaktivitas
            this.initInactivityTimer()
          }, 500)
        })
        .catch((error) => {
          console.log('error set token', error)
          this.loading = false
        })
    },

    logout() {
      return new Promise((resolve) => {
        if (!this.auth) {
          resolve()
          return
        }

        // Hentikan timer inaktivitas
        this.stopInactivityTimer()

        api.post('/logout').finally(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('activeTime')

          // Reset state
          this.auth = false
          this.user = null
          this.token = null

          // Redirect to login
          routerInstance.push('/auth')
          resolve()
        })
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
