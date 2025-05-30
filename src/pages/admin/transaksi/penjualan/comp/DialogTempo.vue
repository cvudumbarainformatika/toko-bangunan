<template>
<q-dialog maximized persistent>
  <q-card flat >
    <div class="fit column">
      <div class="col-auto">
          <div class="row items-center q-pa-lg">
            <div class="col-grow">
              <app-btn-back @click="store.openDialogTempo = false" />
            </div>
            <div class="col-auto">
              <!-- <app-btn :dense="false" label="Simpan" color="primary" /> -->
            </div>
          </div>
        </div>
        <div class="col full-height q-px-lg q-pb-lg">
          <q-card flat class="col full-height">
            <q-form class="full-height" @submit="onSubmit">
              <q-card-section class="full-height q-pa-lg scroll">
                <div class="row q-col-gutter-md justify-around">
                  <div :class="`col-${isMobile ? 12 : 6}`" class="row q-col-gutter-md items-center">
                    <div class="col-12 f-16 text-center">Form Tanggal Jatuh Tempo</div>
                    <div class="col-12 f-12 text-center">No penjualan {{ store?.item?.no_penjualan }} Tgl {{dateFullFormat( store.item?.tgl)}}</div>
                    <div class="col-12 f-10 text-center">Tanggal Jatuh tempo terisi sama dengan barang dikirm</div>
                    <app-input-date
                      :model="store.dispTempo"
                      class="col-12"
                      label="Tanggal Jatuh Tempo"
                      outlined
                      dense
                      @set-display="store.dispTempo = $event"
                      @db-model="store.formTempo.tempo = $event"
                    />

                    <div class="col-12">
                      <q-separator class="q-my-md" />
                      <app-btn
                        :loading="store.loadingTempo"
                        :disable="store.loadingTempo"
                        type="submit"
                        :dense="false"
                        label="Simpan"
                        color="grey-10"
                        class="text-yellow-9"
                      />
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-form>
          </q-card>
        </div>
    </div>
  </q-card>
</q-dialog>
</template>
<script setup>
import { useQuasar } from 'quasar'
import { dateFullFormat } from 'src/modules/formatter'
import { useFromPenjualanStore } from 'src/stores/admin/transaksi/penjualan/form'
import { computed } from 'vue'

const store = useFromPenjualanStore()
const $q = useQuasar()
const isMobile = computed(() => {
  return $q.screen.lt.sm // Quasar screen size helper
})

function onSubmit(){
  console.log('submit tempo', store.formTempo);
  store.simpanTempo()
}
</script>
