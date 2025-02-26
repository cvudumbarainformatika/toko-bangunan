<template>
  <div class="fit column absolute">
    <div class="col full-height">
      <q-card flat bordered square class="full-height" style="overflow: hidden">
        <q-form ref="refForm" @submit="onSubmit" class="column full-height">
          <q-card-section class="q-px-md q-py-xs bg-primary text-white col-auto full-width">
            <div class="row items-center justify-between">
              <div class="f-12 text-weight-bold">
                <app-btn-back size="sm" @click="emits('back')" class="bg-dark" />
                Form Order
              </div>
              <!-- <div>
                <q-btn flat dense size="sm" icon="key" @click="historyOpen">
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
                <app-input v-model="store.form.noorder" label="No. Orderan" disable />
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
              <div v-if="data?.flaging === null || data?.flaging === ''">
                <q-btn
                  flat
                  color="red"
                  size="sm"
                  icon="lock_open"
                  @click="kuncitrans('1')"
                  :loading="store.lock"
                >
                  <q-tooltip class="bg-teal text-white"> KUNCI TRANSAKSI </q-tooltip>
                </q-btn>
              </div>
              <div v-else>
                <q-btn
                  flat
                  size="sm"
                  color="red"
                  icon="lock"
                  @click="kuncitrans()"
                  :loading="store.lock"
                >
                  <q-tooltip class="bg-teal text-white"> BUKA KUNCI TRANSAKSI </q-tooltip>
                </q-btn>
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

function kuncitrans(val) {
  store.kunci(val, props?.data?.noorder)
}
</script>
