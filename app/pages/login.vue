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

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    // Отправляем запрос на авторизацию к бэкенду
    const response = await fetch(`${config.public.apiBase}/api/auth/login`, {
      method:      'POST',
      headers:     { 'Content-Type': 'application/json' },
      credentials: 'include',             // ← вот это важно!
      body:        JSON.stringify({ email: email.value, password: password.value })
    })
    if (!response.ok) {
      // Если пришел ответ об ошибке (401 Unauthorized)
      const errorData = await response.json()
      errorMessage.value = errorData.message || 'Ошибка авторизации'
      return
    }
    const data = await response.json()
    // console.log(data.user.role)
    // console.log(data.user.name)
    // console.log(data.user.email)

    // Сохраняем токен и роль пользователя в localStorage
    localStorage.setItem('role', data.user.role)
    localStorage.setItem('id', data.user.id)
    localStorage.setItem('auth', 'autIsDone')
    localStorage.setItem('email', data.user.email)
    localStorage.setItem('name', data.user.name)
    localStorage.setItem('userName', data.user.name || '')  // можно сохранить имя, если нужно
    // Перенаправляем пользователя на главную страницу (или другую защищенную страницу)
    loading.value = false
    loadingText.value = true

    if(data.user.role === 'GUEST'){
      router.push('/dashboard')
    } else {
      router.push('/403')
    }
  } catch (err) {
    console.error('Login request failed:', err)
    errorMessage.value = 'Ошибка соединения с сервером'
  }
}
</script>
