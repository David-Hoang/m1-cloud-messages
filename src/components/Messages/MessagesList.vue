<template>
  <div ref="listRef" class="flex-1 overflow-y-auto flex flex-col gap-2.5 px-4 py-5 scroll-smooth">

    <p v-if="messages.length === 0" class="m-auto text-sm text-gray-400">
      Aucun message pour l'instant…
    </p>

    <template v-for="(message) in messages" :key="message.id">

      <MessageBubble :message="message" />

    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import MessageBubble from './MessagesBubble.vue'
import type { Message } from '../../types/MessageType'

const props = defineProps<{
  messages: Message[]
}>()

const listRef = ref<HTMLDivElement | null>(null)

const scrollToBottom = () => {
  if (listRef.value) listRef.value.scrollTop = listRef.value.scrollHeight
}

watch(() => props.messages, () => nextTick(scrollToBottom), { deep: true })
</script>