import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  let isAuth = false
  console.log(localStorage.user);
  if (localStorage.user != null  && localStorage.user != undefined && localStorage.user != "" && localStorage.user != 'null') {
    isAuth = true
  }

  // BELUM LOGIN & BUKAN KE LOGIN → REDIRECT
  if (!isAuth && to.path !== '/login') {
    return '/login'
  }

  // SUDAH LOGIN tapi ke LOGIN → redirect ke home (optional)
  if (isAuth && to.path === '/login') {
    return '/admin'
  }

  // selain itu lanjut
  return true
})

export default router
