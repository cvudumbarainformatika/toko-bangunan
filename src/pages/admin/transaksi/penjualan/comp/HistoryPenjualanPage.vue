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
                  <div class="flex items-center">
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
                  <div class="row q-pa-sm">
                    <div class="col-6">Barang</div>
                    <div class="col-1 text-right">Jumlah</div>
                    <div class="col-2 text-right">Harga</div>
                    <div class="col-1 text-right">Diskon</div>
                    <div class="col-2 text-right">Subtotal</div>
                  </div>
                  <div v-for="detail in item?.detail" :key="detail?.id">
                    <div class="row q-px-sm">
                      <div class="col-6">
                        {{
                          detail?.master_barang?.namabarang ??
                          '' +
                            ' ' +
                            (detail?.master_barang?.brand === null
                              ? ''
                              : (detail?.master_barang?.brand ?? '')) +
                            ' ' +
                            (detail?.master_barang?.seri === null
                              ? ''
                              : (detail?.master_barang?.seri ?? '')) +
                            ' ' +
                            (detail?.master_barang?.ukuran === null
                              ? ''
                              : (detail?.master_barang?.ukuran ?? ''))
                        }}
                      </div>
                      <div class="col-1 text-right">{{ detail?.jumlah }}</div>
                      <div class="col-2 text-right">{{ detail?.harga_jual }}</div>
                      <div class="col-1 text-right">{{ detail?.diskon }}</div>
                      <div class="col-2 text-right">{{ detail?.subtotal }}</div>
                    </div>
                  </div>
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
</template>

<script setup>
// import { useQuasar } from 'quasar'
import { formatDouble } from 'src/modules/formatter'
import { humanDate, jamTnpDetik } from 'src/modules/utils'
import { useListPenjualanStore } from 'src/stores/admin/transaksi/penjualan/list'
import { computed, onBeforeMount, ref } from 'vue'

// const search = ref(null)
const store = useListPenjualanStore()
// const form = useAdminFormMasterBarangStore()

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
  console.log('item', item)
  store.opendialogCetak = true
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
