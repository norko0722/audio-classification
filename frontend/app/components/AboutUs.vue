<template>
    <section class="bg-gray-800 py-20 border-y border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-green-900 rounded-full mb-4">
                    <!-- <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info text-green-400">
                        <circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                    </svg> -->
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white">
                        <g>
                            <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" stroke-width="1.5" />
                            <circle cx="12" cy="8" r="2" stroke="currentColor" stroke-width="1.5" />
                            <circle cx="12" cy="15.5" r="3.5" stroke="currentColor" stroke-width="1.5" />
                            <circle cx="12" cy="15.5" r="1" fill="currentColor" />
                        </g>
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
                        <span class="text-3xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target text-green-400">
                                <circle cx="12" cy="12" r="10"></circle>
                                <circle cx="12" cy="12" r="6"></circle>
                                <circle cx="12" cy="12" r="2"></circle>
                            </svg>
                        </span>
                    </div>
                    <h3 class="text-white mb-2">High Accuracy</h3>
                    <p class="text-gray-400">Our AI models are trained on millions of audio samples to ensure precise genre detection across multiple music styles.</p>
                </div>
                <div class="text-center p-6 bg-gray-900 rounded-lg border border-gray-700">
                    <div class="bg-gradient-to-br from-emerald-900 to-emerald-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-3xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bolt text-green-400">
                                <path d="M21 16V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16l4-4h12a2 2 0 0 0 2-2z"></path>
                                <path d="M13 10l-3 3h6l-3 3"></path>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap text-green-400">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                </svg>
                        </span>
                    </div>
                    <h3 class="text-white mb-2">Fast Processing</h3>
                    <p class="text-gray-400">Get results in seconds with our optimized inference pipeline that analyzes audio features in real-time.</p>
                </div>
                <div class="text-center p-6 bg-gray-900 rounded-lg border border-gray-700">
                    <div class="bg-gradient-to-br from-teal-900 to-teal-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-3xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock text-green-400">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </span>
                    </div>
                    <h3 class="text-white mb-2">Secure &amp; Private</h3>
                    <p class="text-gray-400">Your audio files are processed securely and never stored on our servers. Privacy is our priority.</p>
                </div>
            </div>
        </div>
    </section>
</template>