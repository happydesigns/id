<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ComponentExampleMessages } from '../../../../../src/component-examples'
const german = ref(true)
const messages = computed<ComponentExampleMessages>(() => german.value ? {
  'forms.projectName': 'Projektname',
  'forms.reviewStatus': 'Prüfstatus',
  'forms.selectPlaceholder': 'Status auswählen',
  'forms.readyForReview': 'Bereit zur Prüfung',
  'navigation.overview': 'Überblick',
  'actions.cancel': 'Abbrechen'
} : {})
const names = ['action-hierarchy-pattern', 'badge', 'tooltip', 'form-pattern', 'text-entry-pattern', 'select', 'select-menu', 'radio-group', 'switch', 'skeleton', 'navigation-menu', 'navigation-location-pattern', 'pagination', 'card', 'table', 'popover', 'dropdown-menu']
</script>

<template>
  <div>
    <UButton data-testid="locale" label="Change language" @click="german = !german" />
    <UColorModeButton data-testid="mode" />
    <IdStudioLink />
    <section v-for="name in names" :key="name" :data-example="name">
      <h2>{{ name }}</h2>
      <IdComponentExample :name="name" :context="{ messages }" />
    </section>
    <IdComponentCoverageTable :items="[{ family: 'Forms', components: ['USelect'], status: 'verified' }]" :labels="{ family: 'Familie', statuses: { verified: { label: 'Geprüft' } } }" />
  </div>
</template>
