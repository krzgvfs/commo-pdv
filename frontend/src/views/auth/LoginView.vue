<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const username = ref('')
const password = ref('')
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  try {
    await auth.login({ username: username.value, password: password.value })
  } catch (error) {
    errorMessage.value = `Falha no login. Verifique suas credenciais. ${error}`
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md items-center bg-white p-8 shadow-lg">
      <h1 class="mb-6 text-center text-3xl font-bold text-gray-800">Login</h1>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="username" class="mb-2 block text-sm font-medium text-gray-700">Usuário</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-200"
            placeholder="seu.usuario"
          />
        </div>

        <div class="mb-6">
          <label for="password" class="mb-2 block text-sm font-medium text-gray-700">Senha</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-200"
            placeholder="••••••••"
          />
        </div>

        <button
          @click="handleSubmit"
          class="flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-wait disabled:bg-blue-300"
        >
          {{ 'Entrar' }}
        </button>

        <div
          v-if="errorMessage"
          class="mt-4 rounded-md border border-red-400 bg-red-100 p-3 text-center text-sm text-red-700"
        >
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>
