<template>
  <div class="bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg shadow-lg p-8 text-white">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-green-100 mb-2">Primary Genre Detected</p>
        <h2 class="text-4xl mb-2">🎵 {{ data.genre }}</h2>
        <p class="text-green-100">{{ data.percentages[data.genre] }}% confidence</p>
      </div>
      <div class="bg-white/20 p-6 rounded-lg backdrop-blur-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-music2 lucide-music-2 text-white">
          <circle cx="8" cy="18" r="4"></circle>
          <path d="M12 18V2l7 4"></path>
        </svg>
      </div>
    </div>
  </div>

  <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mt-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="bg-green-900 p-2 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers text-green-400">
          <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path>
          <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path>
          <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path>
        </svg>
      </div>
      <div>
        <h3 class="text-white">Genre Distribution</h3>
        <p class="text-gray-400">All detected genres</p>
      </div>
    </div>
    <div class="space-y-4">
      <div v-for="(percentage, genre) in data.percentages" :key="genre" class="space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-gray-200" :class="{ 'text-yellow-400': genre === data.genre }">{{ genre === data.genre ? '🏆 ' : '' }}{{ genre }}</span>
          <span class="font-medium text-white">{{ percentage }}%</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div class="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-green-500 to-emerald-500" :style="{ width: `${percentage}%` }"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mt-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="bg-green-900 p-2 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-audio text-green-400">
          <path d="M17.5 22h.5a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"></path>
          <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
          <path d="M2 19a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 1 1-4 0v-1a2 2 0 1 1 4 0"></path>
        </svg>
      </div>
      <div>
        <h3 class="text-white">Audio Information</h3>
        <p class="text-gray-400 truncate">{{ data.filename }}</p>
      </div>
    </div>
    <div class="space-y-4">
      <div class="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock text-green-400">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span class="text-gray-300">Duration</span>
        </div>
        <span class="text-white font-medium">{{ formatDuration(data.audio_metadata.duration) }}</span>
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-radio text-green-400">
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
            <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
          </svg>
          <span class="text-gray-300">Sample Rate</span>
        </div>
        <span class="text-white font-medium">{{ data.audio_metadata.sample_rate.toLocaleString() }} Hz</span>
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers text-green-400">
            <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path>
            <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path>
            <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path>
          </svg>
          <span class="text-gray-300">Total Segments</span>
        </div>
        <span class="text-white font-medium">{{ data.audio_metadata.total_segments }}</span>
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity text-green-400">
            <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
          </svg>
          <span class="text-gray-300">Segment Duration</span>
        </div>
        <span class="text-white font-medium">{{ data.audio_metadata.segment_duration }}.00s</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Props {
  data: {
    genre: string
    percentages: Record<string, number>
    filename: string
    audio_metadata: {
      duration: number
      sample_rate: number
      total_segments: number
      segment_duration: number
    }
  }
}

const props = defineProps<Props>()

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>