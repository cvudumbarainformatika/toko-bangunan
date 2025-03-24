<template>
  <div class="column fit">
    <div class="col full-height">
      <div class="full-height q-pa-sm">
        <q-list class="rounded-borders full-height column">
          <div class="col-auto">
            <q-item-label header>
              <div class="row full-width items-center">
                <div class="col-grow">
                  <div class="flex items-center">
                    <app-input
                      v-model="storePenerimaanH.params.q"
                      prepend-icon="search"
                      label="Telusuri"
                      style="min-width: 250px"
                      :debounce="300"
                      @update:model-value="
                        (e) => {
                          infiniteScroll.reset()
                          // storePenerimaanH.getList()
                        }
                      "
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
              @load="storePenerimaanH.loadMore"
              ref="infiniteScroll"
              :disable="storePenerimaanH?.isError || storePenerimaanH?.meta?.next_page_url === null"
              :scroll-target="scrollTarget"
              :offset="150"
              :initial-index="storePenerimaanH.params.page"
            >
              <q-intersection
                v-for="(item, x) in storePenerimaanH.items"
                :key="x"
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
                    <q-avatar>
                      <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label lines="1">
                      <span class="text-weight-bold text-primary"
                        >No. Penerimaan : {{ item?.nopenerimaan }}</span
                      >
                      <span class="text-weight-bold"> || Supplier : {{ item?.suplier }}</span>
                    </q-item-label>
                    <q-item-label caption lines="2">
                      <span class="text-weight-bold"
                        ><q-badge rounded outline color="yellow">
                          No. Order : {{ item?.noorder }}
                        </q-badge></span
                      >
                      <span class="text-weight-bold text-red">
                        || TOTAL BARANG DATANG : {{ formatRpDouble(item?.total) }}</span
                      >
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-if="hoveredId === item?.id" side>
                    <div class="flex q-gutter-sm">
                      <app-btn-edit-list @click="lihatdetail(item)" />
                      <app-btn-delete-list />
                    </div>
                  </q-item-section>
                  <q-item-section v-else side top>
                    <q-item-label caption>{{ humanDate(item?.tgl) }}</q-item-label>
                    <q-item-label caption>{{ jamTnpDetik(item?.tgl) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset="item" />
              </q-intersection>

              <template v-slot:loading>
                <div v-if="!storePenerimaanH.isError" class="text-center q-my-md">
                  <q-spinner-dots color="primary" size="40px" />
                </div>
              </template>
            </q-infinite-scroll>
          </div>
        </q-list>
      </div>
      <!-- <div class="column full-height flex-center">BELUM ADA DATA</div> -->
    </div>
  </div>
</template>

<script setup>
import { formatRpDouble, humanDate, jamTnpDetik } from 'src/modules/formatter'
import { useAdminListTransaksiPenerimaanBarangStore } from 'src/stores/admin/transaksi/penerimaan/list'
import { computed, ref } from 'vue'

// const search = ref(null)
const storePenerimaanH = useAdminListTransaksiPenerimaanBarangStore()

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

  if (storePenerimaanH.meta?.next_page_url) {
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
