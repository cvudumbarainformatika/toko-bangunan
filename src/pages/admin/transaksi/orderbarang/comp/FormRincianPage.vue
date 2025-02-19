<template>
  <div class="fit column absolute">
    <div class="col full-height">
      <q-card flat bordered square class="full-height" style="overflow: hidden">
        <app-btn-back @click="emits('back')" class="bg-dark" />
        <q-form ref="refForm" @submit="onSubmit" class="column full-height">
          <q-card-section class="q-px-md q-py-xs bg-primary text-white col-auto full-width">
            <div class="row items-center justify-between">
              <div class="f-12 text-weight-bold">Form Order</div>
              <!-- <div>
                <q-btn flat dense size="md" icon="icon-mat-history" @click="historyOpen">
                  <q-tooltip class="bg-dark text-white">
                    {{ tooltip }}
                  </q-tooltip>
                </q-btn>
              </div> -->
            </div>
          </q-card-section>
          <q-card-section style="max-height: 50vh" class="scroll">
            <div class="row q-gutter-sm">
              <div class="col-11"></div>
              <div class="col-6">
                <app-input v-model="store.form.noorder" label="No. Orderan" />
              </div>
              <div class="col-5">
                <app-select
                  label="Supplier"
                  v-model="store.form.kdsuplier"
                  :options="storesupllier.itemsall"
                  option-label="nama"
                  option-value="kodesupl"
                />
              </div>
            </div>
            <q-separator class="q-my-md" />
            <div class="row q-gutter-sm">
              <div class="col-6">
                <AppSelectServer
                  v-model="store.form.namabarang"
                  label="Nama Barang"
                  emit-value
                  option-label="namabarang"
                  filter-by="namabarang"
                  url="v1/master/select/master-barang-filter"
                  :filter-min="1"
                  :limit="25"
                  @update:model-value="(val) => isiform(val)"
                  clearable
                  valid
                />
              </div>
              <div class="col-5">
                <app-input
                  v-model="store.form.merk"
                  label="Merk"
                  :valid="{ required: false }"
                  disable
                />
              </div>
              <div class="col-6">
                <app-input
                  v-model="store.form.brand"
                  label="Brand"
                  :valid="{ required: false }"
                  disable
                />
              </div>
              <div class="col-5">
                <app-input
                  v-model="store.form.seri"
                  label="Seri"
                  :valid="{ required: false }"
                  disable
                />
              </div>
              <div class="col-6">
                <app-input
                  v-model="store.form.satuan_b"
                  label="Satuan Besar"
                  :valid="{ required: false }"
                  disable
                />
              </div>
              <div class="col-5">
                <app-input
                  v-model="store.form.satuan_k"
                  label="Satuan Kecil"
                  :valid="{ required: false }"
                  disable
                />
              </div>
              <div class="col-6">
                <app-input
                  v-model="store.form.isi"
                  label="Isi"
                  :valid="{ required: false }"
                  disable
                />
              </div>
              <div class="col-5">
                <app-input
                  v-model="store.form.jumlah"
                  label="Jumlah Yang Di Pesan"
                  :valid="{ required: false }"
                  type="number"
                />
              </div>
              <div class="col-6">
                <app-input
                  class="col-6"
                  v-model="store.form.harga"
                  label="Harga Beli"
                  :valid="{ required: false }"
                  type="number"
                />
              </div>
              <div class="col-12">
                <q-separator class="q-my-md" />
                <app-btn
                  :loading="store.loading"
                  type="submit"
                  :dense="false"
                  label="Simpan"
                  color="teal"
                />
              </div>
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import AppSelectServer from 'src/components/~global/AppSelectServer.vue'
import { useAdminMasterSupplierStore } from 'src/stores/admin/master/supplier/list'
import { useAdminFormTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/form'

const storesupllier = useAdminMasterSupplierStore()
const store = useAdminFormTransaksiOrderBarangStore()

const emits = defineEmits(['back'])

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})

store.form.noorder = props?.data?.noorder
store.form.kdsuplier = props?.data?.kdsuplier

function isiform(val) {
  store.form.kdbarang = val?.kodebarang ?? '-'
  store.form.namabarang = val?.namabarang ?? '-'
  store.form.merk = val?.merk ?? '-'
  store.form.brand = val?.brand ?? '-'
  store.form.seri = val?.seri ?? '-'
  store.form.satuan_b = val?.satuan_b ?? '-'
  store.form.satuan_k = val?.satuan_k ?? '-'
  store.form.isi = val?.isi ?? '-'
}

function onSubmit() {
  console.log('submit form barang')
  store.save(props.data)
}
</script>
