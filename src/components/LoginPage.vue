<template>
  <div class="min-h-screen bg-stone-100 flex items-center justify-center p-6">
    <div class="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      <div class="px-8 pt-8 pb-6 text-center border-b border-gray-100">
        <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 text-xl flex items-center justify-center mx-auto mb-4">
          💬
        </div>
        <h1 class="text-xl font-semibold text-gray-900">Chat Pub/Sub</h1>
        <p class="text-sm text-gray-500 mt-1">Vous êtes sur le point de vous connecter en tant que : {{ currentUser() }}</p>
      </div>
      
      <button
        class="w-full h-11 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer bg-emerald-700 text-white hover:bg-emerald-800 active:scale-[0.98]"
        @click="handleLogin"
      >
        Se connecter
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { publishOpen } from '../services/publish.service'

const currentUser =  () => {
  const rawUserName = import.meta.env.VITE_USER_NAME;
  if (rawUserName) {
    return rawUserName.split('_')[1]
  } else {
    return 'Inconnu';
  }
}

const emit = defineEmits<{
  (e: 'login'): void
}>()

const handleLogin = () => {
  emit('login')
  publishOpen()
}
</script>