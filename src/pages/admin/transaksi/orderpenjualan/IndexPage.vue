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
    <DialogOrderPenjualan v-model="openDialogOrder" :order="item" />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
// const FormPage = defineAsyncComponent(() => import('./comp/FormPage.vue'))
const DialogOrderPenjualan = defineAsyncComponent(()=> import('./comp/DialogOrderPenjualan.vue'))

const isList = ref(true)
const item = ref(null)
const openDialogOrder = ref(false)
</script>

<style scoped></style>
