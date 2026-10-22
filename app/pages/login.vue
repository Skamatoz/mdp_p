<!-- pages/login.vue -->
<!-- eslint-disable -->

<template>
  <div class="login-page w-full h-full bg-white">

      <div class="w-full h-screen flex items-center justify-center">
          <div class="h-96 w-96 bg-[#F7F7F8] rounded-2xl p-6">
              <h1 class="w-full flex items-center justify-center text-xl mt-6 mb-6">Welcome to&nbsp;<span class="font-bold">MDP & Partners</span></h1>
             <form action="" @submit.prevent="handleLogin">
                 <label for="Email" >
                     <span class="ml-2 text-sm font-medium text-gray-700"> Email </span>
                     <input
                     v-model="email"
                       type="email"
                       id="email"
                       class="mb-1 mt-0.5 w-full h-12 rounded-xl border border-[#E9E6EC] bg-white font-medium px-3"
                     />
                   </label>
                   <label for="Password">
                       <span class="ml-2 text-sm font-medium text-gray-700"> Password </span>
                       <input
                       v-model="password"
                         type="password"
                         id="password"
                         class="mt-0.5 w-full h-12 rounded-xl border border-[#E9E6EC] bg-white font-medium  px-3"
                       />
                     </label>

                     <button type="submit" class="flex items-center justify-center gap-3 mt-5 w-full h-12 rounded-xl  bg-[#1F0B31] text-white font-medium cursor-pointer">
                         <span v-if="!loadingText">Log in</span>
                         <span v-if="loadingText">Successfully!</span>
                         <div v-if="loading"
                              class="w-5 h-5 border-3 border-gray-200 border-t-gray-500 rounded-full animate-spin"
                              role="status"
                              aria-label="Loading">
                         </div>
                     </button>
             </form>
             <p class="flex w-full justify-center mt-5" v-if="errorMessage" style="color:red">{{ errorMessage }}</p>

          </div>
      </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const config = useRuntimeConfig()

const loadingText = ref(false)
const loading = ref(false)
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

// Коды отказа новой CRM → текст на экране
const LOGIN_ERRORS = {
  AUTH_INVALID: 'Неверный email или пароль',
  AUTH_BLOCKED: 'Доступ в кабинет закрыт',
  RATE_LIMITED: 'Слишком много попыток, попробуйте через 15 минут',
  VALIDATION:   'Введите email и пароль'
}

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    // Вход в кабинет партнёра новой CRM: сессия ставится httpOnly-cookie
    const response = await fetch(`${config.public.apiBase}/api/partner-portal/login`, {
      method:      'POST',
      headers:     { 'Content-Type': 'application/json' },
      credentials: 'include',             // ← вот это важно!
      body:        JSON.stringify({ email: email.value, password: password.value })
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      errorMessage.value = LOGIN_ERRORS[errorData?.error?.code] || 'Ошибка авторизации'
      return
    }
    const partner = await response.json()

    localStorage.setItem('id', partner.id)
    localStorage.setItem('auth', 'autIsDone')
    localStorage.setItem('email', partner.email || email.value)
    localStorage.setItem('name', partner.name || partner.tag)
    loadingText.value = true
    router.push('/dashboard')
  } catch (err) {
    console.error('Login request failed:', err)
    errorMessage.value = 'Ошибка соединения с сервером'
  } finally {
    loading.value = false
  }
}
</script>
