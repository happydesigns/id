<script setup lang="ts">
import { adapterOmissionRows, adapterValidationRows, productSurfaceOutput } from '../utils/adapter-validation'
defineOptions({ name: 'RuntimeChecks' })
definePageMeta({ layout: false, header: false, footer: false })
const brandTheme = useBrandTheme()
const exampleName = ref('Example project')
const count = ref(0)
const columns = [{ accessorKey: 'contract', header: 'Contract' }, { accessorKey: 'input', header: 'Input' }, { accessorKey: 'output', header: 'Output' }]
useSeoMeta({ title: 'Runtime checks · id' })
</script>
<template>
  <UTheme :ui="brandTheme.currentTheme.value?.ui">
    <UContainer class="max-w-5xl py-6 space-y-6">
      <header class="flex flex-wrap items-center justify-between gap-3">
        <UButton to="/studio?browse=true" color="neutral" variant="outline" icon="i-lucide-arrow-left">Studio</UButton>
        <div class="flex items-center gap-2"><IdThemeSelect /><IdColorModeButton /></div>
      </header>
      <div><h1 class="text-2xl font-semibold text-highlighted">Runtime checks</h1><p class="mt-2 text-sm text-muted">Inspect theme switching and the adapter fixture independently of Studio drafts.</p></div>
      <div class="grid gap-4 md:grid-cols-2">
        <UCard>
          <template #header><h2 class="font-semibold">Theme preview</h2></template>
          <div class="space-y-4">
            <div class="grid gap-3 sm:grid-cols-2"><IdBrandSwatch name="Primary" value="var(--ui-primary)" /><IdBrandSwatch name="Background" value="var(--ui-bg)" /></div>
            <UFormField label="Example name"><UInput v-model="exampleName" class="w-full" /></UFormField>
            <div class="flex items-center gap-3"><UButton @click="count++">Run action</UButton><span role="status" class="text-sm text-muted">{{ count }} completed</span></div>
            <p class="text-sm">{{ exampleName }}</p>
          </div>
        </UCard>
        <UCard>
          <template #header><h2 class="font-semibold">Optional values</h2></template>
          <p class="mb-4 text-sm text-muted">The Flexible light-only fixture leaves these values unset.</p>
          <dl class="space-y-4"><div v-for="row in adapterOmissionRows" :key="row.contract"><dt class="text-sm font-medium">{{ row.contract }}</dt><dd class="text-sm text-muted">{{ row.behavior }}</dd></div></dl>
        </UCard>
      </div>
      <UCard>
        <template #header><h2 class="font-semibold">Adapter mappings</h2></template>
        <UTable :data="[...adapterValidationRows]" :columns="columns" />
        <UAccordion :items="[{ label: 'Adapter output', slot: 'output' }]"><template #output><pre class="overflow-x-auto p-3 text-xs">{{ JSON.stringify(productSurfaceOutput, null, 2) }}</pre></template></UAccordion>
      </UCard>
    </UContainer>
  </UTheme>
</template>
