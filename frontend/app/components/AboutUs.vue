<template>
    <section class="bg-gray-800 py-20 border-y border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-green-900 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info text-green-400">
                        <circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                    </svg>
                </div>
                <h2 class="text-white mb-4">About AudioGenre AI</h2>
                <p class="text-gray-300 max-w-2xl mx-auto">
                    Our cutting-edge technology combines deep learning and audio signal processing to deliver accurate genre classification for your music collection.
                </p>
            </div>
            <div class="grid md:grid-cols-3 gap-8 mt-12">
                <div class="text-center p-6 bg-gray-900 rounded-lg border border-gray-700">
                    <div class="bg-gradient-to-br from-green-900 to-green-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-3xl">🎯</span>
                    </div>
                    <h3 class="text-white mb-2">High Accuracy</h3>
                    <p class="text-gray-400">Our AI models are trained on millions of audio samples to ensure precise genre detection across multiple music styles.</p>
                </div>
                <div class="text-center p-6 bg-gray-900 rounded-lg border border-gray-700">
                    <div class="bg-gradient-to-br from-emerald-900 to-emerald-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-3xl">⚡</span>
                    </div>
                    <h3 class="text-white mb-2">Fast Processing</h3>
                    <p class="text-gray-400">Get results in seconds with our optimized inference pipeline that analyzes audio features in real-time.</p>
                </div>
                <div class="text-center p-6 bg-gray-900 rounded-lg border border-gray-700">
                    <div class="bg-gradient-to-br from-teal-900 to-teal-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-3xl">🔒</span>
                    </div>
                    <h3 class="text-white mb-2">Secure &amp; Private</h3>
                    <p class="text-gray-400">Your audio files are processed securely and never stored on our servers. Privacy is our priority.</p>
                </div>
            </div>
        </div>
    </section>
</template>