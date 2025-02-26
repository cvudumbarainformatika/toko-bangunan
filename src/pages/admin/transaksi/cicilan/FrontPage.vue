<template>
  <div v-if="isList">
    <ListPenjualanPage @back="isList=false" @bawa="bawaNota" @cicil="cicilNota" @kembali="kembaliTanpaBayar"/>
  </div>
  <div v-else class="q-pa-md">
    <div class="row items-center">
      <div class="col-10">
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
      <div class="col-2 text-right">
        <app-btn v-if="store?.noNota" class="q-mr-xs" icon="attach_money" tooltip="Pembayaran" color="blue" @click="()=>{
          store.openPembayaran=true
          store.formPembayaran.total=store.item?.total
          store.formPembayaran.no_penjualan=store.noNota
        }" />
        <app-btn icon="open_in_new" tooltip="Buka History Penjualan" color="primary" @click="isList=true" />
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
    <q-separator v-if="store?.item!=null"/>
    <div v-if="store?.item!=null" class="row q-py-md">
      <div class="col-4"></div>
      <div class="col-5 text-weight-bold">Total</div>
      <div class="col-2 text-weight-bold text-right">{{store?.item?.total}}</div>
    </div>
    <q-separator v-if="store?.item!=null"/>
  </div>
</template>
<script setup>
import { useListCicilanPenjualanStore } from 'src/stores/admin/transaksi/cicilan/list'
import { useFromPenjualanStore } from 'src/stores/admin/transaksi/penjualan/form'
import { defineAsyncComponent, ref, shallowRef } from 'vue'


const FormPage=shallowRef(defineAsyncComponent(()=>import('./comp/FormPage.vue')))
const ListPenjualanPage=shallowRef(defineAsyncComponent(()=>import('./comp/ListPenjualanPage.vue')))

const isList=ref(true)


const store=useFromPenjualanStore()
const list=useListCicilanPenjualanStore()
list.getList()
store.getSales()

function bawaNota(val){
  console.log('bawa nota', val);
  list.BawaNota(val)
  // isList.value=false
}
function cicilNota(val){
  console.log('cicil nota', val);
  isList.value=false
}
function kembaliTanpaBayar(val){
  console.log('kembaliTanpaBayar nota', val);
  isList.value=false
}
</script>
