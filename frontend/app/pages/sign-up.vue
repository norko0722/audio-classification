<template>
    <div id="container">
        <div class="tailwind">
            <div id="fig-code-root" style="height: 100%;">
                <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
                    <div class="w-full max-w-md">
                        <NuxtLink to="/" class="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors mb-8">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left">
                            <path d="m12 19-7-7 7-7"></path> 
                            <path d="M19 12H5"></path> 
                            </svg> Back to Home 
                        </NuxtLink>
                        <div class="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
                            <h2 class="text-white text-center mb-2">Create Account</h2>
                            <p class="text-gray-400 text-center mb-8">Join AudioGenre AI today</p>
                            <form class="space-y-6">
                            <div>
                                <label for="name" class="block text-gray-300 mb-2">Full Name</label>
                                <input id="name" type="text" required class="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors" placeholder="John Doe">
                            </div>

                            <div>
                                <label for="email" class="block text-gray-300 mb-2">Email</label>
                                <input id="email" type="email" required class="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors" placeholder="your@email.com">
                            </div>

                            <div>
                                <label for="password" class="block text-gray-300 mb-2">Password</label>
                                <input id="password" type="password" required class="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors" placeholder="••••••••">
                            </div>

                            <div>
                                <label for="confirm-password" class="block text-gray-300 mb-2">Confirm Password</label>
                                <input id="confirm-password" type="password" required class="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors" placeholder="••••••••">
                            </div>

                            <button type="submit" class="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg">
                                Create Account
                            </button>
                            </form>

                            <div class="mt-6 text-center">
                            <p class="text-gray-400">
                                Already have an account? 
                                <button class="text-green-400 hover:text-green-300 transition-colors">Sign In</button>
                            </p>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>