<template>
  <div>
    <div class="row q-mb-md">
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section class="row items-center">
            <div class="text-h6">List Penjualan</div>
            <q-space />
            <q-btn
              label="List Pengembalian"
              color="primary"
              @click="$emit('list')"
              icon="list"
            />
          </q-card-section>

          <q-card-section>
            <q-table
              :rows="list.items"
              :columns="columns"
              :loading="list.loading"
              row-key="id"
              v-model:pagination="pagination"
              @request="onRequest"
              binary-state-sort
            >
              <!-- Kolom Actions -->
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    round
                    color="primary"
                    icon="archive"
                    @click="$emit('form', props.row)"
                  >
                    <q-tooltip>Pengembalian Barang</q-tooltip>
                  </q-btn>
                </q-td>
              </template>

            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useListPenjualanStore } from 'src/stores/admin/transaksi/penjualan/list'

// Store
const list = useListPenjualanStore()

// Table config
const pagination = ref({
  sortBy: 'tanggal',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})

const columns = [
  {
    name: 'no_penjualan',
    label: 'No Penjualan',
    field: 'no_penjualan',
    align: 'left',
    sortable: true
  },
  {
    name: 'tanggal',
    label: 'Tanggal',
    field: 'tanggal',
    align: 'left',
    sortable: true
  },
  {
    name: 'nama_pelanggan',
    label: 'Pelanggan',
    field: row => row.pelanggan?.nama || row.keterangan_pelanggan,
    align: 'left',
  },
  {
    name: 'total',
    label: 'Total',
    field: 'total',
    align: 'right',
    format: val => new Intl.NumberFormat('id-ID').format(val),
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
  }
]

// Methods
async function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  list.params.page = page
  list.params.perPage = rowsPerPage
  list.params.sortBy = sortBy
  list.params.sortDesc = descending
  await list.getList()
  pagination.value.rowsNumber = list.total
}

// Initial load
onRequest({ pagination: pagination.value })
</script>
