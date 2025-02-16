<template>
  <div v-if="isList">
    <HistoryPenjualanPage @back="isList=false" @use-nota="useNota"/>
  </div>
  <div v-else class="q-pa-md">
    <div class="row items-center">
      <div class="col-11">
        <div class="row justify-center text-weight-bold text-h5 q-my-xs">Penjualan</div>
        <div class="row justify-center text-weight-bold q-my-xs">
          <div class="col-6">
            <div class="row justify-between">
              <div class="col-5 text-right">Nota : </div>
              <div class="col-6">{{store.noNota??'nota tersedia setelah diisimpan satu data'}} </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-1 text-center">
        <app-btn class="q-mr-xs" icon="restore" tooltip="Nota Baru" color="green" @click="()=>{
          store.noNota=null
          store.resetForm()
          store.item=null
        }" />
        <app-btn icon="open_in_new" tooltip="Buka History Penjualan" color="primary" @click="isList=true" />
      </div>
    </div>

    <q-separator />
    <div class="q-my-xs">
      <div class="row">
        <div class="col-6">Produk</div>
        <div class="col-2 ">Jumlah</div>
        <div class="col-2 text-center">Harga</div>
        <div class="col-2">Diskon (Rp)</div>
      </div>
    </div>
    <q-separator />
    <div class="q-my-xs">
      <div v-if="store.loading" class="row full-width justify-between items-center q-pa-xs">
        <div class="col-auto">
          <q-spinner-pie color="primary" size="20px" />
          <q-spinner-pie color="primary" size="30px" />
          <q-spinner-pie color="primary" size="40px" />
        </div>
        <div class="col-auto">Sedang menyimpan</div>
        <div class="col-auto">
          <q-spinner-pie color="primary" size="40px" />
          <q-spinner-pie color="primary" size="30px" />
          <q-spinner-pie color="primary" size="20px" />
        </div>

      </div>
      <FormPage v-else/>
    </div>
    <q-separator />
    <div class="q-my-xs">
      <ListPage />
    </div>
  </div>

</template>
<script setup>
import { useFromPenjualanStore } from 'src/stores/admin/transaksi/penjualan/form'
import { useListPenjualanStore } from 'src/stores/admin/transaksi/penjualan/list'
import { defineAsyncComponent, ref, shallowRef } from 'vue'


const FormPage=shallowRef(defineAsyncComponent(()=>import('./comp/FormPage.vue')))
const ListPage=shallowRef(defineAsyncComponent(()=>import('./comp/ListPage.vue')))
const HistoryPenjualanPage=shallowRef(defineAsyncComponent(()=>import('./comp/HistoryPenjualanPage.vue')))

const isList=ref(false)


const store=useFromPenjualanStore()
const list=useListPenjualanStore()
list.getList()
function useNota(val){
    console.log('use nota',  val);
  isList.value=false
  store.noNota=val?.no_penjualan
  store.item=val
}

</script>
