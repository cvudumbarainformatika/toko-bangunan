import { defineBoot } from '#q-app/wrappers'
import { useAppStore } from 'src/stores/app'
import * as storage from 'src/modules/storage'

export default defineBoot(({ router, store }) => {
  console.groupCollapsed('[boot routing]')
  // console.log('router', router)
  const app = useAppStore(store)

  router.beforeEach((to, from, next) => {
    // const isAuth = app?.auth
    //console.log('auth from store', isAuth)
    const token = storage.getLocalToken()
    const user = storage.getUser()
    const requireAuth = to.matched.some((route) => route.meta.requireAuth)
    // console.log('requireAuthauth from store', requireAuth)

    // Check token expiration
    const checkTokenExpiration = () => {
      const activeTime = localStorage.getItem('activeTime')
      if (activeTime) {
        const lastActive = new Date(activeTime)
        const now = new Date()
        const hoursDiff = (now - lastActive) / (1000 * 60 * 60)

        // Token expired after 24 hours of inactivity
        if (hoursDiff > 24) {
          app.logout()
          next({ path: '/auth' })
          return false
        }
      }
      next()
      return true
    }

    if (token && user && !app.auth) {
      app.restoreSession(token, user)
    }

    if (requireAuth) {
      if (!token || !user) {
        // No token or user, redirect to login
        next({ path: '/auth' })
        return
      }

      // Check token expiration if you have expiry data
      if (!checkTokenExpiration()) {
        next()
        return
      }
    } else if (token && to.path === '/auth') {
      // If authenticated and trying to access login page
      next({ path: '/' })
      return
    }
    next()
  })

  router.onError((error, to) => {
    if (error.message.includes('Failed to fetch dynamically imported module')) {
      window.location = to.fullPath
    }
  })

  console.groupEnd()
})
