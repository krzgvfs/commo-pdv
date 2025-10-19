import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'default',
    },
  },
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      requiresAuth: false,
      layout: 'auth',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // Garante que a store de autenticação seja inicializada
  if (!auth.isAuthInitialized) {
    await auth.initAuth()
  }

  const isAuthenticated = auth.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redireciona para o login se a rota exige autenticação e o usuário não está logado
    return next({ name: 'Login' })
  } else if (to.name === 'Login' && isAuthenticated) {
    // Impede que usuários logados acessem a página de login
    return next({ name: 'Home' })
  } else {
    // Permite a navegação
    next()
  }
})

export default router
