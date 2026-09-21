<script setup lang="ts">
import { onMounted, ref } from 'vue'
const ready = ref(false)
const value = ref('Example')
onMounted(() => { ready.value = true })
</script>
<template>
  <section data-testid="hydration-probe" :data-ready="ready">
    <UFormField label="Project" help="A project name"><UInput v-model="value" /></UFormField>
    <UFormField label="Notes"><UTextarea v-model="value" /></UFormField>
    <UTabs :items="[{ label: 'Overview', content: 'Overview content' }, { label: 'Details', content: 'Details content' }]" />
    <UButton @click="value += '!'">Change value</UButton>
  </section>
</template>
