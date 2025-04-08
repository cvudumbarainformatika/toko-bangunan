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
                        <div class="col-auto text-weight-bold text-right f-20">
                          <div class="row justify-end">{{formatDouble(store?.item?.total)}}</div>
                          <div v-if="store?.item?.total_diskon>0" class="row justify-end">{{formatDouble(store?.item?.total_diskon)}}</div>
                          <div v-if="store?.item?.total_diskon>0" class="row justify-end">{{formatDouble(store?.item?.total-store?.item?.total_diskon)}}</div>
                        </div>
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
                    <template v-if="store.formPembayaran.cara_bayar=='5'" >
                      <app-input-rp
                      ref="refBayar"
                      class="col-6"
                      v-model="store.formPembayaran.bayar"
                      outlined
                      currency
                      label="Bayar"
                      :rules="[val=> parseInt(olahUang(val))>=(parseInt(store.formPembayaran.total) - store.formPembayaran?.total_diskon) || 'nominal pembayaran kurang']"
                      @update:model-value="updateBayar"
                      :disable="store.loadingPembayaran"
                    />
                    <div class="col-3" :class="(parseInt((parseInt(store.formPembayaran.total)-store.formPembayaran?.total_diskon))>parseInt(olahUang(store.formPembayaran.bayar))) || !parseInt(olahUang(store.formPembayaran?.bayar))?'text-negative':''">
                      {{ formatDouble(store.formPembayaran.kembali) }}
                    </div>
                    <div v-if="(parseInt((parseInt(store.formPembayaran.total) - store.formPembayaran?.total_diskon)) > parseInt(olahUang(store.formPembayaran.bayar))) " class="col-3 text-negative text-center"> Kurang bayar</div>


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
import { formatDouble, olahUang } from 'src/modules/formatter'
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
  const _removedZeros = val?.replace(/^0+/, '')
  const normalAngka=olahUang(_removedZeros)
  //untuk hapus o dipean angka pake ini yaa
  if (normalAngka > 1) {
    // store.formPembayaran.bayar = normalAngka
    store.formPembayaran.kembali = parseInt(normalAngka) - (store.formPembayaran.total - store?.formPembayaran?.total_diskon)
  }
  setTimeout(()=>{
    refBayar.value?.appInput.validate()

  },100)


}
</script>
