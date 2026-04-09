<template>
  <div class="flex" :class="message.isSent ? 'justify-end' : 'justify-start'">
    <div class="flex flex-col gap-1 max-w-[65%]" :class="message.isSent ? 'items-end' : 'items-start'">

      <span v-if="!message.isSent" class="text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-1">
        {{ message.source }}
      </span>

      <div
        class="px-4 py-2.5 rounded-[18px] text-sm leading-relaxed"
        :class="message.isSent
          ? 'bg-emerald-700 text-emerald-50 rounded-br-sm'
          : 'bg-gray-100 text-gray-800 rounded-bl-sm'"
      >
        <span
          v-if="message.category === 'OPEN' || message.category === 'CLOSE'"
          class="block text-[11px] font-semibold mb-1 opacity-70"
        >
          {{ message.category === 'OPEN' ? '🟢 Connexion' : '🔴 Déconnexion' }}
        </span>
        <p class="m-0">{{ message.payload }}</p>
      </div>

      <span class="text-[11px] text-gray-400 px-1">{{ formattedTime }}</span>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Message } from '../../types/MessageType'

const props = defineProps<{
  message: Message
}>()

const formattedTime = computed(() =>
  new Date(props.message.timestamp).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
)
</script>