<template>
  <div>
    <div class="row justify-center text-weight-bold text-h5 q-my-xs">Penjualan</div>
    <div class="row justify-center text-weight-bold q-my-xs">
      <div class="col-6">
        <div class="row justify-between">
          <div class="col-5 text-right">Nota : </div>
          <div class="col-6">Nomor Nota </div>
        </div>
      </div>
    </div>
    <q-separator />
    <div class="q-my-xs">
      <FormPage />
    </div>
    <q-separator />
    <div class="q-my-xs">
      <ListPage />
    </div>
  </div>
</template>
<script setup>
import { defineAsyncComponent } from 'vue'


const FormPage=defineAsyncComponent(()=>import('./comp/FormPage.vue'))
const ListPage=defineAsyncComponent(()=>import('./comp/ListPage.vue'))
</script>
