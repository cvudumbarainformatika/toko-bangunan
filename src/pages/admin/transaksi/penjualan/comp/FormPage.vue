<!-- eslint-disable vue/no-parsing-error -->
<template>
    <div class="row q-mb-md">
      <div class="col-6">
        <app-select
        ref="refSelectSales"
        v-model="store.form.sales_id"
        option-label="nama"
        option-value="id"
        label="Cari Sales"
        :options="store.sales"
        :disable="store?.item?.detail?.length>0"
      />
      </div>
      <div class="col-6 text-right">

        <app-btn class="q-mr-xs" icon="restore" tooltip="Nota Baru" color="green" @click="()=>{
          store.noNota=null
          store.resetForm()
          store.item=null
        }" />
      </div>
    </div>
    <div class="row q-mb-sm">
      <div class="col-4">Produk</div>
      <div class="col-2 ">Jumlah</div>
      <div class="col-2 ">Harga Jual</div>
      <div class="col-2">Diskon (Rp)</div>
      <div class="col-2 ">Harga Beli</div>
    </div>
  <q-separator />
  <div class="row items-center q-col-gutter-sm">
    <div class="col-4">
      <AppSelectLocal
        ref="refSelectBarang"
        v-model="store.barang"
        url="v1/transaksi/penjualan/list-barang"
        :option-label="opt=> opt.namabarang + ' ' + (opt?.stok===null ? '' : '(stok '+opt?.stok.jumlah_k+ '  '+ opt?.stok.satuan_k+' )') "
        :option-value="opt=> opt"
        label="Cari barang"
        :filter-min="3"
        filter-by="namabarang"

        @selected="selected($event)"
        @on-input="onInput($event)"
      />
    </div>
    <div class="col-2">
      <app-input ref="refJumlah" v-model="store.form.jumlah" :label="'Jumlah (Stok'+ (store?.barang?.stok?.jumlah_k??0)+')'" :autofocus="false" @keyup.enter.stop="onEnterinput()"
      :rules="[(val) => parseFloat(val)>0 || 'Jumlah barang harus lebih besar dari 0']" @clear=setNol(strJumlah) @update:model-value="(val)=>{

        const _removedZeros = val?.replace(/^0+/, '')
        store.setForm('jumlah',parseFloat(_removedZeros))
      }"
      />
    </div>
    <div class="col-2">
      <app-input-rp currency v-model="store.form.harga_jual" label="Harga Jual" outlined :autofocus="false" @keyup.enter.stop="onEnterinput()" @clear="()=>{
      store.setForm('harga_jual',isNaN(store?.barang?.hargajual1)?0:parseFloat(store?.barang?.hargajual1))
    }" />
    </div>
    <div class="col-2"><app-input-rp currency outlined v-model="store.form.diskon" label="Diskon (Rp)" :autofocus="false" @keyup.enter.stop="onEnterinput()" @clear=setNol(strDsikon) /></div>
    <div class="col-2"><app-input-rp currency outlined v-model="store.form.harga_beli" label="Harga Beli" :autofocus="false" readonly  /></div>
  </div>
</template>
<script setup>
import { useFromPenjualanStore } from 'src/stores/admin/transaksi/penjualan/form'
import { defineAsyncComponent, ref, shallowRef } from 'vue'

const AppSelectLocal=shallowRef(defineAsyncComponent(() => import('./AppSelect.vue')))
// const AppInput=shallowRef(defineAsyncComponent(() => import('src/components/app/AppInput.vue')))
const store=useFromPenjualanStore()

const refSelectBarang=ref(null)
const refJumlah=ref(null)
const strJumlah=ref('jumlah')
const strDsikon=ref('diskon')
function selected(val){
  // console.log('ref', refSelectBarang.value?.refAuto);
  // console.log('store', store.barang);
  const keys=Object.keys(val)
  if(keys?.length>0){
    store.barang=val
    store.setForm('kodebarang',store?.barang?.kodebarang)
    if(!store.form.sales_id) store.setForm('harga_jual',isNaN(store?.barang?.hargajual1)?0:parseFloat(store?.barang?.hargajual1))
    else store.setForm('harga_jual',isNaN(store?.barang?.hargajual1)?0:parseFloat(store?.barang?.hargajual2))
    store.setForm('harga_beli',isNaN(store?.barang?.stok?.harga_beli_k)?0:parseFloat(store?.barang?.stok?.harga_beli_k))
    console.log('form', store.form);
  }
  setTimeout(() => {
    refSelectBarang.value?.refAuto?.validate()
    console.log('ref', refSelectBarang.value?.refAuto?.validate());

  },100)

}
function validasi(){
  const jumlah=refJumlah.value?.appInput?.validate()
  const barang=refSelectBarang.value?.refAuto?.validate()
  console.log('jumlah',jumlah, 'barang', barang);
  if(jumlah && barang) return true
  else return false

}
function onInput(){
  // console.log('on input', val);
  // console.log('input', store.barang);
  // if(val?.length<3) store.resetForm()
  store.resetForm()
}

function onEnterinput(){
  console.log('on enter input');
  if(validasi()) store.simpanDetail()


}
function setNol(val){
  console.log('nol',val);

  store.setForm(val,0)
}
</script>
