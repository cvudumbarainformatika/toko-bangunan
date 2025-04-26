<template>
  <template v-if="isList=='listPenjualan'">
  <Suspense>
    <list-penjualan-page @list="()=>isList='list'" @form="(val)=>{
        console.log('form', val);
        form.item=val
        isList='form'
      }"/>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
  </template>
  <template v-if="isList=='list'">
  <Suspense>
    <list-page @back="()=>isList='listPenjualan'"/>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
  </template>
  <template v-if="isList=='form'">
  <Suspense>
    <form-page @back="()=>{
        form.item=null
        form.resetForm()
        isList='listPenjualan'
      }"/>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
  </template>

</template>
<script setup>
import { useListReturPenjualanStore } from 'src/stores/admin/transaksi/returPenjualan/list'
import { useFormReturPenjualanStore } from 'src/stores/admin/transaksi/returPenjualan/form'
import { defineAsyncComponent, ref } from 'vue'
const listPage = defineAsyncComponent(() =>
  import('./comp/ListPage.vue')
)
const formPage = defineAsyncComponent(() =>
  import('./comp/FormPage.vue')
)
const listPenjualanPage = defineAsyncComponent(() =>
  import('./comp/ListPenjualanPage.vue')
)

const Loading=defineAsyncComponent(() => import('src/components/app/AppLoading.vue'))

const isList=ref('listPenjualan')

const list=useListReturPenjualanStore()


const form=useFormReturPenjualanStore()

list.getList()
</script>
