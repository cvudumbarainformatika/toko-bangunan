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
                <div>
                  Pilih Kategori :
                  <q-radio
                    class="q-pl-sm q-pr-lg"
                    v-for="item in store.pilihkategori"
                    :key="item"
                    v-model="store.form.kategori"
                    :label="item.keterangan"
                    :val="item.keterangan"
                    dense
                    size="sm"
                  ></q-radio>
                </div>

                <template v-if="store.form.kategori">
                  <app-input
                    class="col-12"
                    v-model="store.form.namabarang"
                    label="Nama Barang"
                    :valid="{ required: false }"
                  />
                  <!-- <app-input
                  class="col-6"
                  v-model="store.form.brand"
                  label="Brand"
                  :rules="
                    store.form.kategori === 'Keramik'
                      ? [(val) => !!val || 'Brand/Merek Wajib Diisi!']
                      : []
                  "
                /> -->
                  <app-select
                    class="col-6"
                    v-model="store.form.brand"
                    label="Brand/Merek"
                    :options="selectBrand?.items"
                    option-label="brand"
                    option-value="brand"
                    :valid="{ required: store.form.kategori !== 'Keramik' }"
                  />
                  <app-input
                    class="col-6"
                    v-model="store.form.kualitas"
                    label="Kualitas"
                    :valid="{ required: store.form.kategori !== 'Keramik' }"
                  />
                  <app-input
                    class="col-6"
                    v-model="store.form.seri"
                    label="Seri"
                    :valid="{ required: store.form.kategori !== 'Keramik' }"
                  />
                  <app-input
                    class="col-6"
                    v-model="store.form.ukuran"
                    label="Ukuran"
                    :valid="{ required: store.form.kategori !== 'Keramik' }"
                  />

                  <app-select
                    class="col-4"
                    v-model="store.form.satuan_b"
                    label="Satuan Bsr"
                    :options="selectSatuan.items"
                    option-label="satuan"
                    option-value="satuan"
                    :valid="{ required: store.form.kategori !== 'Keramik' }"
                  />

                  <app-input
                    class="col-4"
                    v-model="store.form.isi"
                    label="Isi Barang"
                    :valid="{ number: true }"
                    @update:model-value="
                      (val) => {
                        //untuk hapus o dipean angka pake ini yaa
                        const _removedZeros = val?.replace(/^0+/, '')
                        if (val > 1) store.form.isi = _removedZeros
                      }
                    "
                  />
                  <app-select
                    class="col-4"
                    v-model="store.form.satuan_k"
                    label="Satuan Kcl"
                    :options="selectSatuan.items"
                    option-label="satuan"
                    option-value="satuan"
                    :valid="{ required: store.form.kategori !== 'Keramik' }"
                  />
                  <!-- <app-select-server
                  class="col-4"
                  v-model="store.form.satuan_k"
                  label="Satuan Kcl"
                  option-label="satuan"
                  option-value="satuan"
                  url="v1/master/select/master-satuan-filter"
                  filter-by="satuan"
                  :filter-min="2"
                /> -->

                  <app-input
                    class="col-6"
                    v-model="store.form.hargajual1"
                    label="Harga Jual 1"
                    :valid="{ number: true }"
                    @update:model-value="
                      (val) => {
                        //untuk hapus o dipean angka pake ini yaa
                        const _removedZeros = val?.replace(/^0+/, '')
                        if (val > 1) store.form.hargajual1 = _removedZeros
                      }
                    "
                  />
                  <app-input
                    class="col-6"
                    v-model="store.form.hargajual2"
                    label="Harga Jual 2"
                    :valid="{ number: true }"
                    @update:model-value="
                      (val) => {
                        //untuk hapus o dipean angka pake ini yaa
                        const _removedZeros = val?.replace(/^0+/, '')
                        if (val > 1) store.form.hargajual2 = _removedZeros
                      }
                    "
                  />
                  <div class="col-12">
                    <q-separator class="q-my-md" />
                    <app-btn
                      :loading="store.loading"
                      type="submit"
                      :dense="false"
                      label="Simpan"
                      color="primary"
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="col-12">
                    <q-separator></q-separator>
                    <div class="text-center q-pt-md" style="font-size: x-large">
                      Silahkan Pilih Kategori Dulu
                    </div>
                  </div>
                </template>
              </div>
              <!-- <div :class="`col-${isMobile ? 12 : 6}`" class="row q-col-gutter-md">
                <div>
                  <app-btn type="submit" :dense="false" label="Simpan" color="primary" />
                </div>
              </div> -->
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useAdminFormMasterBarangStore } from 'src/stores/admin/master/barang/form'
import { useAdminMasterBrandSelectStore } from 'src/stores/admin/master/brand/select'
import { useAdminMasterSatuanSelectStore } from 'src/stores/admin/master/satuan/select'
import { computed, onMounted } from 'vue'

const emits = defineEmits(['back'])
const $q = useQuasar()
const isMobile = computed(() => {
  return $q.screen.lt.sm // Quasar screen size helper
})

const store = useAdminFormMasterBarangStore()
const selectSatuan = useAdminMasterSatuanSelectStore()
const selectBrand = useAdminMasterBrandSelectStore()

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
})

onMounted(() => {
  store.initReset(props.data)
})

function onSubmit() {
  // console.log('submit form barang');

  store.save(props.data)
}
</script>
