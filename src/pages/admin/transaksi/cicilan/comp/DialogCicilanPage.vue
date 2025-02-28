<template>
  <q-dialog
    v-model="store.isOpen"
    persistent
    @show="()=>{
      store.form.jumlah=0
    }"
  >
    <q-card style="min-width: 350px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Pembayaran Cicilan</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row q-mt-sm justify-between">
          <div class="col-4">Jumlah Hutang</div>
          <div class="col-3">{{ (store?.item?.total - store?.item?.total_diskon) || 0 }}</div>
        </div>
        <div class="row q-mt-sm justify-between">
          <div class="col-4">Jumlah Cicilan</div>
          <div class="col-3">{{ store?.item?.cicilan?.reduce((a,b)=>a+parseFloat(b.jumlah),0) || 0 }}</div>
        </div>
        <div class="row q-mt-sm justify-between">
          <div class="col-4">Kurang Bayar</div>
          <div class="col-3">{{ ((store?.item?.total - (store?.item?.total_diskon??0))??0)-(store?.item?.cicilan?.reduce((a,b)=>a+parseFloat(b.jumlah),0)??0)  }}</div>
        </div>
        <q-input
          v-model="store.form.jumlah"
          label="Jumlah Dibayarkan"
          outlined
          dense
          class="q-mt-sm"
          @keyup.enter="store.simpanCicilan"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Simpan"
          color="primary"
          @click="store.simpanCicilan"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useCicilanPenjualanFormStore } from 'src/stores/admin/transaksi/cicilan/form'

const store = useCicilanPenjualanFormStore()
</script>
