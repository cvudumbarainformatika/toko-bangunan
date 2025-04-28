<template>
  <div class="fit column absolute">
    <div class="col full-height">
      <q-card flat bordered square class="full-height" style="overflow: hidden">
        <q-card-section class="q-px-md q-py-xs bg-primary text-white col-auto full-width">
          <div class="row items-center justify-between">
            <div class="f-12 text-weight-bold">
              <app-btn-back size="sm" @click="emits('back')" class="bg-dark" />
              Form Peneriaman
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-gutter-sm">
            <div class="col-6">
              <app-input label="No. order" disable v-model="store.form.noorder" />
            </div>
            <div class="col-1" v-if="store.form.nopenerimaan === undefined">
              <q-btn round color="primary" icon="find_in_page" @click="cariorderan()" />
            </div>
            <div class="col-1" v-else-if="props?.data?.kunci === null">
              <q-btn
                round
                color="primary"
                icon="lock_open"
                @click="store.kirimstok(lists, store.form.nopenerimaan)"
                :loading="store.loadingstok"
              />
            </div>
            <div class="row" v-else-if="props?.data?.kunci === '1'">
              <div>
                <q-btn size="sm" padding="sm" round dense color="primary" icon="lock" />
              </div>
              <div class="q-pl-xs">
                <app-btn-cetak @click="cetakData()" />
              </div>
            </div>
            <div class="col-6">
              <app-input label="Supllier" disable v-model="store.form.suplier" />
            </div>
          </div>
          <q-separator class="q-mt-sm" />
        </q-card-section>
        <q-card-section style="max-height: 80%" class="scroll">
          <q-list>
            <transition-group>
              <q-item v-for="(item, n) in store.rinci" :key="n" class="list-move">
                <q-form ref="refForm" class="column full-height" @submit="onSubmit(item)">
                  <q-item-section>
                    <div class="row full-width q-gutter-xs">
                      <div class="col-12">
                        <span class="text-weight-medium">{{ item?.mbarang?.namabarang }}</span>
                        <span class="text-grey-8"> ({{ item?.kdbarang }})</span>
                      </div>
                      <div class="col-2">
                        <span class="text-weight-medium">
                          {{ item?.jumlahpo }} {{ item?.satuan_b }}</span
                        >
                        <span class="text-grey-8" v-if="item?.isi !== '1'">
                          ({{ item?.jumlahpo_k }} {{ item?.satuan_k }})</span
                        >
                      </div>
                      <div class="col-1">
                        <span> X </span>
                      </div>
                      <div class="col-2">
                        <span class="text-weight-medium"> {{ formatRpDouble(item?.hargapo) }}</span>
                      </div>
                      <div class="col-2">
                        <AppInputRp
                          label="Barang Rusak"
                          dense
                          outlined
                          v-model="item.rusak"
                          currency
                          style="width: 100px"
                        />
                      </div>
                      <div class="col-2">
                        <AppInputRp
                          label="Barang Datang"
                          dense
                          outlined
                          v-model="item.jumlahpox"
                          currency
                          style="width: 100px"
                        />
                      </div>
                      <div class="col-1">
                        <app-input-rp
                          label="harga fix"
                          dense
                          outlined
                          v-model="item.hargafix"
                          currency
                          style="width: 100px"
                        />
                      </div>
                      <div class="col-2" v-if="props?.data?.kunci === '1'"></div>
                      <div class="col-2" v-else>
                        <app-btn
                          :loading="store.loading && store.form.id === item.id"
                          type="submit"
                          color="teal"
                          icon="save"
                        />
                      </div>
                    </div>
                  </q-item-section>
                  <q-separator class="q-mt-sm" />
                </q-form>
              </q-item>
            </transition-group>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </div>
  <dialogcariorderan-page />
  <dialog-cetakdata v-model="store.dialogCetak" :printdata="printdata" />
</template>

