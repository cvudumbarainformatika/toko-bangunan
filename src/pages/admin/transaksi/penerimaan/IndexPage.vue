<template>
  <div class="fit">
    <ListPage
      v-if="isList"
      @add="
        () => {
          store.item = null
          isList = false
        }
      "
      @edit="
        (data) => {
          store.item = data
          isList = false
        }
      "
    />

    <FormPage v-else :data="store.item" @back="isList = true" />
  </div>
</template>

<script setup>
import { useAdminListTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/list'
import { useAdminFormTransaksiPenerimaanBarangStore } from 'src/stores/admin/transaksi/penerimaan/form'
import { defineAsyncComponent, ref } from 'vue'
const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
const FormPage = defineAsyncComponent(() => import('./comp/FormPage.vue'))

const isList = ref(true)

const store = useAdminFormTransaksiPenerimaanBarangStore()
const storeorderan = useAdminListTransaksiOrderBarangStore()

storeorderan.getorderanfix()
</script>

<style scoped></style>
