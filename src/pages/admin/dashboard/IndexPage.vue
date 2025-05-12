<template>
  <div class="q-pa-md fit">
    <!-- Header Section -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <q-card class="dashboard-card">
          <q-card-section>
            <e-chart
              title="Penjualan Bulanan"
              :xAxisData="store.salesData.months"
              :series="store.salesData.series"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="dashboard-card">
          <q-card-section>
            <e-chart title="Produk Terlaris" :xAxisData="topProducts" :series="productSeries" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <q-card class="dashboard-card">
          <q-card-section>
            <e-chart title="Distribusi Penjualan" :series="pieSeries" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="dashboard-card">
          <q-card-section>
            <e-chart title="Tren Penjualan" :xAxisData="trendMonths" :series="trendSeries" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Existing content -->
    <!-- <q-btn label="Add User" color="primary" @click="openForm" class="q-mb-md" />
    <q-btn label="Export to Excel" color="primary" @click="exportToExcel" /> -->
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

import EChart from 'src/components/charts/EChart.vue'
import { useAdminDashboardStore } from 'src/stores/admin/dashboard'

const store = useAdminDashboardStore()

store.fetchMonthlySales()

// Chart data for monthly sales
// const salesMonths = ref([
//   'Jan',
//   'Feb',
//   'Mar',
//   'Apr',
//   'Mei',
//   'Jun',
//   'Jul',
//   'Agu',
//   'Sep',
//   'Okt',
//   'Nov',
//   'Des',
// ])
// const salesSeries = ref([
//   {
//     name: 'Penjualan 2023',
//     type: 'bar',
//     data: [40, 20, 12, 39, 10, 40, 39, 50, 40, 20, 12, 39],
//   },
//   {
//     name: 'Penjualan 2024',
//     type: 'bar',
//     data: [30, 25, 22, 29, 15, 35, 40, 60, 45, 25, 22, 29],
//   },
// ])

// Chart data for top products
const topProducts = ref(['Produk A', 'Produk B', 'Produk C', 'Produk D', 'Produk E'])
const productSeries = ref([
  {
    name: 'Jumlah Terjual',
    type: 'bar',
    data: [120, 90, 70, 60, 50],
  },
])

// Pie chart for sales distribution
const pieSeries = ref([
  {
    name: 'Kategori Produk',
    type: 'pie',
    radius: ['40%', '70%'],
    data: [
      { value: 1048, name: 'Bahan Bangunan' },
      { value: 735, name: 'Alat Tukang' },
      { value: 580, name: 'Cat' },
      { value: 484, name: 'Keramik' },
      { value: 300, name: 'Lainnya' },
    ],
  },
])

// Line chart for sales trend
const trendMonths = ref([
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
])
const trendSeries = ref([
  {
    name: 'Penjualan',
    type: 'line',
    smooth: true,
    data: [3000, 2800, 3200, 3600, 3000, 3400, 3700, 3900, 3500, 3800, 4000, 4200],
  },
])

// Fungsi untuk membuka form (placeholder)
// const openForm = () => {
//   console.log('Open form clicked')
// }

// // Fungsi untuk export ke Excel (placeholder)
// const exportToExcel = () => {
//   console.log('Export to Excel clicked')
// }

// Fetch data on mount
onMounted(() => {
  // Di sini Anda bisa mengambil data dari API
  // Contoh:
  // fetchSalesData().then(data => {
  //   salesMonths.value = data.labels;
  //   salesSeries.value = data.series;
  // });
})
</script>
<style scoped>
.q-page {
  padding: 20px;
}
.q-card {
  width: 100%;
}
.dashboard-card {
  height: 400px;
}
</style>
