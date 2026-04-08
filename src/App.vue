<script setup lang="ts">
    import { ref } from 'vue';

    const message = ref('');
</script>

<template>
  <main class="p-5 bg-state-100 h-dvh flex justify-center items-center">
    <div class="rounded-xl border border-zinc-700 shadow-xl h-2/3 w-2/3 flex flex-col overflow-auto">
      <div class="p-5 flex-1">
        Messages
      </div>
      <div class="p-5 flex flex-col gap-1">
        <div class="flex justify-between">
          <select name="targets" id="users" class="border border-zinc-700 bg-state-200 px-2 py-1 rounded-md">
            <option value="targets1">User 1</option>
            <option value="targets2">User 2</option>
            <option value="targets3">User 3</option>
          </select>

          <button class="rounded-md bg-red-400 px-2 py-1 text-white">Déconnexion</button>
        </div>
        <input v-model="message" class="w-full rounded-md border border-zinc-700 bg-state-200 p-2" placeholder="Votre messages...">
        </input>
      </div>
    </div>
  </main>
</template>
