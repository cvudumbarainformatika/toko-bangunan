/* eslint-disable no-unused-vars */
import { defineStore, acceptHMRUpdate } from 'pinia'
import { radixDashboard } from 'quasar-extras-svg-icons/radix-ui-icons'
import { tabUserEdit, tabBell, tabBrandFirebase, tabTransformFilled, tabReportAnalytics, tabSettings, tabUsers,
  tabShoppingCartPlus,tabShoppingBag
 } from 'quasar-extras-svg-icons/tabler-icons-v2'
import { api } from 'src/boot/axios'
import { useRoute } from 'vue-router'
 

export const useLeftDrawerStore = defineStore('left-drawer', {
  state: () => ({
    // tabs:[
    //   {
    //     name: 'dashboard',
    //     label: 'Dashborad',
    //     icon: radixDashboard,
    //     link:'/admin/dashboard'
    //   },
    //   {
    //     name: 'master',
    //     label: 'Master',
    //     icon: tabBrandFirebase,
    //     sub: [
    //       {
    //         name: 'masterPegawai',
    //         label: 'Master Pegawai',
    //         icon: tabUsers,
    //       }
    //     ]
    //   },
    //   {
    //     name: 'trans',
    //     label: 'Transaksi',
    //     icon: tabTransformFilled,
    //     sub: [
    //       {
    //         name: 'transPembelian',
    //         label: 'Transaksi Pembelian',
    //         icon: tabShoppingCartPlus,
    //       },
    //       {
    //         name: 'transPenjualan',
    //         label: 'Transaksi Penjualan',
    //         icon: tabShoppingBag,
    //       }
    //     ]
    //   },
    //   {
    //     name: 'report',
    //     label: 'Laporan',
    //     icon: tabReportAnalytics,
    //   },
    //   {
    //     name: 'settings',
    //     label: 'Seetings',
    //     icon: tabSettings,
    //   },
    // ],
    tabs: [],
    tabsBottom :[
      {
        name: 'profile',
        label: 'Profile',
        icon: tabUserEdit,
        link:'/admin/profile'
      },
      {
        name: 'notification',
        label: 'Notification',
        icon: tabBell,
      }
    ],
    tab: 'dashboard'
  }),
  persist: true,

  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },

  actions: {
    async getMenu() {
      const{data} = await api.get('/v1/admin/menu/list')
      // console.log(data);
      this.tabs = data
      
    },

    setTab(route) {
      console.log('tab from page');
      console.log('route', route);

      if (route) {
        const ketemu = this.tabs?.find(x=> x?.link === route)?.name ?? null
        if (ketemu) {
          this.tab = ketemu
        } else {
          console.log('gak ketemu', route);
          const caridikedalaman = this?.tabs?.find(x=> x?.subs?.find(y=> y?.link === route)) ?? null
          console.log('caridikedalaman', caridikedalaman);
          this.tab = caridikedalaman ? caridikedalaman?.name : 'dashboard'
          
        }
        
      }
        
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLeftDrawerStore, import.meta.hot))
}
