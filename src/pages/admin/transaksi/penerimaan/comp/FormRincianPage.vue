<!-- eslint-disable no-undef -->
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
        <q-card-section style="max-height: 50vh" class="scroll">
          <!-- <div v-if="props?.flaging === '1'">
            <div class="row q-gutter-sm">
              <div class="col-6">
                <app-input label="No. order" disable :v-model="props?.data" />
              </div>
              <div class="col-1">
                <q-btn round color="primary" icon="find_in_page" @click="cariorderan()" />
              </div>
              <div class="col-6">
                <app-input label="Supllier" disable v-model="store.form.suplier" />
              </div>
            </div>
            <q-separator class="q-mt-sm" />
          </div>
          <div v-else> -->
          <div class="row q-gutter-sm">
            <div class="col-6">
              <app-input label="No. order" disable v-model="store.form.noorder" />
            </div>
            <div class="col-1">
              <q-btn round color="primary" icon="find_in_page" @click="cariorderan()" />
            </div>
            <div class="col-6">
              <app-input label="Supllier" disable v-model="store.form.suplier" />
            </div>
          </div>
          <q-separator class="q-mt-sm" />

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
                        <q-input
                          label="Barang Datang"
                          dense
                          outlined
                          v-model="store.form.jumlahpo"
                          :model-value="item?.jumlahpo"
                          type="number"
                        />
                      </div>
                      <div class="col-2">
                        <q-input
                          label="harga fix"
                          dense
                          outlined
                          v-model="store.form.hargaasli"
                          :model-value="item?.hargapo"
                          type="number"
                        />
                      </div>
                      <div class="col-2">
                        <app-btn
                          :loading="store.loading && store.form.id === item.id"
                          type="submit"
                          label="Simpan"
                          color="teal"
                        />
                      </div>
                    </div>
                  </q-item-section>
                </q-form>
              </q-item>
            </transition-group>
          </q-list>
          <!-- </div> -->
        </q-card-section>
      </q-card>
    </div>
  </div>
  <dialogcariorderan-page />
</template>

<script setup>
import { useAdminListTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/list'
import dialogcariorderanPage from './dialogcariorderanPage.vue'
// import { computed } from 'vue'

import { formatRpDouble } from 'src/modules/formatter'
// import { useAdminListTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/list'

// import AppSelectServer from 'src/components/~global/AppSelectServer.vue'
import { useAdminFormTransaksiPenerimaanBarangStore } from 'src/stores/admin/transaksi/penerimaan/form'

const store = useAdminFormTransaksiPenerimaanBarangStore()
const storeorder = useAdminListTransaksiOrderBarangStore()
const emits = defineEmits(['back'])

function cariorderan() {
  storeorder.fixed = true
}

function onSubmit(val) {
  console.log('val', val?.jumlahpo)
  store.form.id = val?.id
  store.form.kdbarang = val?.kdbarang
  // store.form.jumlahpo = val?.jumlahpo
  store.form.jumlahpo_k = val?.jumlahpo_k
  store.form.satuan_b = val?.satuan_b
  store.form.satuan_k = val?.satuan_k
  store.form.isi = val?.isi
  store.form.hargafaktur = val?.hargapo
  store.form.hargaasli = store.form.hargaasli === 0 ? val?.hargapo : store.form.hargaasli
  store.save()
}

// const lists = computed(() => {
//   const arr = store?.rinci
//   console.log('sasasasa', arr)
//   return arr?.sort((a, b) => {
//     return b.id - a.id
//   })
// })

// eslint-disable-next-line no-unused-vars
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
</script>
