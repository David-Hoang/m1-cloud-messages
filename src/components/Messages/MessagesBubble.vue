<template>
  <div class="flex" :class="message.isSent ? 'justify-end' : 'justify-start'">
    <div class="flex flex-col gap-1 max-w-[65%]" :class="message.isSent ? 'items-end' : 'items-start'">

      <span
        class="text-[11px] font-semibold uppercase tracking-wide px-1"
        :class="message.isSent ? 'text-emerald-700' : 'text-sky-700'"
      >
        {{ messageDirection }}
      </span>

      <div
        class="px-4 py-2.5 rounded-[18px] text-sm leading-relaxed"
        :class="bubbleClasses"
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

const isCommon = computed(() => props.message.target === 'COMMON')

const messageDirection = computed(() => {
  if (isCommon.value) {
    return 'COMMON'
  }

  if (props.message.isSent) {
    return `Vous → ${props.message.target}`
  }

  return `${props.message.source} → vous`
})

const bubbleClasses = computed(() => {
  if (isCommon.value) {
    return props.message.isSent
      ? 'bg-stone-800 text-stone-50 rounded-br-sm'
      : 'bg-stone-100 text-stone-800 rounded-bl-sm border border-stone-200'
  }

  return props.message.isSent
    ? 'bg-emerald-700 text-emerald-50 rounded-br-sm'
    : 'bg-sky-100 text-sky-900 rounded-bl-sm border border-sky-200'
})

const formattedTime = computed(() =>
  new Date(props.message.timestamp).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
)
</script>