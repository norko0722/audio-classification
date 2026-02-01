<!-- <template>
    <header class="bg-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white">
                            <g>
                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22" stroke="currentColor" stroke-width="1.5" fill="none"></path>
                                <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.6"></path>
                                <path d="M12 5C8.13 5 5 8.13 5 12C5 15.87 8.13 19 12 19" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.7"></path>
                                <path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.8"></path>
                                <path d="M12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.9"></path>
                                <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16" stroke="currentColor" stroke-width="0.8" fill="none"></path>
                                <path d="M12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15" stroke="currentColor" stroke-width="0.5" fill="none"></path>
                                <path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14" stroke="currentColor" stroke-width="1" fill="none"></path>
                                <circle cx="12" cy="12" r="1.5" fill="currentColor"></circle>
                            </g>
                            <g>
                                <rect x="13" y="8" width="1.5" height="8" fill="currentColor" rx="0.5"></rect>
                                <rect x="15.5" y="5" width="1.5" height="14" fill="currentColor" rx="0.5"></rect>
                                <rect x="18" y="9" width="1.5" height="6" fill="currentColor" rx="0.5"></rect>
                                <rect x="20.5" y="6" width="1.5" height="12" fill="currentColor" rx="0.5"></rect>
                            </g>
                            <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="0.5" opacity="0.3"></line>
                        </svg>
                    </div>
                    <div class="ml-1">
                        <h1 class="text-white text-4xl">AI Audio Genre</h1>                    
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <NuxtLink to="/sign-in" class="px-4 py-2 text-gray-300 hover:text-green-400 transition-colors">
                        Sign In
                    </NuxtLink>
                    <button class="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all">Sign Up</button>
                </div>
            </div>
        </div>
    </header>
</template>
 -->

<template>
  <header class="bg-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-700">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo a názov -->
        <div class="flex items-center gap-2">
          <div class="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white">
              <g>
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
              </g>
            </svg>
          </div>
          <div class="ml-1">
            <h1 class="text-white text-4xl">AI Audio Genre</h1>
          </div>
        </div>

        <!-- Navbar alebo Sign In/Up -->
        <div class="flex items-center gap-4">
          <template v-if="isLoggedIn">
            <!-- Navbar pre prihláseného -->
            <nav class="hidden md:flex gap-8">
              <NuxtLink
                to="/classify"
                class="transition-colors"
                :class="{'text-green-400': route.path === '/classify', 'text-gray-300': route.path !== '/classify'}"
              >Classify</NuxtLink>
              <NuxtLink
                to="/history"
                class="transition-colors"
                :class="{'text-green-400': route.path === '/history', 'text-gray-300': route.path !== '/history'}"
              >History</NuxtLink>
            </nav>
            <span class="text-green-400 font-medium">{{ username }}</span>
            <button
              @click="signOut"
              class="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              Sign Out
            </button>
          </template>

          <template v-else>
            <NuxtLink to="/sign-in" class="px-4 py-2 text-gray-300 hover:text-green-400 transition-colors">
              Sign In
            </NuxtLink>
            <NuxtLink to="/sign-up" class="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all">
              Sign Up
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'

    const router = useRouter()
    const route = useRoute()

    const isLoggedIn = ref(false)
    const username = ref('')

    onMounted(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
        const user = JSON.parse(userStr)
        username.value = user.username || 'User'
        isLoggedIn.value = true
    }
    })

    const signOut = () => {
    if (process.client) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }
    isLoggedIn.value = false
    router.push('/sign-in')
    }
</script>