<script setup>
import { useAdminListTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/list'
import dialogcariorderanPage from './dialogcariorderanPage.vue'
// import { computed } from 'vue'

import { formatRpDouble, olahUang } from 'src/modules/formatter'
// import { useAdminListTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/list'

// import AppSelectServer from 'src/components/~global/AppSelectServer.vue'
import { useAdminFormTransaksiPenerimaanBarangStore } from 'src/stores/admin/transaksi/penerimaan/form'
import AppInputRp from 'src/components/~global/AppInputRp.vue'
import { notifError } from 'src/modules/notifs'
import { computed, defineAsyncComponent, ref } from 'vue'

const DialogCetakdata = defineAsyncComponent(() => import('./cetak/DialogCetak.vue'))

const store = useAdminFormTransaksiPenerimaanBarangStore()
const storeorder = useAdminListTransaksiOrderBarangStore()
const emits = defineEmits(['back'])
const printdata = ref(null)

function cariorderan() {
  storeorder.fixed = true
  storeorder.getorderanfix()
}

function onSubmit(val) {
  console.log('val', val)
  store.form.id = val?.id
  store.form.kdbarang = val?.kdbarang
  store.form.jumlahorder = val?.jumlahpo
  store.form.jumlahpo = olahUang(val?.jumlahpox)
  store.form.jumlahpo_k = val?.jumlahpo_k
  store.form.satuan_b = val?.satuan_b
  store.form.satuan_k = val?.satuan_k
  store.form.isi = val?.isi
  store.form.hargafaktur = val?.hargapo
  store.form.hargaasli = olahUang(val?.hargafix)
  if (parseFloat(store.form.jumlahorder) < parseFloat(store.form.jumlahpo)) {
    notifError('Jumlah yang Anda Masukkan Melebihi jumlah pesanan...!!!')
  } else {
    store.save()
  }
}

// const lists = computed(() => {
//   const arr = store?.rinci
//   console.log('sasasasa', arr)
//   return arr?.sort((a, b) => {
//     return b.id - a.id
//   })
// })

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
  flaging: {
    type: String,
    default: '',
  },
})

const lists = computed(() => {
  const arr = props.data?.rinci
  // console.log('arr', arr)
  return arr?.sort((a, b) => {
    return b.id - a.id
  })
})

function cetakData() {
  store.dialogCetak = true
}

if (props?.data) {
  const rinciterima = props?.data?.rinci
  const rinciorder = store.rinci?.filter((x) => x.noorder === props?.data?.noorder)

  const kodebarang = rinciterima?.map((x) => x.kdbarang)
  const newset = kodebarang?.length ? [...new Set(kodebarang)] : []
  const rincians = []
  for (let i = 0; i < newset.length; i++) {
    const el = newset[i]
    const obterima = rinciterima?.filter((x) => x.kdbarang === el)

    const obj = {
      kdbarang: rinciorder?.filter((x) => x.kdbarang === el)[0].kdbarang,
      namabarang: rinciorder?.filter((x) => x.kdbarang === el)[0].mbarang?.namabarang,
      jumlahorder: rinciorder?.filter((x) => x.kdbarang === el)[0].jumlahpo,
      jumlahterima: obterima?.map((x) => parseInt(x.jumlah_b)).reduce((a, b) => a + b, 0),
      hargafaktur: obterima?.map((x) => parseInt(x.hargafaktur)).reduce((a, b) => a + b, 0),
      subtotalfix: obterima?.map((x) => parseInt(x.subtotalfix)).reduce((a, b) => a + b, 0),
    }
    rincians.push(obj)
  }

  const penerimaan = {
    nopenerimaan: props?.data?.nopenerimaan,
    noorder: props?.data?.noorder,
    suplier: props?.data?.suplier,
    tanggal: props?.data?.tgl,
    total: props?.data?.total,
    totalfix: props?.data?.totalfix,
    rincians: rincians,
  }

  store.dataprops = penerimaan
}
</script>
