<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <header class="bg-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-700">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white">
              <g>
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22" stroke="currentColor" stroke-width="1.5" fill="none"></path>
                <circle cx="12" cy="12" r="1.5" fill="currentColor"></circle>
              </g>
            </svg>
          </div>
          <div>
            <h1 class="text-white">AudioGenre AI</h1>
            <p class="text-gray-400 text-sm">Intelligent Music Classification</p>
          </div>
        </div>

        <nav class="hidden md:flex gap-8 absolute left-1/2 transform -translate-x-1/2">
          <button @click="goToClassify" class="transition-colors text-green-400">Classify</button>
          <button  @click="goToHistory" class="transition-colors text-gray-300 hover:text-green-400">History</button>
        </nav>

        <div class="flex items-center gap-4">
          <span class="text-green-400 font-medium">balucha.norbert</span>
          <button @click="signOut" class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" x2="9" y1="12" y2="12"></line>
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h2 class="text-white text-3xl font-semibold mb-2">Classification History</h2>
        <p class="text-gray-400">View all your previous audio genre classifications</p>
      </div>

      <div v-if="loading" class="text-gray-400">Loading...</div>
      <div v-if="error" class="text-red-400">{{ error }}</div>
      <div v-if="!loading && filteredHistory.length === 0" class="text-gray-400">No classifications yet.</div>

      <div class="space-y-4">
        <div
          v-for="item in filteredHistory"
          :key="item.id"
          class="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-green-600 transition-colors"
        >
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div class="flex-1 min-w-0">
              <h3 class="text-white mb-1 truncate">{{ item.filename }}</h3>
              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                <div class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar">
                    <path d="M8 2v4"></path>
                    <path d="M16 2v4"></path>
                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                    <path d="M3 10h18"></path>
                  </svg>
                  <span>{{ new Date(item.created_at).toLocaleString() }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-audio">
                    <path d="M17.5 22h.5a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M2 19a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 1 1-4 0v-1a2 2 0 1 1 4 0"></path>
                  </svg>
                  <span>{{ item.audio_metadata?.duration?.toFixed(2) }}s</span>
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <div
                  v-for="(percent, genre) in item.percentages"
                  :key="genre"
                  class="px-3 py-1 rounded-full text-sm"
                  :class="percent === Math.max(...Object.values(item.percentages)) ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'"
                >
                  {{ genre }}: {{ percent }}%
                </div>
              </div>
            </div>

            <div class="lg:text-right flex-shrink-0">
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg border border-green-700">
                <div>
                  <div class="text-xs text-gray-400 uppercase tracking-wider">Primary Genre</div>
                  <div class="text-lg font-medium text-green-400">{{ item.genre }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'


  const router = useRouter()

  const goToHistory = () => router.push('/history')
  const goToClassify = () => router.push('/classify')

  const history = ref([])
  const loading = ref(false)
  const error = ref(null)

  const filteredHistory = computed(() => history.value.filter(item => item && item.filename && item.genre))

  const fetchHistory = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch('/history') 
      history.value = res
    } catch (err) {
      error.value = err.message || 'Failed to fetch history'
    } finally {
      loading.value = false
    }
  }

  const signOut = () => {
    localStorage.removeItem('authToken') 
    router.push('/sign-in')
  }

  onMounted(() => {
    fetchHistory()
  })
</script>
