<template>
<div>redirect..</div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Переход на /login сразу после рендера страницы
  router.replace('/dashboard')
})
</script>
