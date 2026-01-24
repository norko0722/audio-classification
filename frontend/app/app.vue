<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <Header v-if="route.path === '/'" />
    <NuxtPage />
    <Footer v-if="route.path === '/'" />
  </div>
</template>

<script setup>
  const route = useRoute()
</script>

