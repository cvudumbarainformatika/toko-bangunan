<template>
  <div class="column fit">
    <div class="col-auto header">
      <div class="row full-width q-pa-md">
        <div class="col-auto q-mr-md">
          <app-btn icon="add" tooltip="Tambah Data" />
        </div>
          <div class="col-grow">
            <div class="flex justify-end items-center">
              <app-input v-model="search" prepend-icon="search" label="Cari"  />
            </div>
          </div>
      </div>
    </div>

    <div class="col full-height">
      <div class="column full-height flex-center">
        BELUM ADA DATA
      </div>
    </div>
  </div>
</template>

<script setup>

import { useAdminMasterBarangStore } from 'src/stores/admin/master/barang/list';
import { onBeforeMount, ref } from 'vue';

const search = ref(null)
const store = useAdminMasterBarangStore()

onBeforeMount(() => {
  Promise.all([
    store.getList()
  ])
})
</script>