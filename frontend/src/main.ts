import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Inicializa a autenticação antes de montar o app
const authStore = useAuthStore()
authStore.initAuth().then(() => {
  app.use(router)
  app.mount('#app')
})