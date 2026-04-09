<template>
  <div>
    <ProfilePicker v-if="step === 1" @confirm="handleProfileConfirm" />

    <div v-if="step === 2" class="min-h-screen bg-stone-100 flex items-center justify-center p-6">
      <div class="w-full max-w-2xl h-[85vh] max-h-200 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        <header class="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 shrink-0">
          <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 text-base font-semibold flex items-center justify-center shrink-0">
            {{ currentUser.charAt(0) }}
          </div>

          <div class="flex-1 flex flex-col gap-0.5 min-w-0">
            <h1 class="text-[15px] font-semibold text-gray-900">Chat Pub/Sub</h1>
            <span class="text-xs text-gray-500 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
              Connecté en tant que <strong class="text-gray-600 ml-1">{{ currentUser }}</strong>
            </span>
          </div>

          <button
            class="text-[11px] font-medium px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
            @click="handleLeave"
          >
            🚪 Déconnexion
          </button>
        </header>

        <MessageList :messages="messages" />

        <MessageInput
          :available-users="otherUsers"
          default-topic="COMMON"
          @send="handleSend"
        />

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProfilePicker from './components/ProfilePicker.vue'
import MessageList from './components/Messages/MessagesList.vue'
import MessageInput from './components/Messages/MessagesInput.vue'
import type { Message } from './types/MessageType'

const ALL_USERS = ['TOTO', 'ALICE', 'BOB', 'CHARLIE']

const step = ref(1)
const currentUser = ref('')
const nextId = ref(1)

const messages = ref<Message[]>([])

const otherUsers = computed(() => ALL_USERS.filter(u => u !== currentUser.value))

const handleProfileConfirm = (profile: string) => {
  currentUser.value = profile

  messages.value.push({
    id: nextId.value++,
    source: profile,
    target: 'COMMON',
    category: 'OPEN',
    payload: `${profile} vient de rejoindre le chat.`,
    timestamp: new Date().toISOString(),
    isSent: false,
  })

  step.value = 2
}

const handleLeave = () => {
  messages.value = []
  currentUser.value = ''
  step.value = 1
}

const handleSend = ({ target, payload }: { target: string; payload: string }) => {
  messages.value.push({
    id: nextId.value++,
    source: currentUser.value,
    target,
    category: 'EMISSION',
    payload,
    timestamp: new Date().toISOString(),
    isSent: true,
  })

  /*
   * pubsubService.publish('topic_service', {
   *   CATEGORY: 'EMISSION',
   *   TARGET: target,
   *   SOURCE: currentUser.value,
   *   TIMESTAMP: new Date().toISOString(),
   *   PAYLOAD: payload,
   * })
   */
}
</script>