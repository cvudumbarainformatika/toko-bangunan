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
                <app-input label="No. order" disable />
              </div>
              <div class="col-1">
                <q-btn round color="primary" icon="find_in_page" @click="cariorderan()" />
              </div>
              <div class="col-6">
                <app-input label="Supllier" disable />
              </div>
            </div>
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

// // import { formatRpDouble } from 'src/modules/formatter'
// import { useAdminListTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/list'

// import AppSelectServer from 'src/components/~global/AppSelectServer.vue'
// import { useAdminFormTransaksiPenerimaanBarangStore } from 'src/stores/admin/transaksi/penerimaan/form'

// const store = useAdminFormTransaksiPenerimaanBarangStore()
const storeorder = useAdminListTransaksiOrderBarangStore()
const emits = defineEmits(['back'])

function cariorderan() {
  storeorder.fixed = true
}

// const props = defineProps({
//   data: {
//     type: Object,
//     default: null,
//   },
// })
</script>
