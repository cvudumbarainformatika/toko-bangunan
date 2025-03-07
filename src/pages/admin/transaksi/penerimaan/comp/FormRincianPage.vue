<template>
  <div class="fit column absolute">
    <div class="col full-height">
      <q-card flat bordered square class="full-height" style="overflow: hidden">
        <q-form ref="refForm" class="column full-height">
          <q-card-section class="q-px-md q-py-xs bg-primary text-white col-auto full-width">
            <div class="row items-center justify-between">
              <div class="f-12 text-weight-bold">
                <app-btn-back size="sm" @click="emits('back')" class="bg-dark" />
                Form Peneriaman
              </div>
            </div>
          </q-card-section>
          <q-card-section style="max-height: 50vh" class="scroll">
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
                  <q-item-section>
                    <div class="row full-width">
                      <div class="col-12">
                        <span class="text-weight-medium">{{ item?.mbarang?.namabarang }}</span>
                        <span class="text-grey-8"> ({{ item?.kdbarang }})</span>
                      </div>
                      <div class="col-2">
                        <span class="text-weight-medium"> {{ item?.jumlahpo }}</span>
                      </div>
                      <div class="col-1">
                        <span> X </span>
                      </div>
                      <div class="col-3">
                        <span class="text-weight-medium"> {{ formatRpDouble(item?.hargapo) }}</span>
                      </div>
                      <div class="col-1">
                        <span class="text-weight-medium"> = </span>
                      </div>
                      <div class="col-3">
                        <span class="text-weight-medium">
                          {{ formatRpDouble(item?.subtotal) }}</span
                        >
                      </div>
                      <div class="col-1">
                        <span class="text-weight-medium"> = </span>
                      </div>
                      <div class="col-1">
                        <span class="text-weight-medium"> = </span>
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
              </transition-group>
            </q-list>
          </q-card-section>
          <q-card-section style="padding: 0" class="full-height">
            <q-scroll-area style="height: calc(100% - 32px)">
              <q-list separator>
                <transition-group>
                  <q-item v-for="(item, n) in store.rinci" :key="n" class="list-move">
                    <q-item-section>
                      <div class="row full-width">
                        <div class="col-12">
                          <span class="text-weight-medium">{{ item }}</span>
                          <span class="text-grey-8"> ({{ item?.kdbarang }})</span>
                        </div>
                        <div class="col-2">
                          <span class="text-weight-medium"> {{ item?.jumlahpo }}</span>
                        </div>
                        <div class="col-1">
                          <span> X </span>
                        </div>
                        <div class="col-3">
                          <span class="text-weight-medium">
                            {{ formatRpDouble(item?.hargapo) }}</span
                          >
                        </div>
                        <div class="col-1">
                          <span class="text-weight-medium"> = </span>
                        </div>
                        <div class="col-5">
                          <span class="text-weight-medium">
                            {{ formatRpDouble(item?.subtotal) }}</span
                          >
                        </div>
                      </div>
                    </q-item-section>
                    <q-item-section top side>
                      <div class="text-grey-8">
                        <q-btn
                          class="gt-xs"
                          size="12px"
                          flat
                          dense
                          round
                          icon="delete"
                          @click="hapusrincian(item?.id, data?.noorder)"
                        />
                      </div>
                    </q-item-section>
                  </q-item>
                </transition-group>
              </q-list>
            </q-scroll-area>
          </q-card-section>
        </q-form>
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

// const lists = computed(() => {
//   const arr = store?.rinci
//   console.log('sasasasa', arr)
//   return arr?.sort((a, b) => {
//     return b.id - a.id
//   })
// })

// const props = defineProps({
//   data: {
//     type: Object,
//     default: null,
//   },
// })
</script>
