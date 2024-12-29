<template>
  <div class="fit column">
    <div class="col-auto">
      <div class="row items-center q-pa-lg">
        <div class="col-grow">
          <app-btn-back @click="emits('back')"/>
        </div>
        <div class="col-auto">
          <app-btn :dense="false" label="Simpan" color="primary" />
        </div>
      </div>
    </div>
    <div class="col full-height q-pa-lg">
      <q-card flat class="col full-height">
        <q-form class="full-height">
          <q-card-section class="full-height q-pa-lg scroll" >
            <div class="row q-col-gutter-md">
              <div :class="`col-${isMobile ? 12 : 6}`" class=" q-gutter-md">
                <app-input v-model="store.form.namabarang" label="Nama Barang" :valid="{required: false}" />
                <app-input v-model="store.form.kategori" label="Kategori" />
                <app-input v-model="store.form.merk" label="Merk" />
              </div>
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { useAdminFormMasterBarangStore } from 'src/stores/admin/master/barang/form';
import { computed } from 'vue';

const emits = defineEmits(['back'])
const $q = useQuasar();
const isMobile = computed(() => {
  return $q.screen.lt.sm; // Quasar screen size helper
});

const store = useAdminFormMasterBarangStore()
</script>