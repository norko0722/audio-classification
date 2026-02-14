<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <header class="bg-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-700">
            <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-white">
                        <g>
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22" stroke="currentColor" stroke-width="1.5" fill="none"></path>
                            <circle cx="12" cy="12" r="1.5" fill="currentColor"></circle>
                        </g>
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-white">AudioGenre AI</h1>
                        <p class="text-gray-400">Intelligent Music Classification</p>
                    </div>
                </div>

                <nav class="hidden md:flex gap-8 absolute left-1/2 transform -translate-x-1/2">
                    <button 
                        @click="goToClassify" 
                        class="transition-colors"
                        :class="{'text-green-400': $route.path === '/classify', 'text-gray-300': $route.path !== '/classify'}"
                    >Classify</button>
                    <button 
                        @click="goToHistory" 
                        class="transition-colors"
                        :class="{'text-green-400': $route.path === '/history', 'text-gray-300': $route.path !== '/history'}"
                    >History</button>
                </nav>

                <div class="flex items-center gap-4">
                    <span class="text-green-400 font-medium">balucha.norbert</span>
                    <button @click="signOut" class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" x2="9" y1="12" y2="12"></line>
                        </svg>
                        Sign Out
                    </button>
                </div>
            </div>
            </div>
        </header>
        <Upload />
    </div>
</template>

<script setup>
    await fetchHistory()
</script>