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
                <div class="col-12 text-center text-h5">FORM ORDER</div>
                <app-input class="col-5" v-model="store.form.noorder" label="No. Order" disable />
                <app-select
                  class="col-6"
                  v-model="store.form.kdsuplier"
                  label="Supplier"
                  :options="storesuplier.itemsall"
                  option-label="nama"
                  option-value="kodesupl"
                />
                <div class="col-1" align="right">
                  <app-btn
                    class="col-1"
                    icon="add"
                    tooltip="Tambah Data"
                    color="primary"
                    type="submit"
                  />
                </div>
              </div>
            </div>
            <q-separator class="q-my-md" />

            <div class="q-pa-md full-width">
              <q-list v-for="(item, n) in lists" :key="n">
                <q-item>
                  <q-item-section>
                    <q-item-label lines="1">
                      <span class="text-weight-medium">- {{ item?.mbarang?.namabarang }}</span>
                      <span class="text-grey-8"> ({{ item?.kdbarang }})</span>
                    </q-item-label>
                    <q-item-label
                      caption
                      lines="2"
                      class="q-mt-xs text-body2 text-weight-bold text-primary"
                    >
                      {{ item?.jumlahpo }} x {{ formatRpDouble(item?.hargapo) }} =
                      {{ formatRpDouble(item?.subtotal) }}</q-item-label
                    >
                  </q-item-section>

                  <q-item-section side top>
                    <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />
                  </q-item-section>
                </q-item>
                <q-separator spaced inset />
              </q-list>
            </div>
            <div class="q-pa-md full-width">
              <div class="text-right">
                <span class="text-red">Total : </span>
                <q-badge outline color="red">
                  {{ formatRpDouble(props?.data?.total) }}
                </q-badge>
              </div>
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </div>

  <dialog-rinci-page :data="props.data" />
</template>
<script setup>
import { useQuasar } from 'quasar'
import { useAdminFormTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/form'
import DialogRinciPage from './DialogRinciPage.vue'
import { computed, onMounted } from 'vue'
import AppSelect from 'src/components/~global/AppSelect.vue'
import { useAdminMasterSupplierStore } from 'src/stores/admin/master/supplier/list'
import { formatRpDouble } from 'src/modules/utils'

const store = useAdminFormTransaksiOrderBarangStore()
const emits = defineEmits(['back'])

const $q = useQuasar()
const isMobile = computed(() => {
  return $q.screen.lt.sm // Quasar screen size helper
})
function onSubmit() {
  store.fixed = true
}

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})

const lists = computed(() => {
  const arr = props.data?.rinci
  return arr?.sort((a, b) => {
    return b.id - a.id
  })
})

onMounted(() => {
  store.initReset(props.data)
})

const storesuplier = useAdminMasterSupplierStore()
</script>
