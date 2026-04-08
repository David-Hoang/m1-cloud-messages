<template>
  <div class="flex items-center gap-2.5 px-4 py-3 border-t border-gray-100 bg-white shrink-0">

    <select
      v-model="selectedTopic"
      aria-label="Sélectionner le topic de destination"
      class="h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm font-medium cursor-pointer outline-none transition-colors focus:border-emerald-500 focus:bg-white shrink-0"
    >
      <option value="COMMON">📢 COMMON</option>
      <option v-for="user in availableUsers" :key="user" :value="user">
        👤 {{ user }}
      </option>
    </select>

    <input
      v-model="inputText"
      type="text"
      :placeholder="`Message vers ${selectedTopic}…`"
      aria-label="Saisir un message"
      class="flex-1 h-10 px-4 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white placeholder:text-gray-400"
      @keydown.enter="handleSend"
    />

    <button
      :disabled="!inputText.trim()"
      aria-label="Envoyer"
      class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 disabled:cursor-not-allowed"
      :class="inputText.trim()
        ? 'bg-emerald-700 text-emerald-50 hover:bg-emerald-800 active:scale-95'
        : 'bg-gray-200 text-gray-400'"
      @click="handleSend"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
        <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
      </svg>
    </button>

  </div>
</template>

<script lang="ts">
export default {
  name: 'MessagesInput',

  props: {
    availableUsers: {
      type: Array as () => string[],
      default: () => [],
    },
    defaultTopic: {
      type: String,
      default: 'COMMON',
    },
	},

  emits: ['send'],

  data() {
    return {
      inputText: '',
      selectedTopic: this.defaultTopic,
    }
  },

  methods: {
    handleSend() {
      const text = this.inputText.trim()
      if (!text) return
      this.$emit('send', { target: this.selectedTopic, payload: text })
      this.inputText = ''
    },
  },
}
</script>