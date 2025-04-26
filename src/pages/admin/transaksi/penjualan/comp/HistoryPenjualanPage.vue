<template>
  <div class="column fit">
    <div class="col full-height">
      <div class="full-height q-pa-sm">
        <q-list class="rounded-borders full-height column">
          <div class="col-auto">
            <q-item-label header>
              <div class="row full-width items-center">
                <div class="col-grow">
                  <app-btn-back @click="emits('back')" />
                </div>
                <div class="col-auto">
                  <div class="flex items-center q-col-gutter-x-xs">
                    <app-input-date
                      :model="store.dateDisplay.from"
                      label="Dari"
                      style="min-width: 150px"
                      outlined
                      :debounce="300"
                      @set-model="
                        (val) => {
                          store.dateDisplay.from = val
                        }
                      "
                      @db-model="
                        (val) => {
                          store.params.from = val
                        }
                      "
                    />
                    <app-input-date
                      :model="store.dateDisplay.to"
                      label="Sampai"
                      style="min-width: 150px"
                      outlined
                      :debounce="300"
                      @set-model="
                        (val) => {
                          store.dateDisplay.to = val
                        }
                      "
                      @db-model="
                        (val) => {
                          store.params.to = val
                        }
                      "
                    />
                    <app-input
                      v-model="store.params.q"
                      prepend-icon="search"
                      label="Telusuri"
                      style="min-width: 250px"
                      :debounce="300"
                      @update:model-value="
                        (e) => {
                          infiniteScroll.reset()
                          store.getList()
                        }
                      "
                    />

                    <q-btn
                      round
                      icon="refresh"
                      dense
                      @click="
                        () => {
                          store.getList()
                        }
                      "
                    >
                      <q-tooltip>Rerfresh</q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </div>
            </q-item-label>
            <q-separator />
          </div>

          <div ref="scrollTarget" class="col full-height scroll">
            <q-infinite-scroll
              @load="store.loadMore"
              ref="infiniteScroll"
              :disable="store?.isError || store?.meta?.next_page_url === null"
              :scroll-target="scrollTarget"
              :offset="150"
              :initial-index="store.params.page"
            >
              <q-intersection v-for="(item, i) in store.items" :key="i" transition="fade">
                <q-expansion-item
                  v-model="item.expand"
                  clickable
                  v-ripple
                  @mouseover="hoveredId = item?.id"
                  @mouseleave="hoveredId = null"
                  :class="{ 'bg-grey-8 text-white': hoveredId === item?.id }"
                >
                  <template v-slot:header>
                    <q-item-section>
                      <q-item-label lines="1">
                        <div class="row">
                          <div class="col-3">{{ item?.no_penjualan }}</div>
                          <div class="col-2 q-ml-sm">{{ formatDouble(item?.total) }}</div>
                          <div class="col-2 q-ml-sm">{{ formatDouble(item?.total_diskon) }}</div>
                          <div class="col-2 q-ml-sm">{{ statusFlag(item?.flag) }}</div>
                        </div>
                      </q-item-label>
                      <q-item-label lines="1">
                        <div class="row">
                          <div class="col-3 text-weight-bold">
                            <span v-if="item?.pelanggan">Pelanggan:</span>
                            {{ item?.pelanggan?.nama }}
                          </div>
                          <div v-if="item?.sales" class="col-2 q-ml-sm">
                            Sales : {{ item?.sales?.nama }}
                          </div>
                        </div>
                        <div class="row" v-if="item?.keterangan">
                          <div class="col-3 text-weight-bold">
                            {{ item?.keterangan?.nama }}
                          </div>
                          <div class="col-2 q-ml-sm">
                            {{ item?.keterangan?.tlp }}
                          </div>
                          <div class="col-5 q-ml-sm">
                            {{ item?.keterangan?.alamat }}
                          </div>
                        </div>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section v-if="hoveredId === item?.id" side>
                      <div class="flex q-gutter-sm">
                        <app-btn
                          v-if="item?.flag == null || item?.flag == '1'"
                          icon="input"
                          color="orange"
                          tooltip="Gunakan Nomor Penjualan"
                          @click="emits('useNota', item)"
                        />
                        <app-btn
                          v-if="item?.flag == null"
                          class="q-mr-xs"
                          icon="attach_money"
                          tooltip="Pembayaran"
                          color="blue"
                          @click="emits('bayar', item)"
                        />
                        <app-btn-cetak
                          v-if="item?.flag !== null"
                          class="q-mr-xs"
                          @click="lihatCetak(item)"
                        ></app-btn-cetak>
                      </div>
                    </q-item-section>

                    <q-item-section v-else side top>
                      <q-item-label caption>{{ humanDate(item?.tgl) }}</q-item-label>
                      <q-item-label caption>{{ jamTnpDetik(item?.tgl) }}</q-item-label>
                    </q-item-section>
                  </template>
                  <q-separator />
                  <div class="row q-pa-sm text-weight-bold">
                    <div class="col-5">Barang</div>
                    <div class="col-1 text-right">Jumlah</div>
                    <div class="col-1 text-right">Satuan</div>
                    <div class="col-2 text-right">Harga</div>
                    <div class="col-1 text-right">Diskon</div>
                    <div class="col-2 text-right">Subtotal</div>
                  </div>
                  <q-separator />
                  <div
                    v-if="item?.flag != null"
                    class="row q-pa-sm text-weight-bold f-10 text-italic"
                  >
                    (Detail Penjualan )
                  </div>
                  <div v-for="detail in item?.detail" :key="detail?.id">
                    <div class="row q-px-sm">
                      <div class="col-5">
                        {{
                          detail?.master_barang?.namabarang +
                          ' ' +
                          (item?.flag != null
                            ? ''
                            : detail?.master_barang?.stok === null
                              ? ''
                              : '(stok ' +
                                detail?.master_barang?.stok.jumlah_k +
                                '  ' +
                                detail?.master_barang?.stok.satuan_k +
                                ' )')
                        }}
                      </div>
                      <div class="col-1 text-right">{{ detail?.jumlah }}</div>
                      <div class="col-1 text-right">{{ detail?.master_barang?.satuan_k }}</div>
                      <div class="col-2 text-right">{{ formatDouble(detail?.harga_jual) }}</div>
                      <div class="col-1 text-right">{{ formatDouble(detail?.diskon) }}</div>
                      <div class="col-2 text-right">{{ formatDouble(detail?.subtotal) }}</div>
                    </div>
                  </div>
                  <template v-if="item?.flag != null">
                    <q-separator />
                    <div class="row q-pa-sm text-weight-bold f-10 text-italic">
                      (Detail Penjualan Fifo)
                    </div>
                    <div v-for="detail in item?.detail_fifo" :key="detail?.id">
                      <div class="row q-px-sm">
                        <div class="col-5">
                          {{
                            detail?.master_barang?.namabarang +
                            ' ' +
                            (item?.flag != null
                              ? ''
                              : detail?.master_barang?.stok === null
                                ? ''
                                : '(stok ' +
                                  detail?.master_barang?.stok.jumlah_k +
                                  '  ' +
                                  detail?.master_barang?.stok.satuan_k +
                                  ' )')
                          }}
                        </div>
                        <div class="col-1 text-right">{{ detail?.jumlah }}</div>
                        <div class="col-1 text-right">{{ detail?.master_barang?.satuan_k }}</div>
                        <div class="col-2 text-right">{{ formatDouble(detail?.harga_jual) }}</div>
                        <div class="col-1 text-right">{{ formatDouble(detail?.diskon) }}</div>
                        <div class="col-2 text-right">{{ formatDouble(detail?.subtotal) }}</div>
                      </div>
                    </div>
                  </template>
                </q-expansion-item>
                <q-separator />
              </q-intersection>

              <template v-slot:loading>
                <div v-if="!store.isError" class="text-center q-my-md">
                  <q-spinner-dots color="primary" size="40px" />
                </div>
              </template>
            </q-infinite-scroll>
          </div>
        </q-list>
      </div>
      <!-- <div class="column full-height flex-center">
        BELUM ADA DATA
      </div> -->
    </div>
  </div>
  <DialogCetak v-model="store.opendialogCetak" />
