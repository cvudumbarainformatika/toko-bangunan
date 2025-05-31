<template>
  <q-dialog persistent backdrop-filter="blur(4px)">

    <q-card flat round class="q-px-md fit column rounded-borders" style="min-width: 90vw; max-width: 90vw; min-height: 90vh; max-height:90vh;">
      <q-card-section class="col-auto q-pb-sm q-px-sm">
        <div class="flex items-center justify-between">
          <div class="text-weight-bold">Order Penjualan # {{ props.order?.noorder }}</div>
          <q-btn v-close-popup icon="close" flat round size="md" style="margin-right: -10px;"></q-btn>
        </div>
      </q-card-section>
      <q-card-section class="col full-height q-pa-none rounded-borders" :class="`${$q.dark.isActive ? 'bg-black': 'bg-grey-4'}`" style="border-radius: 10px;">
        <div class="column full-height">
          <div class="col-auto">
            <div class="flex justify-between items-center rounded-borders shadow-sm q-px-md q-pb-md q-pt-md">
              <div><app-btn color="negative" label="Batalkan Order" /></div>
              <!-- <app-btn-edit-list /> -->
              <div class="flex items-center q-gutter-sm">
                <div><app-btn label="Lanjutkan Status" /></div>
              </div>
            </div> 
            <q-separator></q-separator>
            <q-stepper
              v-model="step"
              ref="stepper"
              alternative-labels
              animated
              flat
              done-color="primary"
              active-color="teal"
              inactive-color="gray"
              :class="`${$q.dark.isActive ? 'bg-black': 'bg-grey-4'}`"
            >
              <q-step
                :name="1"
                title="DRAFT"
                icon="settings"
                :done="step > 1"
              >
              </q-step>

              <q-step
                :name="2"
                title="SETUJUI"
                caption="Dan Tunggu Pembayaran"
                icon="create_new_folder"
                :done="step > 2"
              >
              </q-step>

              <q-step
                :name="3"
                title="DIKIRIM"
                icon="assignment"
              >
              </q-step>

              <q-step
                :name="4"
                title="SELESAI"
                icon="add_comment"
              >
              </q-step>

              <!-- <template v-slot:navigation>
                <q-stepper-navigation>
                  <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 4 ? 'Finish' : 'Continue'" />
                  <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
                </q-stepper-navigation>
              </template> -->
            </q-stepper>

            <!-- INFO ORDER -->
            <div class="row full-width q-pa-md" style="max-width: 100%; margin-top: -50px; margin-bottom: -40px;">
              <div class="col-12 row q-col-gutter-sm">
              <div class="col-4 ">
                <q-card flat class="full-height">
                  <q-card-section>
                    <div class="text-body text-weight-bold"> Data Pelanggan</div>
                    <q-separator class="q-my-sm"></q-separator>
                    <div class="flex q-gutter-sm items-center">
                      <q-icon name="person_2" size="16px"> </q-icon>
                      <div>{{ order?.pelanggan?.nama }} </div>
                    </div>
                    <!-- <div class="flex q-gutter-sm items-center">
                      <q-icon name="place" size="16px"> </q-icon>
                      <div>{{ order?.pelanggan?.alamat || '-' }} </div>
                    </div> -->
                    <div class="flex q-gutter-sm items-center">
                      <q-icon name="phone" size="16px"> </q-icon>
                      <div>{{ order?.pelanggan?.telepon || '-' }} </div>
                    </div>
                    <div class="flex q-gutter-sm items-center">
                      <q-icon name="credit_card" size="16px"> </q-icon>
                      <div>{{ order?.pelanggan?.norek }} - {{ order?.pelanggan?.namabank }} </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-4">
                <q-card flat class="full-height column">
                  <q-card-section class="">
                    <div class="flex q-gutter-sm items-center">
                      <q-icon name="add_shopping_cart" size="20px"> </q-icon>
                      <div class="text-body text-weight-bold">Informasi Order </div>
                    </div>
                    <q-separator class="q-my-sm"></q-separator>
                    <div class="flex q-gutter-sm items-center q-mb-sm">
                      <div>Dari Sales : </div>
                      <div>{{ order?.sales?.nama || '-' }} </div>
                    </div>
                    <div class="flex q-gutter-sm items-center q-mb-sm">
                      <q-icon name="watch" size="16px"> </q-icon>
                      <div>{{ order?.tglorder || '-' }} </div>
                    </div>
                    <div class="flex q-gutter-sm items-center">
                      <q-icon name="credit_card" size="16px"> </q-icon>
                      <div>{{ order?.metode_bayar }}  </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-4">
                <q-card flat class="full-height">
                  <q-card-section>
                    <div class="flex q-gutter-sm items-center">
                      <q-icon name="paid" size="22px"> </q-icon>
                      <div class="text-body text-weight-bold">Summary Order </div>
                    </div>
                    
                  <q-separator class="q-my-sm"></q-separator>
                  </q-card-section>
                  <q-card-section class="" :class="`${$q.dark.isActive ? 'bg-black': 'bg-grey-4'} q-ma-md`" style="margin-top: -10px;">
                    <div class="text-center text-h5 text-weight-bold">
                      {{ formatRp(order?.total_harga) }}
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
            </div>

          </div>
          <q-card flat class="col full-height q-pa-md">
            <q-list bordered padding class="column full-height">
              <q-item class="col-auto">
                <q-item-section>
                  <q-item-label overline>DAFTAR ITEM</q-item-label>
                  <q-item-label caption>Item dapat di batalkan jika Status Order masih dalam status <b>DRAFT</b></q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-item-label caption>
                    {{ order.rincians?.length }} ITEM
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator spaced />
              <div class="col full-height scroll">
                <template v-for="(item, n) in order?.rincians" :key="n">
                  <q-item clickable
                    @mouseover="hoveredId = item?.id"
                    @mouseleave="hoveredId = null"
                    :class="{ 'bg-grey-8 text-white': hoveredId === item?.id }"
                  >
                    <q-item-section avatar>
                      <q-avatar>
                        <q-img src="/images/No-Image.svg" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label overline class="text-weight-bold">{{ item?.barang?.namabarang }}</q-item-label>
                      <q-item-label >{{ formatRp(item?.harga) }} x {{ item?.jumlah }} 
                        <span class="text-grey">( {{ item?.barang?.satuan_k || 'Satuan Kecil' }} )</span>

                      </q-item-label>
                      <q-item-label >
                        <span class="text-grey">
                          Pemesanan Aktual Dalam Satuan {{ item.satuan || '-'}}
                        </span>

                      </q-item-label>
                    </q-item-section>
                    <q-item-section v-if="hoveredId === item?.id" side>
                      <div class="flex q-gutter-sm">
                        <app-btn-edit-list @click="edit(item)" />
                        <app-btn-delete-list @click="del(item)" />
                      </div>
                    </q-item-section>
                    <q-item-section v-else side>
                      <q-item-label>
                        <div class="text-weight-bold text-body1">
                          Rp {{ formatRp(parseInt(item?.harga || 0) * parseInt(item?.jumlah || 0) || 0) }}
                        </div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator></q-separator>
                </template>
                  <div style="margin-bottom: 100px;"></div>
              </div>
            </q-list>
            <!-- <div style="margin-bottom: 200px;"></div> -->
          </q-card>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar'
import {ref} from 'vue'
import { formatRp } from 'src/modules/formatter'

const props = defineProps({
  order:{
    type:Object,
    default:null
  }
})

const $q = useQuasar()
const step = ref(1)
const stepper = ref(null)
const hoveredId = ref(null)

// console.log('order', props.order);
function edit(item){
  console.log('edit', item);
  
}
function del(item){
  console.log('delete', item);
  
}

</script>

<style scoped>
</style>