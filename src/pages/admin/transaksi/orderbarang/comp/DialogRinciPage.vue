<template>
  <q-dialog v-model="store.fixed">
    <q-card>
      <q-card-section>
        <div class="text-h6">Masukkan Rincian Barang</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <div class="row q-col-gutter-md justify-around">
          <div class="col-12">
            <app-input
              class="col-12"
              v-model="store.form.namabarang"
              label="Nama Barang"
              :valid="{ required: false }"
            />
          </div>
          <div class="col-12">
            <app-input
              class="col-12"
              v-model="store.form.merk"
              label="Merk"
              :valid="{ required: false }"
              disable
            />
          </div>
          <div class="col-12">
            <app-input
              class="col-12"
              v-model="store.form.namabarang"
              label="Brand"
              :valid="{ required: false }"
              disable
            />
          </div>
          <div class="col-12">
            <app-input
              class="col-12"
              v-model="store.form.namabarang"
              label="Seri"
              :valid="{ required: false }"
              disable
            />
          </div>
          <div class="col-12">
            <app-input
              class="col-12"
              v-model="store.form.namabarang"
              label="Satuan Besar"
              :valid="{ required: false }"
              disable
            />
          </div>
          <div class="col-12">
            <app-input
              class="col-12"
              v-model="store.form.namabarang"
              label="Satuan Kecil"
              :valid="{ required: false }"
              disable
            />
          </div>
          <div class="col-12">
            <app-input
              class="col-12"
              v-model="store.form.namabarang"
              label="Isi"
              :valid="{ required: false }"
              disable
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn label="BATAL" color="primary" v-close-popup />
        <q-btn label="SIMPAN" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useAdminFormTransaksiOrderBarangStore } from 'src/stores/admin/transaksi/orderbarang/form'

const store = useAdminFormTransaksiOrderBarangStore()
</script>
