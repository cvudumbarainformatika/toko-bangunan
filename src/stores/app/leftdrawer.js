import { defineStore, acceptHMRUpdate } from 'pinia'
import { radixDashboard } from 'quasar-extras-svg-icons/radix-ui-icons'
import { tabUserEdit, tabBell, tabBrandFirebase, tabTransformFilled, tabReportAnalytics, tabSettings, tabUsers,
  tabShoppingCartPlus,tabShoppingBag
 } from 'quasar-extras-svg-icons/tabler-icons-v2'
 

export const useLeftDrawerStore = defineStore('left-drawer', {
  state: () => ({
    tabs:[
      {
        name: 'dashboard',
        label: 'Dashborad',
        icon: radixDashboard,
      },
      {
        name: 'master',
        label: 'Master',
        icon: tabBrandFirebase,
        sub: [
          {
            name: 'masterPegawai',
            label: 'Master Pegawai',
            icon: tabUsers,
          }
        ]
      },
      {
        name: 'trans',
        label: 'Transaksi',
        icon: tabTransformFilled,
        sub: [
          {
            name: 'transPembelian',
            label: 'Transaksi Pembelian',
            icon: tabShoppingCartPlus,
          },
          {
            name: 'transPenjualan',
            label: 'Transaksi Penjualan',
            icon: tabShoppingBag,
          }
        ]
      },
      {
        name: 'report',
        label: 'Laporan',
        icon: tabReportAnalytics,
      },
      {
        name: 'settings',
        label: 'Seetings',
        icon: tabSettings,
      },
    ],
    tabsBottom :[
      {
        name: 'profile',
        label: 'Profile',
        icon: tabUserEdit,
      },
      {
        name: 'notification',
        label: 'Notification',
        icon: tabBell,
      }
    ]
  }),

  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },

  actions: {
    // increment() {
    //   this.counter++
    // }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLeftDrawerStore, import.meta.hot))
}
