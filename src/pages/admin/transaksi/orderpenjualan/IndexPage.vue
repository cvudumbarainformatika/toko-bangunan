<template>
  <div class="fit">
    <ListPage
      v-if="isList"
      @add="
        () => {
          item = null
          isList = true
        }
      "
      @edit="
        (data) => {
          console.log('from emit',data);
          
          item = data
          isList = true
          openDialogOrder=true
        }
      "
    />

    <!-- <FormPage v-else :data="item" @back="isList = true" /> -->
    <DialogOrderPenjualan v-model="openDialogOrder" :order="item" 
      @update-rincian="onUpdateRincian"
      @delete-rincian="onDeleteRincian" 
      @update-status="onUpdateStatus"
    />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
import { useAdminOrderPenjualanStore } from 'src/stores/admin/transaksi/orderpenjualan/list'


const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
// const FormPage = defineAsyncComponent(() => import('./comp/FormPage.vue'))
const DialogOrderPenjualan = defineAsyncComponent(()=> import('./comp/DialogOrderPenjualan.vue'))

const isList = ref(true)
const item = ref(null)
const openDialogOrder = ref(false)

const storeList = useAdminOrderPenjualanStore()
const { onUpdateRincian, onDeleteRincian, onUpdateStatus } = storeList
</script>

<style scoped></style>
