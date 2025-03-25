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

                <div class="col-auto">
                  <app-btn icon="add" tooltip="Tambah Data" color="primary" @click="emits('add')" />
                </div>
              </div>
            </q-item-label>
            <q-separator inset="item" />
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
              <q-intersection
                v-for="(item, i) in store.items"
                :key="i"
                transition="fade"
                class="example-item"
              >
                <q-item
                  clickable
                  v-ripple
                  @mouseover="hoveredId = item?.id"
                  @mouseleave="hoveredId = null"
                  :class="{ 'bg-grey-8 text-white': hoveredId === item?.id }"
                >
                  <q-item-section avatar>
                    <q-avatar>
                      <q-img
                        v-if="item.image"
                        :src="getImageUrl(item.image)"
                        @click="imgClick(getImageUrl(item.image))"
                      />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label lines="1">{{ item?.namagabung }}</q-item-label>
                    <q-item-label caption lines="2">
                      <span class="text-weight-bold">Kategori: {{ item?.kategori }}</span> |
                      <span class="text-weight-bold"
                        >Isi: {{ item?.isi }} {{ item?.satuan_k }}</span
                      >
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-if="hoveredId === item?.id" side>
                    <div class="flex q-gutter-sm">
                      <app-btn-edit-list @click="edit(item)" />
                      <app-btn-delete-list @click="del(item)" />
                    </div>
                  </q-item-section>
                  <q-item-section v-else side top>
                    <q-item-label caption>{{ humanDate(item?.created_at) }}</q-item-label>
                    <q-item-label caption>{{ jamTnpDetik(item?.created_at) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset="item" />
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
  <DialogImage ref="dialogImage" />
</template>

<script setup>
import { useQuasar } from 'quasar'
import { humanDate, jamTnpDetik } from 'src/modules/utils'
// import { useAdminFormMasterBarangStore } from 'src/stores/admin/master/barang/form'
import { useAdminMasterBarangStore } from 'src/stores/admin/master/barang/list'
import { computed, onBeforeMount, ref } from 'vue'
import { pathImg } from 'src/boot/axios'
import DialogImage from './DialogImage.vue'

// const search = ref(null)
const store = useAdminMasterBarangStore()
// const form = useAdminFormMasterBarangStore()

const scrollTarget = ref(null)
const infiniteScroll = ref(null)
const hoveredId = ref(null)
// const items = ref([ {}, {}, {}, {}, {}, {}, {},{},{},{},{}, {} ])

const emits = defineEmits(['add', 'edit'])
const dialogImage = ref(null)

const $q = useQuasar()
onBeforeMount(() => {
  store.getList()
  // Promise.all([
  //   store.getList(null)
  // ])
})
// Fungsi untuk mendapatkan URL gambar
const getImageUrl = (image) => {
  if (image instanceof File || image instanceof Blob) {
    return URL.createObjectURL(image)
  }
  return pathImg + image // Jika gambar sudah ada di server
}
const imgClick = (val) => {
  console.log('img', val)
  // store.image = val
  // store.setExpand()
  dialogImage.value.openDialog(val)
}

const edit = (item) => {
  console.log('ediitx', item.rincians)
  emits('edit', item)
}
const del = (item) => {
  $q.dialog({
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    // persistent: true
  })
    .onOk(() => {
      // const params = { id: selected.value }
      store.deleteItem(item?.id)
    })
    .onCancel(() => {
      console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
}

// eslint-disable-next-line no-unused-vars
const next = computed(() => {
  let page = false

  if (store.meta?.next_page_url) {
    page = true
  }

  return page
})

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
