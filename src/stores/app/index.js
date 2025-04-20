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
  }),
  persist: true,

  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },

  actions: {
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
          }, 500)
        })
        .catch((error) => {
          console.log('error set token', error)
          this.loading = false
        })
    },

    logout() {
      return new Promise((resolve) => {
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
