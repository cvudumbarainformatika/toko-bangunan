import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { date } from 'quasar'

export const useAdminDashboardStore = defineStore('admin-dashboard-store', {
  state: () => ({
    loading: false,
    error: null,
    meta: null,

    // Filter periode
    periode: {
      bulan: date.formatDate(Date.now(), 'MM'),
      tahun: date.formatDate(Date.now(), 'YYYY'),
    },

    // Data untuk chart penjualan bulanan
    salesData: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
      series: [],
    },

    // Data untuk chart produk terlaris
    topProductsData: {
      products: [],
      series: [
        {
          name: 'Jumlah Terjual',
          type: 'bar',
          data: [],
        },
      ],
    },

    // Data untuk chart distribusi penjualan
    salesDistributionData: {
      series: [
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
      ],
    },

    // Data untuk chart tren penjualan
    salesTrendData: {
      trendMonths: [
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
      ],
      trendSeries: [],
    },

    // Statistik ringkasan
    summaryStats: {
      totalPenjualan: 0,
      totalPendapatan: 0,
      totalProduk: 0,
      totalPelanggan: 0,
    },
  }),

  getters: {
    // Getter untuk format mata uang
    formattedTotalPendapatan: (state) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(state.summaryStats.totalPendapatan)
    },
  },

  actions: {
    // Mengambil semua data dashboard
    async fetchDashboardData() {
      this.loading = true
      this.error = null

      try {
        // Mengambil data penjualan bulanan
        await this.fetchMonthlySales()

        // Mengambil data produk terlaris
        await this.fetchTopProducts()

        // Mengambil data distribusi penjualan
        await this.fetchSalesDistribution()

        // Mengambil data tren penjualan
        await this.fetchSalesTrend()

        // Mengambil statistik ringkasan
        await this.fetchSummaryStats()
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        this.error = 'Gagal memuat data dashboard'
      } finally {
        this.loading = false
      }
    },

    // Mengambil data penjualan bulanan
    async fetchMonthlySales() {
      // const params = {
      //   params: this.params,
      // }
      try {
        const { data } = await api.get('/v1/dasboard/penjualanbulanan')
        const datax = data
        console.log('datax', datax)
        if (datax && datax.data && Array.isArray(datax.data)) {
          // Inisialisasi array untuk tahun saat ini dan tahun sebelumnya
          const currentYearData = Array(12).fill(0)
          const previousYearData = Array(12).fill(0)

          // Mendapatkan tahun saat ini dan tahun sebelumnya
          const currentYear = parseInt(this.periode.tahun)
          const previousYear = currentYear - 1

          // Mengisi data berdasarkan bulan
          datax.data.forEach((item) => {
            // Bulan dalam data dimulai dari 1, array dimulai dari 0
            const monthIndex = parseInt(item.bulan) - 1
            const year = parseInt(item.tahun)

            if (monthIndex >= 0 && monthIndex < 12) {
              if (year === currentYear) {
                currentYearData[monthIndex] = item.subtotal || 0
              } else if (year === previousYear) {
                previousYearData[monthIndex] = item.subtotal || 0
              }
            }
          })

          // Update data series dengan nilai yang sudah diproses
          this.salesData.series = [
            {
              name: datax.tahunx || `Penjualan ${previousYear}`,
              type: 'bar',
              data: previousYearData,
            },
            {
              name: datax.tahun || `Penjualan ${currentYear}`,
              type: 'bar',
              data: currentYearData,
            },
          ]

          // console.log('Updated monthly sales data:', this.salesData.series)
        }
      } catch (error) {
        console.error('Error fetching monthly sales:', error)
        throw error
      }
    },

    // Mengambil data produk terlaris
    async fetchTopProducts() {
      try {
        const { data } = await api.get('/v1/dasboard/fastmove10')
        const datax = data
        console.log('datax', datax)

        if (datax && datax.data && Array.isArray(datax.data)) {
          // Urutkan data berdasarkan jumlah barang (dari terbesar ke terkecil)
          const sortedData = [...datax.data].sort((a, b) => b.jumlahbarang - a.jumlahbarang)

          // Ambil hanya 10 data teratas jika lebih dari 10
          const topData = sortedData.slice(0, 10)

          // Untuk chart horizontal, kita perlu membalik urutan agar yang terbesar muncul di atas
          const reversedData = [...topData].reverse()

          // Pastikan products adalah array
          this.topProductsData.products = reversedData.map((item) => item.namabarang)

          // Warna-warna untuk batang chart
          const colors = [
            '#5470c6',
            '#91cc75',
            '#fac858',
            '#ee6666',
            '#73c0de',
            '#3ba272',
            '#fc8452',
            '#9a60b4',
            '#ea7ccc',
            '#8dc1a9',
          ]

          // Buat data dengan warna berbeda untuk setiap item
          const itemsWithColors = reversedData.map((item, index) => ({
            value: item.jumlahbarang,
            itemStyle: {
              color: colors[index % colors.length],
            },
          }))

          // Pastikan series adalah array yang berisi objek
          this.topProductsData.series = [
            {
              name: 'Jumlah Terjual',
              type: 'bar',
              data: itemsWithColors,
              label: {
                show: true,
                position: 'right',
                formatter: '{c}',
              },
            },
          ]

          console.log('Processed top products data:', {
            products: this.topProductsData.products,
            series: this.topProductsData.series,
          })
        }
      } catch (error) {
        console.error('Error fetching top products:', error)
        throw error
      }
    },

    // Mengambil data distribusi penjualan
    async fetchSalesDistribution() {
      try {
        // const { data } = await api.get('/v1/admin/dashboard/sales-distribution', {
        //   params: this.periode,
        // })

        // Jika API sudah siap, gunakan data dari API
        // this.salesDistributionData = data

        // Untuk sementara gunakan data dummy
        console.log('Fetched sales distribution data')
      } catch (error) {
        console.error('Error fetching sales distribution:', error)
        throw error
      }
    },

    // Mengambil data tren penjualan
    async fetchSalesTrend() {
      try {
        const { data } = await api.get('/v1/dasboard/salestrend')
        const datax = data
        console.log('datax', datax)
        if (datax && datax.data && Array.isArray(datax.data)) {
          // Inisialisasi array untuk tahun saat ini dan tahun sebelumnya
          const currentYearData = Array(12).fill(0)

          // Mendapatkan tahun saat ini dan tahun sebelumnya
          const currentYear = parseInt(this.periode.tahun)

          // Mengisi data berdasarkan bulan
          datax.data.forEach((item) => {
            // Bulan dalam data dimulai dari 1, array dimulai dari 0
            const monthIndex = parseInt(item.bulan) - 1
            const year = parseInt(item.tahun)

            if (monthIndex >= 0 && monthIndex < 12) {
              if (year === currentYear) {
                currentYearData[monthIndex] = item.subtotal || 0
              }
            }
          })

          this.salesTrendData.trendSeries = [
            {
              name: 'Penjualan',
              type: 'line',
              smooth: true,
              data: currentYearData,
            },
          ]
        }

        // Jika API sudah siap, gunakan data dari API
        // this.salesTrendData = data

        // Untuk sementara gunakan data dummy
        console.log('Fetched sales trend data', this.salesTrendData.series)
      } catch (error) {
        console.error('Error fetching sales trend:', error)
        throw error
      }
    },

    // Mengambil statistik ringkasan
    async fetchSummaryStats() {
      try {
        // const { data } = await api.get('/v1/admin/dashboard/summary-stats', {
        //   params: this.periode,
        // })

        // Jika API sudah siap, gunakan data dari API
        // this.summaryStats = data

        // Untuk sementara gunakan data dummy
        this.summaryStats = {
          totalPenjualan: 256,
          totalPendapatan: 125000000,
          totalProduk: 1250,
          totalPelanggan: 85,
        }

        console.log('Fetched summary stats')
      } catch (error) {
        console.error('Error fetching summary stats:', error)
        throw error
      }
    },

    // Update periode dan refresh data
    async updatePeriode(bulan, tahun) {
      this.periode.bulan = bulan
      this.periode.tahun = tahun

      // Refresh data dengan periode baru
      await this.fetchDashboardData()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminDashboardStore, import.meta.hot))
}
