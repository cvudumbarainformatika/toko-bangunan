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
            <e-chart
              title="Produk Terlaris"
              :xAxisData="store.topProductsData.products"
              :series="store.topProductsData.series"
              :horizontal="true"
            />
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
            <e-chart
              title="Tren Penjualan"
              :xAxisData="store.salesTrendData.trendMonths"
              :series="store.salesTrendData.trendSeries"
            />
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
store.fetchSalesTrend()
store.fetchTopProducts()

// Chart data for top products
// const topProducts = ref(['Produk A', 'Produk B', 'Produk C', 'Produk D', 'Produk E'])
// const productSeries = ref([
//   {
//     name: 'Jumlah Terjual',
//     type: 'bar',
//     data: [120, 90, 70, 60, 50],
//   },
// ])

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
