<script setup lang="ts">
defineOptions({ name: 'CatalogPreview' })
const count = ref(0)
const search = ref('')
const products = ['Notebook', 'Desk lamp', 'Backpack']
const filtered = computed(() => products.filter(product => product.toLowerCase().includes(search.value.toLowerCase())))
</script>

<template>
  <main class="mx-auto max-w-3xl space-y-6 p-8 font-sans">
    <h1 class="text-3xl font-bold">
      Independent app
    </h1>
    <p>Find equipment for your workspace.</p>
    <UFormField label="Search products">
      <UInput v-model="search" />
    </UFormField>
    <ul class="grid gap-4 sm:grid-cols-3">
      <li
        v-for="product in filtered"
        :key="product"
      >
        <UCard>
          <h2>{{ product }}</h2><UButton
            :aria-label="'Add ' + product"
            @click="count++"
          >
            Add to cart
          </UButton>
        </UCard>
      </li>
    </ul>
    <UButton
      data-testid="primary-action"
      @click="count++"
    >
      Count {{ count }}
    </UButton>
    <UButton to="/demo/details">
      Details
    </UButton>
    <UButton to="/outside">
      Outside preview
    </UButton>
  </main>
</template>
