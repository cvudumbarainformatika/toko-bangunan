<template>
  <div class="fit column">
    <div class="col-auto">
      <div class="row items-center q-pa-lg">
        <div class="col-grow">
          <app-btn-back @click="emits('back')" />
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
              <div :class="`col-${isMobile ? 12 : 6}`" class="row q-col-gutter-md">
                <!-- <app-input
                  class="col-12"
                  v-model="store.form.namabarang"
                  label="Nama Barang"
                  :valid="{ required: false }"
                /> -->
                <div class="col-12 text-center">
                  NO. ORDER : 00001-01-2024-OR
                  <app-btn
                    class="1"
                    icon="add"
                    tooltip="Tambah Data"
                    color="primary"
                    @click="store.fixed = true"
                  />
                </div>
                <app-input class="col-6" v-model="store.form.tglorder" label="Tanggal Order" />
                <app-input class="col-6" v-model="store.form.supplier" label="Supplier" />
              </div>
            </div>
            <q-separator class="q-my-md" />
            <div class="row q-col-gutter-md justify-around">
              <div class="col-12">
                <q-list bordered class="rounded-borders">
                  <q-item>
                    <q-item-section top>
                      <q-item-label lines="1">
                        <span class="text-weight-medium">[quasarframework/quasar]</span>
                        <span class="text-grey-8"> - GitHub repository</span>
                      </q-item-label>
                      <q-item-label caption lines="1">
                        @rstoenescu in #3: > Generic type parameter for props
                      </q-item-label>
                      <q-item-label
                        lines="1"
                        class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase"
                      >
                        <span class="cursor-pointer">Open in GitHub</span>
                      </q-item-label>
                    </q-item-section>

                    <q-item-section top side>
                      <div class="text-grey-8 q-gutter-xs">
                        <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />
                        <q-btn class="gt-xs" size="12px" flat dense round icon="done" />
                        <q-btn size="12px" flat dense round icon="more_vert" />
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
            <div class="row q-col-gutter-md justify-around">
              <div class="col-12">
                <q-list bordered class="rounded-borders">
                  <q-item>
                    <q-item-section top>
                      <q-item-label lines="1">
                        <span class="text-weight-medium">[quasarframework/quasar]</span>
                        <span class="text-grey-8"> - GitHub repository</span>
                      </q-item-label>
                      <q-item-label caption lines="1">
                        @rstoenescu in #3: > Generic type parameter for props
                      </q-item-label>
                      <q-item-label
                        lines="1"
                        class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase"
                      >
                        <span class="cursor-pointer">Open in GitHub</span>
                      </q-item-label>
                    </q-item-section>

                    <q-item-section top side>
                      <div class="text-grey-8 q-gutter-xs">
                        <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />
                        <q-btn class="gt-xs" size="12px" flat dense round icon="done" />
                        <q-btn size="12px" flat dense round icon="more_vert" />
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </div>
  <dialog-rinci-page />
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useAdminFormTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/form'
import DialogRinciPage from './DialogRinciPage.vue'
import { computed } from 'vue'

const store = useAdminFormTransaksiOrderBarangStore()

const $q = useQuasar()
const isMobile = computed(() => {
  return $q.screen.lt.sm // Quasar screen size helper
})
function onSubmit() {
  // console.log('submit form barang');

  store.save()
}
</script>
