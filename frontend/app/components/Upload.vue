<template>
  <section
    id="upload"
    class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
  >
    <div class="text-center mb-12">
      <h2 class="text-white mb-4">Upload Your Audio</h2>
      <p class="text-gray-300 max-w-2xl mx-auto">
        Drop your WAV file below and our AI will analyze it.
      </p>
    </div>

    <div class="w-full max-w-2xl mx-auto">
      <div
        class="border-2 border-dashed rounded-lg p-12 text-center transition-colors bg-gray-800"
        :class="isDragging ? 'border-green-500' : 'border-gray-600'"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="mx-auto mb-4 text-gray-500"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>

        <h3 class="mb-2 text-gray-200">
          {{ file ? file.name : 'Drop your WAV file here' }}
        </h3>

        <p class="mb-4 text-gray-400">or</p>

        <label
          class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors"
        >
          Browse Files
          <input
            type="file"
            accept=".wav,audio/wav"
            class="hidden"
            @change="handleFileSelect"
          />
        </label>

        <p class="mt-4 text-gray-500">Supported format: WAV</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const file = ref(null)
const isDragging = ref(false)

const validateFile = (selectedFile) => {
  if (!selectedFile) return false

  if (selectedFile.type !== 'audio/wav') {
    alert('Only WAV files are supported')
    return false
  }

  return true
}

const handleFileSelect = (event) => {
  const selectedFile = event.target.files[0]
  if (validateFile(selectedFile)) {
    file.value = selectedFile
    uploadFile()
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const droppedFile = event.dataTransfer.files[0]
  if (validateFile(droppedFile)) {
    file.value = droppedFile
    uploadFile()
  }
}

const uploadFile = async () => {
  const formData = new FormData()
  formData.append('file', file.value)

  // TODO: endpoint backendu
  await fetch('http://localhost:8000/upload', {
    method: 'POST',
    body: formData,
  })
}
</script>
