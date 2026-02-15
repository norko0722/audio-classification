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
              </svg>
              Back to Home
            </NuxtLink>
            <div class="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
              <h2 class="text-white text-center mb-2">Create Account</h2>
              <p class="text-gray-400 text-center mb-8">Join AudioGenre AI today</p>
              <form @submit.prevent="signUp" class="space-y-6">
                <div>
                  <label for="name" class="block text-gray-300 mb-2">Username*</label>
                  <input
                    id="name"
                    type="text"
                    v-model="state.name"
                    @blur="touched.name = true; validateField('name')"
                    @input="validateField('name')"
                    :class="['w-full px-4 py-3 rounded-lg focus:outline-none transition-colors border',
                      errors.name && touched.name ? 'border-red-500' : 'border-gray-600',
                      'bg-gray-900 text-white placeholder-gray-500 focus:border-green-500']"
                    placeholder="John Doe"
                  />
                  <p v-if="errors.name && touched.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
                </div>
                <div>
                  <label for="email" class="block text-gray-300 mb-2">Email*</label>
                  <input
                    id="email"
                    type="email"
                    v-model="state.email"
                    @blur="touched.email = true; validateField('email')"
                    @input="validateField('email')"
                    :class="['w-full px-4 py-3 rounded-lg focus:outline-none transition-colors border',
                      errors.email && touched.email ? 'border-red-500' : 'border-gray-600',
                      'bg-gray-900 text-white placeholder-gray-500 focus:border-green-500']"
                    placeholder="your@email.com"
                  />
                  <p v-if="errors.email && touched.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
                </div>
                <div>
                  <label for="password" class="block text-gray-300 mb-2">Password*</label>
                  <input
                    id="password"
                    type="password"
                    v-model="state.password"
                    @blur="touched.password = true; validateField('password')"
                    @input="validateField('password')"
                    :class="['w-full px-4 py-3 rounded-lg focus:outline-none transition-colors border',
                      errors.password && touched.password ? 'border-red-500' : 'border-gray-600',
                      'bg-gray-900 text-white placeholder-gray-500 focus:border-green-500']"
                    placeholder="••••••••"
                  />
                  <p v-if="errors.password && touched.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
                </div>
                <div>
                  <label for="confirm-password" class="block text-gray-300 mb-2">Confirm Password*</label>
                  <input
                    id="confirm-password"
                    type="password"
                    v-model="state.confirmPassword"
                    @blur="touched.confirmPassword = true; validateField('confirmPassword')"
                    @input="validateField('confirmPassword')"
                    :class="['w-full px-4 py-3 rounded-lg focus:outline-none transition-colors border',
                      errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-600',
                      'bg-gray-900 text-white placeholder-gray-500 focus:border-green-500']"
                    placeholder="••••••••"
                  />
                  <p v-if="errors.confirmPassword && touched.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</p>
                </div>
                <button
                  type="submit"
                  class="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                >
                  Create Account
                </button>
              </form>
              <div class="mt-6 text-center">
                <p class="text-gray-400">
                  Already have an account? 
                  <NuxtLink to="/sign-in" class="text-green-400 hover:text-green-300 transition-colors">Sign In</NuxtLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
    import { reactive, ref } from 'vue'
    import { useRouter } from '#app'

    const router = useRouter()

    const state = reactive({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const errors = reactive({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        general: ''
    })

    const touched = reactive({
        name: false,
        email: false,
        password: false,
        confirmPassword: false
    })

    function validateField(field: 'name' | 'email' | 'password' | 'confirmPassword') {
        if (field === 'name') {
            errors.name = state.name ? '' : 'Username is required'
        }
        if (field === 'email') {
            if (!state.email) errors.email = 'Email is required'
            else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(state.email)) errors.email = 'Email must be valid'
            else errors.email = ''
        }
        if (field === 'password') {
            errors.password = state.password ? '' : 'Password is required'
        }
        if (field === 'confirmPassword') {
            if (!state.confirmPassword) errors.confirmPassword = 'Confirm password is required'
            else if (state.confirmPassword !== state.password) errors.confirmPassword = 'Passwords do not match'
            else errors.confirmPassword = ''
        }
    }

    function validateAll() {
        Object.keys(touched).forEach(k => touched[k as keyof typeof touched] = true)
        Object.keys(state).forEach(k => validateField(k as keyof typeof state))
        return !errors.name && !errors.email && !errors.password && !errors.confirmPassword
    }

    const successMessage = ref('')

    async function signUp() {
        if (!validateAll()) return

        try {
            const response = await fetch('http://localhost:8000/sign-up', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: state.name,
                email: state.email,
                password: state.password
            })
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.detail || 'Failed to create account')

            successMessage.value = 'Account created successfully! Redirecting to Sign In page...'
            setTimeout(() => router.push('/sign-in'), 2000)

        } catch (err: any) {
            errors.general = err.message
        }
    }
</script>