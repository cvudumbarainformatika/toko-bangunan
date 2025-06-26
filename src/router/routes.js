const routes = [
  // Admin Routes
  {
    path: '/',
    meta: { requireAuth: true },
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: '/admin/dashboard', component: () => import('pages/admin/dashboard/IndexPage.vue') },

      // Master
      {
        path: '/admin/master/pegawai',
        component: () => import('pages/admin/master/pegawai/IndexPage.vue'),
      },
      {
        path: '/admin/master/supplier',
        component: () => import('pages/admin/master/supplier/IndexPage.vue'),
      },
      {
        path: '/admin/master/pelanggan',
        component: () => import('pages/admin/master/pelanggan/IndexPage.vue'),
      },
      {
        path: '/admin/master/brand',
        component: () => import('pages/admin/master/brand/IndexPage.vue'),
      },
      {
        path: '/admin/master/satuan',
        component: () => import('pages/admin/master/satuan/IndexPage.vue'),
      },
      {
        path: '/admin/master/jeniskeramik',
        component: () => import('pages/admin/master/jeniskeramik/IndexPage.vue'),
      },
      {
        path: '/admin/master/barang',
        component: () => import('pages/admin/master/barang/IndexPage.vue'),
      },

      //Transaksi
      {
        path: '/admin/transaksi/orderbarang',
        component: () => import('pages/admin/transaksi/orderbarang/IndexPage.vue'),
      },
      {
        path: '/admin/transaksi/penerimaan',
        component: () => import('pages/admin/transaksi/penerimaan/IndexPage.vue'),
      },
      {
        path: '/admin/transaksi/pengembalianbarang',
        component: () => import('pages/admin/transaksi/pengembalianBarang/IndexPage.vue'),
      },
      {
        path: '/admin/transaksi/penjualan',
        component: () => import('pages/admin/transaksi/penjualan/IndexPage.vue'),
      },
      {
        path: '/admin/transaksi/cicilan',
        component: () => import('pages/admin/transaksi/cicilan/IndexPage.vue'),
      },
      {
        path: '/admin/transaksi/retur',
        component: () => import('pages/admin/transaksi/returPenjualan/IndexPage.vue'),
      },
      {
        path: '/admin/transaksi/penyesuaian',
        component: () => import('pages/admin/transaksi/penyesuaian/IndexPage.vue'),
      },
      {
        path: '/admin/transaksi/stok',
        component: () => import('pages/admin/transaksi/stok/IndexPage.vue'),
      },
      {
        path: '/admin/transaksi/stok-opname',
        component: () => import('pages/admin/transaksi/stokOpname/IndexPage.vue'),
      },
      {
        path: '/admin/transaksi/order-penjualan',
        component: () => import('pages/admin/transaksi/orderpenjualan/IndexPage.vue'),
      },
      {
        path: '/admin/transaksi/pembayaran-hutang',
        component: () => import('pages/admin/transaksi/pembayaranhutang/IndexPage.vue'),
      },

      // Laporan
      {
        path: '/admin/laporan/penerimaan',
        component: () => import('pages/admin/laporan/penerimaan/IndexPage.vue'),
      },

      // Settings
      {
        path: '/admin/settings/profiltoko',
        component: () => import('pages/admin/settings/profiltoko/IndexPage.vue'),
      },
      {
        path: '/admin/settings/hakakses',
        component: () => import('pages/admin/settings/hakakses/IndexPage.vue'),
      },

      // profile
      { path: '/admin/profile', component: () => import('pages/admin/profile/IndexPage.vue') },
    ],
  },

  // Auth Routes
  {
    path: '/auth',
    meta: { requireAuth: false },
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/IndexPage.vue') }],
  },
  {
    path: '/percobaan',
    meta: { requireAuth: false },
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/percobaan/IndexPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
