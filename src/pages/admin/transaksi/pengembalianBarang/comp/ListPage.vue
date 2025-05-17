<template>
  <div>
    <div class="row q-mb-md">
      <div class="col-12">
        <q-card>
          <q-card-section class="row items-center">
            <div class="text-h6">History Pengembalian Barang</div>
            <q-space />
            <q-btn
              label="Kembali"
              color="primary"
              @click="$emit('back')"
              icon="arrow_back"
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
              <!-- Status Column -->
              <template #body-cell-status="props">
                <q-td :props="props">
                  <q-chip
                    :color="getStatusColor(props.value)"
                    text-color="white"
                    :label="props.value"
                  />
                </q-td>
              </template>

              <!-- Actions Column -->
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    round
                    color="info"
                    icon="visibility"
                    @click="showDetail(props.row)"
                  >
                    <q-tooltip>Lihat Detail</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Dialog Detail -->
    <q-dialog v-model="showDetailDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">Detail Pengembalian</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedItem">
          <div class="q-gutter-sm">
            <div class="row">
              <div class="col-4">No Pengembalian</div>
              <div class="col-8">: {{ selectedItem.no_pengembalian }}</div>
            </div>
            <div class="row">
              <div class="col-4">No Penjualan</div>
              <div class="col-8">: {{ selectedItem.penjualan?.no_penjualan }}</div>
            </div>
            <div class="row">
              <div class="col-4">Tanggal</div>
              <div class="col-8">: {{ selectedItem.tanggal }}</div>
            </div>
            <div class="row">
              <div class="col-4">Status</div>
              <div class="col-8">
                <q-chip
                  :color="getStatusColor(selectedItem.status)"
                  text-color="white"
                  :label="selectedItem.status"
                />
              </div>
            </div>

            <!-- Detail Items -->
            <q-table
              :rows="selectedItem.details"
              :columns="detailColumns"
              row-key="id"
              flat
              dense
              hide-pagination
              :pagination="{ rowsPerPage: 0 }"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Tutup" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useListPengembalianStore } from 'src/stores/admin/transaksi/pengembalianBarang/list'

// Store
const list = useListPengembalianStore()

// State
const showDetailDialog = ref(false)
const selectedItem = ref(null)

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
    name: 'no_pengembalian',
    label: 'No Pengembalian',
    field: 'no_pengembalian',
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
    name: 'no_penjualan',
    label: 'No Penjualan',
    field: row => row.no_penjualan,
    align: 'left',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
  }
]

const detailColumns = [
  {
    name: 'barang',
    label: 'Barang',
    field: row => row.barang?.namabarang,
    align: 'left'
  },
  {
    name: 'qty',
    label: 'Qty',
    field: 'qty',
    align: 'right'
  },
  {
    name: 'keterangan',
    label: 'Keterangan',
    field: 'keterangan_rusak',
    align: 'left'
  }
]

// Methods
function getStatusColor(status) {
  const colors = {
    pending: 'warning',
    diganti: 'positive',
    ditolak: 'negative'
  }
  return colors[status] || 'grey'
}

function showDetail(item) {
  selectedItem.value = item
  showDetailDialog.value = true
}

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
