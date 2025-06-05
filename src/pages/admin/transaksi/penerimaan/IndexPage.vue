<template>
  <div class="fit">
    <ListPage
      v-if="isList"
      @add="
        () => {
          storepenerimaan.itemPenerimaan = null
          isList = false
        }
      "
      @edit="
        (data) => {
          storepenerimaan.itemPenerimaan = data
          isList = false
        }
      "
    />

    <FormPage v-else :data="storepenerimaan.itemPenerimaan" @back="isList = true" />
  </div>
</template>

<script setup>
// import { useAdminListTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/list'
// import { useAdminListTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/list'
import { data } from 'autoprefixer'
import { useAdminFormTransaksiPenerimaanBarangStore } from 'src/stores/admin/transaksi/penerimaan/form'
import { defineAsyncComponent, ref } from 'vue'
const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
const FormPage = defineAsyncComponent(() => import('./comp/FormPage.vue'))

const isList = ref(true)

const storepenerimaan = useAdminFormTransaksiPenerimaanBarangStore()
storepenerimaan.itemPenerimaan = []
storepenerimaan.form.pembayaran = data?.jenis_pembayaran
// const soterorder = useAdminListTransaksiOrderBarangStore()
// const storeorder = useAdminListTransaksiOrderBarangStore()
// storeorder.getorderanfix()
</script>

<style scoped></style>
