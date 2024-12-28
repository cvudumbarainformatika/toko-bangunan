const routes = [

  // Admin Routes
  {
    path: '/',
    meta: { requireAuth: true },
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: '/admin/dashboard', 
        component: () => import('pages/admin/dashboard/IndexPage.vue') 
      },
      { path: '/admin/profile', 
        component: () => import('pages/admin/profile/IndexPage.vue') 
      }
    ]
  },



  // Auth Routes
  {
    path: '/auth',
    meta: { requireAuth: false },
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', component: () => import('pages/auth/IndexPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
