<script setup lang="ts">
import DefaultLayout from '@/layout/DefaultLayout.vue'
import AuthLayout from '@/layout/AuthLayout.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const layout = computed(() => {
  const layoutMeta = route.meta.layout as string
  const layoutName = layoutMeta === 'auth' || layoutMeta === 'default' ? layoutMeta : 'default'

  return {
    default: DefaultLayout,
    auth: AuthLayout,
  }[layoutName]
})
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<style lang="scss"></style>
