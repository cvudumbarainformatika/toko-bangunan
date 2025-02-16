<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="row items-center q-col-gutter-sm">
    <div class="col-6">
      <AppSelect
        ref="refSelectBarang"
        v-model="store.barang"
        url="v1/transaksi/penjualan/list-barang"
        :option-label="opt=> opt.namabarang + ' ' + (opt?.brand===null ? '' : opt?.brand) + ' ' + (opt?.seri===null ? '' : opt?.seri)+ ' ' + (opt?.ukuran===null ? '' : opt?.ukuran)"
        :option-value="opt=> opt"
        label="Cari barang"
        :filter-min="3"
        filter-by="namabarang"

        @selected="selected($event)"
        @on-input="onInput($event)"
      />
    </div>
    <div class="col-2">
      <app-input ref="refJumlah" v-model="store.form.jumlah" label="Jumlah" :autofocus="false" @keyup.enter.stop="onEnterinput()"
      :rules="[(val) => parseFloat(val)>0 || 'Jumlah barang harus lebih besar dari 0']" @clear=setNol(strJumlah)
      />
    </div>
    <div class="col-2 text-center">{{store?.form?.harga_jual}}</div>
    <div class="col-2"><app-input v-model="store.form.diskon" label="Diskon (Rp)" :autofocus="false" @keyup.enter.stop="onEnterinput()" @clear=setNol(strDsikon) /></div>
  </div>
</template>
<script setup>
import { useFromPenjualanStore } from 'src/stores/admin/transaksi/penjualan/form'
import { defineAsyncComponent, ref, shallowRef } from 'vue'

const AppSelect=shallowRef(defineAsyncComponent(() => import('./AppSelect.vue')))
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
    store.setForm('harga_jual',isNaN(store?.barang?.hargajual1)?0:parseFloat(store?.barang?.hargajual1))
    store.setForm('harga_beli',isNaN(store?.barang?.hargabeli)?0:parseFloat(store?.barang?.hargabeli))
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
