<template>
  <div class="min-h-screen bg-stone-100 flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      <div class="px-8 pt-8 pb-6 text-center border-b border-gray-100">
        <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 text-xl flex items-center justify-center mx-auto mb-4">
          💬
        </div>
        <h1 class="text-xl font-semibold text-gray-900">Chat Pub/Sub</h1>
        <p class="text-sm text-gray-500 mt-1">Choisissez votre profil pour rejoindre le chat</p>
      </div>

      <div class="p-6 grid grid-cols-2 gap-3">
        <button
          v-for="profile in profiles"
          :key="profile.name"
          class="flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all duration-150 cursor-pointer outline-none group"
          :class="selectedProfile === profile.name
            ? 'border-emerald-500 bg-emerald-50 shadow-sm'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'"
          @click="selectedProfile = profile.name"
        >
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-colors"
            :class="selectedProfile === profile.name
              ? 'bg-emerald-200 text-emerald-800'
              : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'"
          >
            {{ profile.name.charAt(0) }}
          </div>
          <span
            class="text-sm font-medium transition-colors"
            :class="selectedProfile === profile.name ? 'text-emerald-700' : 'text-gray-700'"
          >
            {{ profile.name }}
          </span>
          <span
            v-if="selectedProfile === profile.name"
            class="text-[10px] font-semibold uppercase tracking-wide text-emerald-600"
          >
            Sélectionné ✓
          </span>
        </button>
      </div>

      <div class="px-6 pb-6">
        <button
          :disabled="!selectedProfile"
          class="w-full h-11 rounded-xl text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed cursor-pointer"
          :class="selectedProfile
            ? 'bg-emerald-700 text-white hover:bg-emerald-800 active:scale-[0.98]'
            : 'bg-gray-100 text-gray-400'"
          @click="handleConfirm"
        >
          {{ selectedProfile ? `Rejoindre en tant que ${selectedProfile}` : 'Choisissez un profil' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const profiles = [
  { name: 'TOTO' },
  { name: 'ALICE' },
  { name: 'BOB' },
  { name: 'CHARLIE' },
]

const selectedProfile = ref("")

const emit = defineEmits(['confirm'])

const handleConfirm = () => {
  if (!selectedProfile.value) return
  emit('confirm', selectedProfile.value)
}
</script>