</template>

<script setup>
// import { useQuasar } from 'quasar'
import { formatDouble } from 'src/modules/formatter'
import { humanDate, jamTnpDetik } from 'src/modules/utils'
import { useListPenjualanStore } from 'src/stores/admin/transaksi/penjualan/list'
import { computed, defineAsyncComponent, onBeforeMount, ref, shallowRef } from 'vue'

// const search = ref(null)
const store = useListPenjualanStore()
// const form = useAdminFormMasterBarangStore()
const DialogCetak = shallowRef(defineAsyncComponent(() => import('./cetak/DialogCetak.vue')))
const scrollTarget = ref(null)
const infiniteScroll = ref(null)
const hoveredId = ref(null)
// const items = ref([ {}, {}, {}, {}, {}, {}, {},{},{},{},{}, {} ])

const emits = defineEmits(['add', 'edit', 'back', 'useNota', 'bayar'])

// const $q = useQuasar()
onBeforeMount(() => {
  // Promise.all([
  //   store.getList(null)
  // ])
})
function lihatCetak(item) {
  store.itemCetak = item
  store.opendialogCetak = true
  console.log('itemCetak', store.itemCetak)
}

function statusFlag(flag) {
  let status = ''
  switch (flag) {
    case null:
      status = 'Draft'
      break
    case '1':
      status = 'Pesanan Sales'
      break
    case '2':
      status = 'Belum Ada Cicilan'
      break
    case '3':
      status = 'Proses Cicilan'
      break
    case '4':
      status = 'Dibawa Sales'
      break
    case '5':
      status = 'Lunas'
      break
    case '6':
      status = 'Batal'
      break

    default:
      break
  }
  // console.log('status', status, flag);

  return status
}

// eslint-disable-next-line no-unused-vars
const next = computed(() => {
  let page = false

  if (store.meta?.next_page_url) {
    page = true
  }

  return page
})
</script>
<style lang="scss" scoped>
.example-item {
  height: 56px;
}
</style>
