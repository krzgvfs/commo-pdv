<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const username = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    await auth.login({ username: username.value, password: password.value })
    // A navegação será tratada dentro da ação de login
  } catch (error) {
    errorMessage.value = `Falha no login. Verifique suas credenciais. ${error}`
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="row mt-5">
    <div class="col-md-6 col-lg-4 mx-auto">
      <div class="card shadow-sm">
        <div class="card-body">
          <h1 class="card-title text-center mb-4">Login</h1>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="username" class="form-label">Usuário</label>
              <input
                id="username"
                v-model="username"
                type="text"
                class="form-control"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Senha</label>
              <input
                id="password"
                v-model="password"
                type="password"
                class="form-control"
                required
                :disabled="isLoading"
              />
            </div>
            <div v-if="errorMessage" class="alert alert-danger py-2">
              {{ errorMessage }}
            </div>
            <div class="d-grid">
              <button type="submit" class="btn btn-primary" :disabled="isLoading">
                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                {{ isLoading ? 'Entrando...' : 'Entrar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
