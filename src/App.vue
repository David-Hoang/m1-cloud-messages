<script setup lang="ts">
import MessagesList from './components/Messages/MessagesList.vue'
import MessagesInput from './components/Messages/MessagesInput.vue'

const currentUser = 'TOTO'
const availableUsers = ['ALICE', 'BOB', 'CHARLIE']

const messages = [
  {
    id: 1,
    source: 'ALICE',
    target: 'COMMON',
    category: 'OPEN',
    payload: 'Alice vient de rejoindre le chat.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    isSent: false,
  },
  {
    id: 2,
    source: 'ALICE',
    target: 'COMMON',
    category: 'EMISSION',
    payload: 'Salut tout le monde !',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    isSent: false,
  },
  {
    id: 3,
    source: 'TOTO',
    target: 'COMMON',
    category: 'EMISSION',
    payload: 'Hello Alice, ça roule ?',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    isSent: true,
  },
  {
    id: 4,
    source: 'BOB',
    target: 'COMMON',
    category: 'EMISSION',
    payload: "Je viens de me connecter, c'est quoi le sujet du jour ?",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    isSent: false,
  },
  {
    id: 5,
    source: 'TOTO',
    target: 'COMMON',
    category: 'EMISSION',
    payload: 'On teste notre système de chat avec Pub/Sub 🚀',
    timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    isSent: true,
  },
]

let nextId = 6

const handleSend = ({ target, payload }: { target: string; payload: string }) => {
  messages.push({
    id: nextId++,
    source: currentUser,
    target,
    category: 'EMISSION',
    payload,
    timestamp: new Date().toISOString(),
    isSent: true,
  })

  /*    
   * TODO: publier sur topic_service via Pub/Sub
   *
   * pubsubService.publish('topic_service', {
   *   CATEGORY: 'EMISSION',
   *   TARGET: target,
   *   SOURCE: currentUser,
   *   TIMESTAMP: new Date().toISOString(),
   *   PAYLOAD: payload,
   * })
   */
}   
</script>

<template>
  <div class="min-h-screen bg-stone-100 flex items-center justify-center p-6">
    <div class="w-full max-w-2xl h-[85vh] max-h-200 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      <header class="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 shrink-0">
        <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 text-base font-semibold flex items-center justify-center shrink-0">
          {{ currentUser.charAt(0) }}
        </div>

        <div class="flex-1 flex flex-col gap-0.5">
          <h1 class="text-[15px] font-semibold text-gray-900">Chat Pub/Sub</h1>
          <span class="text-xs text-gray-500 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
            Connecté en tant que <strong class="text-gray-600">{{ currentUser }}</strong>
          </span>
        </div>

        <span class="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
          topic_service
        </span>
      </header>

      <MessagesList :messages="messages" />

      <MessagesInput
        :available-users="availableUsers"
        default-topic="COMMON"
        @send="handleSend"
      />

    </div>
  </div>
</template>
