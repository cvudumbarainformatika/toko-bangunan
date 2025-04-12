<template>
  <q-dialog
    v-model="store.isOpen"
    persistent
    @show="()=>{
      store.form.jumlah=0
    }"
  >
    <q-card style="min-width: 550px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Pembayaran Cicilan</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="store.isOpenDetail = false"
        />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row q-mt-sm justify-between">
          <div class="col-4">Total Hutang</div>
          <div class="col-3">{{ formatDouble(totalHutang()) || 0 }}</div>
        </div>
        <div class="row q-mt-sm justify-between">
          <div class="col-4">Total Cicilan</div>
          <div class="col-3">{{ formatDouble(totalCicilan()) }}</div>
        </div>
        <div class="row q-mt-sm justify-between">
          <div class="col-4">Sisa Hutang</div>
          <div class="col-3">{{ formatDouble(
            totalHutang() -
            totalCicilan()
            )  }}</div>
        </div>
        <div class="row justify-end">
          <q-btn size="sm" padding="none" flag icon="info" flat @click="store.isOpenDetail= !store.isOpenDetail"> <q-tooltip>{{store.isOpenDetail? 'Tutup detail hutang' : 'Melihat detail hutang'}}</q-tooltip></q-btn>
        </div>
        <div v-if="store.isOpenDetail">
          <div class="row ">
            <div style="width: 33%;" class="col-auto ">Nota</div>
            <div style="width: 23%;" class="col-auto text-right">Hutang</div>
            <div style="width: 22%;" class="col-auto text-right">Dibayar</div>
            <div style="width: 22%;" class="col-auto text-right">Sisa</div>
          </div>
          <q-separator />
          <div v-for="item in cariPenjualan()" :key="item.id" class="row ">
            <div style="width: 33%;" class="col-auto ">{{ item.no_penjualan }}</div>
            <div style="width: 23%;" class="col-auto text-right">{{ formatDouble(item?.total - item?.total_diskon) }}</div>
            <div style="width: 22%;" class="col-auto text-right">{{ formatDouble(cariCicilan(item)) }}</div>
            <div style="width: 22%;" class="col-auto text-right">{{ formatDouble(item?.total - item?.total_diskon - cariCicilan(item)) }}</div>
          </div>
        </div>
        <app-input-rp
          currency
          v-model="store.form.jumlah"
          label="Jumlah Dibayarkan"
          outlined
          dense
          class="q-mt-sm"
          :disable="store.loading"
          @update:model-value="updateValue"
          @keyup.enter="store.simpanCicilan"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Simpan"
          color="primary"
          :loading="store.loading"
          :disable="store.loading || store.form.jumlah <= 0"
          @click="store.simpanCicilan"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { formatDouble } from 'src/modules/formatter'
import { useCicilanPenjualanFormStore } from 'src/stores/admin/transaksi/cicilan/form'
import { useListCicilanPenjualanStore } from 'src/stores/admin/transaksi/cicilan/list'


const store = useCicilanPenjualanFormStore()
const list = useListCicilanPenjualanStore()
function updateValue(val) {
  const _removedZeros = val?.replace(/^0+/, '')
  if (val > 1) {
    store.form.jumlah = _removedZeros
  }
  // store.form.jumlah = val
}
function cariCicilan(item) {
  return item?.cicilan?.reduce((a, b) => a + parseFloat(b.jumlah), 0) ?? 0
}
function totalCicilan() {
  const total=list.items?.filter(f=>f.pelanggan_id===store?.item?.pelanggan?.id)?.flatMap(x=>x?.cicilan)?.reduce((a, b) => a + parseFloat(b?.jumlah??0), 0) ?? 0

  return total
}
function totalHutang() {
  const hutang=list.items?.filter(f=>f.pelanggan_id===store?.item?.pelanggan?.id)?.reduce((a, b) => a + parseFloat(b?.total??0), 0) ?? 0
  const diskon=list.items?.filter(f=>f.pelanggan_id===store?.item?.pelanggan?.id)?.reduce((a, b) => a + parseFloat(b?.total_diskon??0), 0) ?? 0

  return hutang - diskon
}
function cariPenjualan() {
  const data=list.items?.filter(f=>f.pelanggan_id===store?.item?.pelanggan?.id)

  return data
}
</script>
