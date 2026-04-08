<template>
  <div
    ref="listRef"
    class="flex-1 overflow-y-auto flex flex-col gap-2.5 px-4 py-5 scroll-smooth"
  >
    <p v-if="messages.length === 0" class="m-auto text-sm text-gray-400">
      Aucun message pour l'instant…
    </p>

    <template v-for="(message, index) in messages" :key="message.id">

      <div v-if="showDateDivider(index)" class="flex items-center gap-3 my-2">
        <span class="flex-1 h-px bg-gray-200"></span>
        <span class="text-[11px] text-gray-400 whitespace-nowrap">{{ formatDate(message.timestamp) }}</span>
        <span class="flex-1 h-px bg-gray-200"></span>
      </div>

      <MessagesBubble :message="message" />

    </template>
  </div>
</template>

<script lang="ts">
import MessagesBubble from './MessagesBubble.vue'

type Message = {
  id: string | number
  timestamp: string | number | Date
}

export default {
  name: 'MessageList',

  components: { MessagesBubble },

  props: {
    messages: {
      type: Array as () => Message[],
      required: true,
    },
  },

  watch: {
    messages() {
      this.$nextTick(() => this.scrollToBottom())
    },
  },

  mounted() {
    this.scrollToBottom()
  },

  methods: {
    scrollToBottom() {
      const el = this.$refs.listRef as HTMLElement
      if (el) el.scrollTop = el.scrollHeight
    },

    showDateDivider(index: number) {
			if (index === 0) return true

			const prevMessage = this.messages[index - 1]
			const currMessage = this.messages[index]

			if (!prevMessage || !currMessage) return false

			const prev = new Date(prevMessage.timestamp)
			const curr = new Date(currMessage.timestamp)

			return prev.toDateString() !== curr.toDateString()
		},

    formatDate(timestamp: string | number | Date) {
      const date = new Date(timestamp)
      const today = new Date()
      if (date.toDateString() === today.toDateString()) return "Aujourd'hui"
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
    },
  },
}
</script>