<!-- <template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <NuxtLink to="/" class="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left">
          <path d="m12 19-7-7 7-7"></path> 
          <path d="M19 12H5"></path> 
        </svg> Back to Home 
      </NuxtLink>
      <div class="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <div class="flex justify-center mb-6">
          <div class="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-lg" >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-white">
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
        </div>
        <h2 class="text-white text-center mb-2">Welcome Back</h2>
        <p class="text-gray-400 text-center mb-8">Sign in to your account</p>
        <form @submit.prevent="signIn" class="space-y-6">
          <div>
            <label for="email" class="block text-gray-300 mb-2">Email</label>
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
            <label for="password" class="block text-gray-300 mb-2">Password</label>
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
          <p v-if="errors.general" class="text-red-500 text-sm mt-1 text-center">{{ errors.general }}</p>
          <button
            type="submit"
            class="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const state = reactive({
    email: '',
    password: ''
  })

  const errors = reactive({
    email: '',
    password: '',
    general: ''
  })

  const touched = reactive({
    email: false,
    password: false
  })

  function validateField(field: 'email' | 'password') {
    if (field === 'email') {
      if (!state.email) {
        errors.email = 'Email is required'
      } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(state.email)) { 
        errors.email = 'Email must be valid'
      } else {
        errors.email = ''
      }
    }

    if (field === 'password') {
      if (!state.password) errors.password = 'Password is required'
      else errors.password = ''
    }
  }

  function validateAll() {
    touched.email = true
    touched.password = true
    validateField('email')
    validateField('password')
    return !errors.email && !errors.password
  }

  async function signIn() {
    if (!validateAll()) return

    try {
      const response = await fetch('http://localhost:8000/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Invalid email or password')
      }

      const data = await response.json()
      localStorage.setItem('user', JSON.stringify(data))
      if (data.token) localStorage.setItem('token', data.token)

      router.push('/classify')
    } catch (err: any) {
      errors.general = err.message
    }
  }
</script> -->

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <NuxtLink to="/" class="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left">
          <path d="m12 19-7-7 7-7"></path> 
          <path d="M19 12H5"></path> 
        </svg> Back to Home 
      </NuxtLink>
      <div class="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h2 class="text-white text-center mb-2">Welcome Back</h2>
        <p class="text-gray-400 text-center mb-8">Sign in to your account</p>
        <form @submit.prevent="signIn" class="space-y-6">
          <div>
            <label for="email" class="block text-gray-300 mb-2">Email</label>
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
            <label for="password" class="block text-gray-300 mb-2">Password</label>
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
          <button
            type="submit"
            class="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
          >
            Sign In
          </button>
        </form>
        <div class="mt-6 text-center">
          <p class="text-gray-400">
            You don`t have an account? 
            <NuxtLink to="/sign-up" class="text-green-400 hover:text-green-300 transition-colors">Sign Up</NuxtLink>
          </p>
        </div>
      </div>
      <p v-if="errors.general" class="text-red-500 text-sm mt-10 text-center">{{ errors.general }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { currentUser } from '../store/user'

  const router = useRouter()

  const state = reactive({
    email: '',
    password: ''
  })

  const errors = reactive({
    email: '',
    password: '',
    general: ''
  })

  const touched = reactive({
    email: false,
    password: false
  })

  function validateField(field: 'email' | 'password') {
    if (field === 'email') {
      if (!state.email) errors.email = 'Email is required'
      else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(state.email)) errors.email = 'Email must be valid'
      else errors.email = ''
    }
    if (field === 'password') {
      if (!state.password) errors.password = 'Password is required'
      else errors.password = ''
    }
  }

  function validateAll() {
    touched.email = true
    touched.password = true
    validateField('email')
    validateField('password')
    return !errors.email && !errors.password
  }

  async function signIn() {
    if (!validateAll()) return

    try {
      const response = await fetch('http://localhost:8000/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state.email, password: state.password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Invalid email or password')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem("user", JSON.stringify({
        id: data.id,
        username: data.username,
        email: data.email
      }));

      currentUser.value = data
      router.push('/classify')
      return data
    } catch (err: any) {
      errors.general = err.message
    }
  }
</script>




