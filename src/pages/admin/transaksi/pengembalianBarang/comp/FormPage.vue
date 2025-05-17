<template>
  <div>
    <div class="row q-mb-md">
      <div class="col-12">
        <q-card>
          <q-card-section class="row items-center">
            <div class="text-h6">Form Pengembalian Barang</div>
            <q-space />
            <q-btn
              label="Kembali"
              color="primary"
              @click="$emit('back')"
              icon="arrow_back"
            />
          </q-card-section>

          <q-card-section>
            <!-- Info Penjualan -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-6">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle2">Informasi Penjualan</div>
                    <div class="q-gutter-sm">
                      <div class="row">
                        <div class="col-4">No Penjualan</div>
                        <div class="col-8">: {{ form.item?.no_penjualan }}</div>
                      </div>
                      <div class="row">
                        <div class="col-4">Tanggal</div>
                        <div class="col-8">: {{ form.item?.tanggal }}</div>
                      </div>
                      <div class="row">
                        <div class="col-4">Pelanggan</div>
                        <div class="col-8">: {{ form.item?.pelanggan?.nama || form.item?.keterangan_pelanggan }}</div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Form Input -->
            <q-form @submit="onSubmit" class="q-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.keterangan"
                    label="Keterangan"
                    type="textarea"
                    :rules="[val => !!val || 'Keterangan harus diisi']"
                  />
                </div>
              </div>

              <!-- Detail Barang -->
              <div class="text-subtitle2 q-mt-md">Detail Barang</div>
              <q-table
                :rows="details"
                :columns="detailColumns"
                row-key="id"
                :pagination="{ rowsPerPage: 0 }"
                hide-pagination
              >
                <!-- Qty Column -->
                <template #body-cell-qty_retur="props">
                  <q-td :props="props">
                    <q-input
                      v-model.number="props.row.qty_retur"
                      type="number"
                      dense
                      :rules="[
                        val => val >= 0 || 'Qty harus lebih dari 0',
                        val => val <= props.row.jumlah || 'Qty melebihi pembelian'
                      ]"
                      style="width: 100px"
                    />
                  </q-td>
                </template>

                <!-- Keterangan Column -->
                <template #body-cell-keterangan="props">
                  <q-td :props="props">
                    <q-input
                      v-model="props.row.keterangan"
                      dense
                      :rules="[val => !!val || 'Keterangan harus diisi']"
                    />
                  </q-td>
                </template>
              </q-table>

              <!-- Buttons -->
              <div class="row justify-end q-gutter-sm">
                <q-btn
                  label="Reset"
                  color="negative"
                  @click="resetForm"
                  :disable="form.loading"
                />
                <q-btn
                  label="Simpan"
                  type="submit"
                  color="primary"
                  :loading="form.loading"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFormPengembalianStore } from 'src/stores/admin/transaksi/pengembalianBarang/form'

// Store
const form = useFormPengembalianStore()

// Computed
const details = computed(() => {
  // Transform penjualan details untuk form input
  return form.item?.details?.map(item => ({
    ...item,
    qty_retur: 0,
    keterangan: ''
  })) || []
})

const detailColumns = [
  {
    name: 'barang',
    label: 'Barang',
    field: row => row.barang?.nama,
    align: 'left'
  },
  {
    name: 'jumlah',
    label: 'Qty Beli',
    field: 'jumlah',
    align: 'right'
  },
  {
    name: 'qty_retur',
    label: 'Qty Retur',
    field: 'qty_retur',
    align: 'right'
  },
  {
    name: 'keterangan',
    label: 'Keterangan',
    field: 'keterangan',
    align: 'left'
  }
]

// Methods
async function onSubmit() {
  try {
    // Filter hanya barang yang di-retur
    const validDetails = details.value.filter(d => d.qty_retur > 0)
    if (!validDetails.length) {
      throw new Error('Minimal satu barang harus diretur')
    }

    await form.simpan()
    form.$emit('selesai', form.item)
  } catch (error) {
    console.error('Error saving:', error)
  }
}

function resetForm() {
  details.value.forEach(item => {
    item.qty_retur = 0
    item.keterangan = ''
  })
  form.keterangan = ''
}
</script>
