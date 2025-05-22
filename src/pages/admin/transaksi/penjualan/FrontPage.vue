<template>
  <div v-if="isList">
    <HistoryPenjualanPage
      @back="
        () => {
          store.resetPembayaran()
          isList = false
        }
      "
      @use-nota="useNota"
      @bayar="bayar"
    />
  </div>
  <div v-else class="q-pa-md">
    <div class="row items-center">
      <div class="col-10">
        <div class="row justify-center text-weight-bold text-h5 q-my-xs">Penjualan</div>
        <div class="row justify-center text-weight-bold q-my-xs">
          <div class="col-6">
            <div class="row justify-between">
              <div class="col-5 text-right">Nota :</div>
              <div class="col-6">
                {{ store.noNota ?? 'nota tersedia setelah diisimpan satu data' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-2 text-right">
        <!-- <app-btn-cetak v-if="store?.noNota" class="q-mr-xs" @click="lihatCetak()"></app-btn-cetak> -->
        <app-btn
          v-if="store?.noNota"
          class="q-mr-xs"
          icon="attach_money"
          tooltip="Pembayaran"
          color="blue"
          @click="
            () => {
              store.openPembayaran = true
              store.formPembayaran.total = store.item?.total
              store.formPembayaran.total_diskon = store.item?.total_diskon
              store.formPembayaran.no_penjualan = store.noNota
              console.log('store.formPembayaran', store.formPembayaran)
            }
          "
        />
        <app-btn
          icon="open_in_new"
          tooltip="Buka History Penjualan"
          color="primary"
          @click="isList = true"
        />
      </div>
    </div>

    <q-separator />

    <div class="q-my-xs">
      <div v-if="store.loading" class="row full-width justify-between items-center q-pa-xs">
        <div class="col-auto">
          <q-spinner-pie color="grey-5" size="20px" />
          <q-spinner-pie color="grey-5" size="30px" />
          <q-spinner-pie color="grey-5" size="40px" />
        </div>
        <div class="col-auto">Sedang menyimpan</div>
        <div class="col-auto">
          <q-spinner-pie color="grey-5" size="40px" />
          <q-spinner-pie color="grey-5" size="30px" />
          <q-spinner-pie color="grey-5" size="20px" />
        </div>
      </div>
      <FormPage v-else />
    </div>
    <q-separator />
    <div class="q-my-xs">
      <ListPage />
    </div>
    <q-separator v-if="store?.item != null" />
    <div v-if="store?.item != null" class="row q-py-md">
      <div class="col-4"></div>
      <div class="col-3 text-weight-bold">Total</div>
      <div class="col-2 text-weight-bold text-right">
        {{ formatDouble(store?.item?.total_diskon) }}
      </div>
      <div class="col-2 text-weight-bold text-right">{{ formatDouble(store?.item?.total) }}</div>
    </div>
    <q-separator v-if="store?.item != null" />
  </div>
  <DialogPembayaranPage v-model="store.openPembayaran" />
  <DialogCetak v-model="store.opendialogCetak" />
</template>
<script setup>
import { formatDouble } from 'src/modules/formatter'
import { useFromPenjualanStore } from 'src/stores/admin/transaksi/penjualan/form'
import { useListPenjualanStore } from 'src/stores/admin/transaksi/penjualan/list'
import { defineAsyncComponent, ref, shallowRef } from 'vue'

const FormPage = shallowRef(defineAsyncComponent(() => import('./comp/FormPage.vue')))
const ListPage = shallowRef(defineAsyncComponent(() => import('./comp/ListPage.vue')))
const HistoryPenjualanPage = shallowRef(
  defineAsyncComponent(() => import('./comp/HistoryPenjualanPage.vue')),
)
const DialogPembayaranPage = shallowRef(
  defineAsyncComponent(() => import('./comp/DialogPembayaranPage.vue')),
)
const DialogCetak = shallowRef(defineAsyncComponent(() => import('./comp/cetak/DialogCetak.vue')))

const isList = ref(false)
const store = useFromPenjualanStore()
const list = useListPenjualanStore()
list.getList()
store.getSales()
function useNota(val) {
  // console.log('use nota',  val);
  isList.value = false
  store.form.sales_id = val?.sales_id
  store.noNota = val?.no_penjualan
  store.item = val
}
function bayar(item) {
  console.log('bayar', item)
  store.noNota = item?.no_penjualan
  store.item = item
  store.openPembayaran = true
  store.formPembayaran.total = item?.total
  store.formPembayaran.total_diskon = item?.total_diskon
  store.formPembayaran.no_penjualan = item?.no_penjualan
}
// function lihatCetak(item) {
//   console.log('item', item)
//   store.opendialogCetak = true
// }
</script>
