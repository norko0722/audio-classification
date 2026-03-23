<template>
  <main class="grid min-h-screen place-items-center bg-gray-900 px-6 py-24 sm:py-32 lg:px-8 border-y border-gray-800">
    <div class="text-center">
      
      <div class="inline-flex items-center justify-center w-20 h-20 bg-green-900/30 rounded-full mb-6 border border-green-800">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-400">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>

      <p class="text-base font-semibold text-green-400 tracking-wide uppercase">
        Error {{ error.statusCode }}
      </p>
      
      <h1 class="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
        {{ error.statusCode === 403 ? 'Access Restricted' : 'Page not found' }}
      </h1>
      
      <p class="mt-6 text-lg font-medium text-gray-400 max-w-xl mx-auto">
        {{ error.message || 'Sorry, we couldn’t find the page or you don’t have permission to access it.' }}
      </p>

      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button 
          @click="handleError"
          class="rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-green-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          {{ error.statusCode === 403 ? 'Sign In to Continue' : 'Go back home' }}
        </button>

        <NuxtLink to="/" class="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
          Contact support <span aria-hidden="true">&rarr;</span>
        </NuxtLink>
      </div>
      
      <div class="mt-16 opacity-10">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" class="mx-auto text-green-400">
              <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" stroke-width="1.5" />
              <circle cx="12" cy="8" r="2" stroke="currentColor" stroke-width="1.5" />
              <circle cx="12" cy="15.5" r="3.5" stroke="currentColor" stroke-width="1.5" />
          </svg>
      </div>
    </div>
  </main>
</template>

<script setup>
    const props = defineProps({
    error: Object
    })

    const handleError = () => clearError({ redirect: '/sign-in' })
</script>