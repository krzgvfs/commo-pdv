<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const name = ref('')

const logoutView = async () => {
  await authStore.logout()
}
</script>

<template>
  <div class="row">
    <div class="col-md-8 mx-auto">
      <div class="d-flex justify-content-between mb-5">
        <h1>Hello, {{ name }}</h1>
        <button type="submit" class="btn btn-outline-primary" @click="logoutView">Logout</button>
      </div>
      <div class="row">
        <div class="col-md-12">
          <h1 class="display-4 mt-5">This is {{ name }}'s super secret page!!</h1>
        </div>
      </div>
    </div>
  </div>
</template>
