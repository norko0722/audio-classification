<template>
  <section id="upload" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div class="text-center mb-12">
      <h2 class="text-white mb-4">Upload Your Audio</h2>
      <p class="text-gray-300 max-w-2xl mx-auto">
        Drop your WAV file below and our AI will analyze it to determine the most likely music genre with confidence scores.
      </p>
    </div>
    <div class="w-full max-w-2xl mx-auto">
      <div class="border-2 border-dashed rounded-lg p-12 text-center transition-colors border-gray-600 hover:border-gray-500 bg-gray-800" v-if="!uploadedFile">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload mx-auto mb-4 text-gray-500">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" x2="12" y1="3" y2="15"></line>
        </svg>
        <h3 class="mb-2 text-gray-200">Drop your WAV file here</h3>
        <p class="mb-4 text-gray-400">or</p>
        <label class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors">
          Browse Files
          <input type="file" accept=".wav,audio/wav" class="hidden" @change="handleFileSelect">
        </label>
        <p class="mt-4 text-gray-500">Supported format: WAV</p>
      </div>
      <div v-else class="border-2 border-dashed rounded-lg p-12 text-center transition-colors border-gray-600 hover:border-gray-500 bg-gray-800">
        <div class="space-y-4">
          <div class="flex items-center justify-center gap-3 bg-gray-700 p-4 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-music text-green-400">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
            <span class="flex-1 text-left text-gray-200">{{ uploadedFile.name }}</span>
            <button class="text-gray-400 hover:text-gray-200 transition-colors" @click="removeFile">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
          <button class="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed" @click="classifyGenre">Classify Genre</button>
        </div>
      </div>
      <Results v-if="showResults" :data="resultsData" />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import Results from './Results.vue'
  import { currentUser } from '../pages/sign-in.vue'

  const uploadedFile = ref<File | null>(null)
  const showResults = ref(false)
  const resultsData = ref<any>(null)

  const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
      uploadedFile.value = target.files[0]
      showResults.value = false
      resultsData.value = null
    }
  }

  const removeFile = () => {
    uploadedFile.value = null
    showResults.value = false
    resultsData.value = null
  }

  const classifyGenre = async () => {
    if (!uploadedFile.value) return
    if (!currentUser.value) {
      console.error('User not signed in!')
      return
    }

    const formData = new FormData()
    formData.append('file', uploadedFile.value)
    formData.append('segment_duration', '10')
    formData.append('user_id', currentUser.value.id)

    try {
      const response = await fetch('http://localhost:8000/classification', {
        method: 'POST',
        body: formData
      })
      if (!response.ok) {
        throw new Error('Classification failed')
      }
      const data = await response.json()
      resultsData.value = data
      showResults.value = true
    } catch (error) {
      console.error('Error classifying genre:', error)
    }
  }
</script>

