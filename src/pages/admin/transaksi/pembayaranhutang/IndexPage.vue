<template>
  <div class="fit">
    <ListPage
      v-if="isList"
      @add="
        () => {
          storelist.items = null
          isList = false
        }
      "
      @edit="
        (data) => {
          storelist.items = data
          isList = false
        }
      "
    />

    <FormPage v-else :data="storelist?.items" @back="isList = true" />
  </div>
</template>

<script setup>
import { useAdminListTransaksiPembayaranHutangStore } from 'src/stores/admin/transaksi/pembayaranhutang/list'
import { defineAsyncComponent, ref } from 'vue'
const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))
const FormPage = defineAsyncComponent(() => import('./comp/IndexFormPage.vue'))

const isList = ref(true)
const storelist = useAdminListTransaksiPembayaranHutangStore()

storelist.getList()
</script>
