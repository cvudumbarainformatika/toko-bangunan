<template>
  <div class="column fit">
    <div class="col full-height">
      <div class="full-height q-pa-sm">
        <q-list class="rounded-borders full-height column">
          <div class="col-auto">
            <q-item-label header>
              <div class="row full-width items-center">
                <div class="col-grow">
                  <div class="flex items-center q-gutter-sm">
                    <app-input
                      v-model="storeOrderH.params.q"
                      prepend-icon="search"
                      label="Telusuri"
                      style="min-width: 250px"
                      :debounce="300"
                      :loading="storeOrderH.loading"
                      @update:model-value="
                        (e) => {
                          infiniteScroll?.reset()
                          storeOrderH.getList()
                        }
                      "
                    />
                    <app-input-date
                      :model="storeOrderH.dateDisplay.from"
                      label="Dari"
                      style="min-width: 150px"
                      outlined
                      :debounce="300"
                      @set-model="
                        (val) => {
                          storeOrderH.dateDisplay.from = val
                        }
                      "
                      @db-model="
                        (val) => {
                          storeOrderH.params.from = val
                        }
                      "
                    />
                    <app-input-date
                      :model="storeOrderH.dateDisplay.to"
                      label="Sampai"
                      style="min-width: 150px"
                      outlined
                      :debounce="300"
                      @set-model="
                        (val) => {
                          storeOrderH.dateDisplay.to = val
                        }
                      "
                      @db-model="
                        (val) => {
                          storeOrderH.params.to = val
                        }
                      "
                    />
                    <q-btn
                      round
                      color="primary"
                      icon="find_replace"
                      @click="refreshList"
                      :loading="storeOrderH.loading"
                    />
                  </div>
                </div>

                <div class="col-auto">
                  <app-btn icon="add" tooltip="Tambah Data" color="primary" @click="emits('add')" />
                </div>
              </div>
            </q-item-label>
            <q-separator inset="item" />
          </div>
          <div ref="scrollTarget" class="col full-height scroll">
            <q-infinite-scroll
              @load="storeOrderH.loadMore"
              ref="infiniteScroll"
              :disable="storeOrderH?.isError || storeOrderH?.meta?.next_page_url === null"
              :scroll-target="scrollTarget"
              :offset="150"
              :initial-index="storeOrderH.params.page"
            >
              <q-intersection
                v-for="(item, i) in storeOrderH.items"
                :key="i"
                transition="fade"
                class="example-item"
              >
                <q-item
                  clickable
                  v-ripple
                  @mouseover="hoveredId = item?.id"
                  @mouseleave="hoveredId = null"
                >
                  <q-item-section avatar>
                    <q-avatar color="teal" text-color="white">OR</q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label lines="1">{{ item?.noorder }}</q-item-label>
                    <q-item-label caption lines="2">
                      <span class="text-weight-bold">-- {{ item?.suplier?.nama }}</span>
                      <span class="text-weight-bold text-red"> || TOTAL ORDERAN : </span
                      ><q-badge outline color="red">{{ formatRpDouble(item?.total) }}</q-badge>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-if="hoveredId === item?.id" side>
                    <div class="flex q-gutter-sm">
                      <app-btn-edit-list @click="lihatdetail(item)" />
                      <q-btn
                        v-if="item?.flaging === null"
                        color="teal"
                        icon="vpn_key"
                        size="sm"
                        padding="sm"
                        round
                        dense
                      >
                        <q-tooltip>Kunci Data</q-tooltip>
                      </q-btn>
                      <!-- <q-btn
                        v-if="item?.flaging === '2'"
                        color="teal"
                        icon="print"
                        size="sm"
                        padding="sm"
                        round
                        dense
                        @click="cetakData(item)"
                      >
                        <q-tooltip>Kunci Data</q-tooltip>
                      </q-btn> -->
                      <!-- <app-btn-vpn_key @click="lihatCetak(item)" /> -->
                      <!-- <app-btn-cetak @click="lihatCetak(item)" /> -->
                    </div>
                  </q-item-section>
                  <q-item-section v-else side top>
                    <q-item-label caption>{{ humanDate(item?.tglorder) }}</q-item-label>
                    <q-item-label caption>{{ jamTnpDetik(item?.tglorder) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset="item" />
              </q-intersection>

              <template v-slot:loading>
                <div v-if="!storeOrderH.isError" class="text-center q-my-md">
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
import { formatRpDouble, humanDate, jamTnpDetik } from 'src/modules/utils'

import { useAdminListTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/list'
import { computed, ref } from 'vue'

// const search = ref(null)
const storeOrderH = useAdminListTransaksiOrderBarangStore()

const refreshList = async () => {
  // Reset infinite scroll
  console.log('refresh', infiniteScroll.value.disable)
  infiniteScroll.value.reset() // Reset infinite scroll
  await storeOrderH.getList()
}

const scrollTarget = ref(null)
const infiniteScroll = ref(null)
const hoveredId = ref(null)
const emits = defineEmits(['add', 'edit'])

// onMounted(() => {
//   Promise.all([storeOrderH.getList()])
// })

// function lihatdetail(item) {
//   emits('edit', item)
// }

const lihatdetail = (item) => {
  emits('edit', item)
}

// function lihatdetail(val) {
//   storeOrderH.getallbynoorder(val)
// }

// eslint-disable-next-line no-unused-vars
const next = computed(() => {
  let page = false

  if (storeOrderH.meta?.next_page_url) {
    page = true
  }

  return page
})

defineExpose({ lihatdetail })

// function loadMore(index, done) {
//   store.params.page = index
//   if (store.params.page === 1) {
//     store.getList()
//     done(false)
//     console.log('index',index);
//   } else {
//     console.log('else',index);
//     if (store.meta?.next_page_url) {
//       store.getList()
//     } else {
//       done(true)
//     }
//   }

//   console.log('load more',next.value);

// }
</script>
<style lang="scss" scoped>
.example-item {
  height: 56px;
}
</style>
