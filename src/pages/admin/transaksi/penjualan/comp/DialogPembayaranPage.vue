<template>
  <q-dialog maximized persistent>
    <q-card flat>
      <div class="fit column">
        <div class="col-auto">
        <div class="row items-center q-pa-lg">
          <div class="col-grow">
            <app-btn-back @click="store.openPembayaran=false" />
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
                <div class="row q-col-gutter-md justify-around ">
                  <div :class="`col-${isMobile ? 12 : 6}`" class="row q-col-gutter-md items-center">
                    <div v-if="store?.item!=null" class="col-12 q-py-md">
                      <div class="row justify-between f-16">
                        <div class="col-auto text-weight-bold">Total Nota Nomor : {{ store.formPembayaran.no_penjualan }}</div>
                        <div class="col-auto text-weight-bold text-right f-20">{{store?.item?.total}}</div>
                      </div>
                    </div>

                    <app-select
                    class="col-12"
                    v-model="store.formPembayaran.cara_bayar"
                    label="Pilih Cara Bayar"
                    :options="optionCaraBayar"
                    option-label="label"
                    option-value="value"
                    @update:model-value="selectCaraBayar"
                    :disable="store.loadingPembayaran || !store?.item?.sales_id "
                    />
                    <app-select-server
                      ref="refPelanggan"
                      class="col-12"
                      v-model="store.formPembayaran.pelanggan_id"
                      url="v1/transaksi/penjualan/list-pelanggan"
                      option-value="id"
                      :option-label="opt=> opt.nama + ' ' + opt?.alamat"
                      label="Cari Pelanggan"
                      :filter-min="3"
                      clearable
                      :rules="[val=>(store.formPembayaran.cara_bayar == '2' ? !!val:true) || 'Harap di isi']"
                      :disable="store.loadingPembayaran"
                    />
                    <template v-if="store.formPembayaran.cara_bayar=='5'">
                      <app-input
                      ref="refBayar"
                      class="col-6"
                      v-model="store.formPembayaran.bayar"
                      label="Bayar"
                      :rules="[val=> parseInt(val)>=store.formPembayaran.total || 'nominal pembayaran kurang']"
                      @update:model-value="updateBayar"
                      :disable="store.loadingPembayaran"
                    />
                    <div class="col-3" :class="parseInt(store.formPembayaran.total)>parseInt(store.formPembayaran.bayar)?'text-negative':''">
                      {{ store.formPembayaran.kembali }}
                    </div>
                    <div v-if="parseInt(store.formPembayaran.total)>parseInt(store.formPembayaran.bayar)" class="col-3 text-negative"> Kurang bayar</div>


                    </template>



                    <div class="col-12">
                    <q-separator class="q-my-md" />
                    <app-btn
                      :loading="store.loadingPembayaran"
                      :disable="store.loadingPembayaran"
                      type="submit"
                      :dense="false"
                      label="Simpan"
                      color="primary"
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
import { useFromPenjualanStore } from 'src/stores/admin/transaksi/penjualan/form'
import { computed, ref } from 'vue'

const $q = useQuasar()
const isMobile = computed(() => {
  return $q.screen.lt.sm // Quasar screen size helper
})
const store=useFromPenjualanStore()

const optionCaraBayar=ref([
  {label:'Tunai',value:'5'},
  {label:'Kredit',value:'2'},
])
const refPelanggan=ref(null)
function onSubmit() {
  console.log('submit form pembayaran',refPelanggan.value, store.formPembayaran);
  store.simpanPembayaran()
}
function selectCaraBayar(val){
  console.log('cara bayar', val);
  if(val=='2') {
    store.formPembayaran.bayar=0
    store.formPembayaran.kembali=0
  }

}
const refBayar=ref(null)
function updateBayar(val){
  // console.log('upda ba', val,refBayar.value?.appInput.validate());

  //untuk hapus o dipean angka pake ini yaa
  const _removedZeros = val?.replace(/^0+/, '')
  if (val > 1) {
    store.formPembayaran.bayar = _removedZeros
    store.formPembayaran.kembali=store.formPembayaran.bayar-store.formPembayaran.total
  }
  setTimeout(()=>{
    refBayar.value?.appInput.validate()

  },100)


}
</script>
