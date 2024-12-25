<template>
  <div class="fit column">
    <div class="col-auto">
      <div class="column flex-center q-pt-sm">
        <avatar-logo></avatar-logo>
      </div>
    </div>
    <div class="col full-height">
      <div class="column full-height flex-center">
        <!-- <div v-for="n in 5" :key="n" class="cursor-pointer">
          <q-icon :name="radixDashboard" size="sm" color="primary"></q-icon>
        </div> -->
        <div>
          <q-tabs
            v-model="tab"
            vertical
            align="justify"
            switch-indicator
            active-color="secondary"
            class="text-grey-6"
          >
          <q-tab v-for="item in store?.tabs" :key="item.name" :name="item.name" @click="emits('selectTab', item)" >
            <q-icon :name="item.icon" size="sm"></q-icon>
          </q-tab>
         
        </q-tabs>
        </div>
      </div>
    </div>
    <div class="col-auto">
      <div class="column flex-center q-pb-lg q-gutter-lg">
        <div>
          <q-tabs
            v-model="tab"
            vertical
            align="justify"
            switch-indicator
            active-color="secondary"
            class="text-grey-6"
          >
          <q-tab v-for="item in store?.tabsBottom" :key="item.name" :name="item.name" @click="emits('selectTab', item)" >
            <q-icon :name="item.icon" size="sm"></q-icon>
          </q-tab>
         
        </q-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLeftDrawerStore } from 'src/stores/app/leftdrawer';
import { defineAsyncComponent, ref } from 'vue';


const AvatarLogo = defineAsyncComponent(() => import('src/components/app/AvatarLogo.vue'))
const store = useLeftDrawerStore()


const tab = ref('dashboard')
// const tabBot = ref('profile')

// const tabs = ref([
//   {
//     name: 'dashboard',
//     label: 'Dashborad',
//     icon: radixDashboard,
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
// ])
// const tabsBottom = ref([
//   {
//     name: 'profile',
//     label: 'Profile',
//     icon: tabUserEdit,
//   },
//   {
//     name: 'notification',
//     label: 'Notification',
//     icon: tabBell,
//   }
// ])

const emits = defineEmits(['selectTab'])

</script>