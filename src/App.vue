<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onBeforeMount } from 'vue'
import { useAppStore } from './stores/app'
import { useLeftDrawerStore } from './stores/app/leftdrawer'
import { useAdminMasterSatuanSelectStore } from './stores/admin/master/satuan/select'
import { useAdminMasterBrandSelectStore } from './stores/admin/master/brand/select'
import { useProfilStore } from './stores/admin/profil'

//

const $q = useQuasar()
const app = useAppStore()
const adminLeftMenu = useLeftDrawerStore()
const selectSatuan = useAdminMasterSatuanSelectStore()
const selectBrands = useAdminMasterBrandSelectStore()
const profiltoko = useProfilStore()

onBeforeMount(() => {
  $q.dark.set(app?.dark)
  Promise.all([
    adminLeftMenu.getMenu(),
    selectSatuan.getDataAll(),
    selectBrands.getDataAll(),
    profiltoko.getProfil(),
  ])
})
</script>
