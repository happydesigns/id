<script setup lang="ts">
defineOptions({
  name: 'IdPlaygroundPage'
})

const brandTheme = useBrandTheme()

const formState = reactive({
  name: 'Sample Brand',
  email: 'hello@example.com',
  approved: true
})

const columns = [
  {
    accessorKey: 'surface',
    header: 'Surface'
  },
  {
    accessorKey: 'token',
    header: 'Token'
  },
  {
    accessorKey: 'use',
    header: 'Use'
  }
]

const rows = [
  {
    surface: 'Default',
    token: 'bg-default',
    use: 'Page background'
  },
  {
    surface: 'Muted',
    token: 'bg-muted',
    use: 'Resting panels'
  },
  {
    surface: 'Elevated',
    token: 'bg-elevated',
    use: 'Section contrast'
  }
]
</script>

<template>
  <UApp>
    <UMain class="min-h-screen id-runtime-surface">
      <UPageHero
        headline="@happydesigns/id"
        title="Nuxt UI identity runtime"
        description="Switch theme packs while the page keeps using standard Nuxt UI components, semantic utilities, and app config."
      >
        <template #links>
          <IdThemeSelect />
          <UButton
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-book-open"
            to="/"
          >
            Playground
          </UButton>
        </template>
      </UPageHero>

      <UPageSection
        title="Runtime theme surface"
        description="The same Nuxt UI markup responds to CSS variables and app-config defaults."
      >
        <UPageGrid>
          <UPageCard
            title="Current theme"
            icon="i-lucide-palette"
          >
            <div class="space-y-4">
              <p class="text-sm text-muted">
                {{ brandTheme.currentTheme.value?.description }}
              </p>

              <div class="grid gap-3 sm:grid-cols-2">
                <IdBrandSwatch
                  name="Primary"
                  value="var(--ui-primary)"
                />
                <IdBrandSwatch
                  name="Background"
                  value="var(--ui-bg)"
                />
              </div>
            </div>
          </UPageCard>

          <UPageCard
            title="Action hierarchy"
            icon="i-lucide-mouse-pointer-click"
          >
            <div class="flex flex-wrap gap-3">
              <UButton>Primary</UButton>
              <UButton
                color="neutral"
                variant="outline"
              >
                Secondary
              </UButton>
              <UButton
                color="error"
                variant="subtle"
              >
                Destructive
              </UButton>
            </div>
          </UPageCard>

          <UPageCard
            title="Form controls"
            icon="i-lucide-text-cursor-input"
          >
            <UForm
              :state="formState"
              class="space-y-3"
            >
              <UFormField
                label="Brand name"
                name="name"
              >
                <UInput v-model="formState.name" />
              </UFormField>

              <UFormField
                label="Contact"
                name="email"
                help="Help text uses semantic muted text."
              >
                <UInput v-model="formState.email" />
              </UFormField>

              <UCheckbox
                v-model="formState.approved"
                label="Approved for runtime switching"
              />
            </UForm>
          </UPageCard>

          <UPageCard
            title="Feedback"
            icon="i-lucide-circle-check"
          >
            <div class="space-y-3">
              <UAlert
                color="success"
                variant="subtle"
                title="Tokenized success"
                description="Status colors come from Nuxt UI semantic roles."
              />
              <UAlert
                color="warning"
                variant="subtle"
                title="Runtime limit"
                description="Uncompiled classes and custom components still need a build-time layer."
              />
            </div>
          </UPageCard>
        </UPageGrid>
      </UPageSection>

      <UPageSection
        title="Dense UI check"
        description="Tables, badges, cards, and prose reveal whether the theme holds up beyond hero surfaces."
      >
        <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between gap-4">
                <h2 class="text-base font-semibold text-highlighted">
                  Surface map
                </h2>
                <UBadge color="primary" variant="subtle">
                  Nuxt UI
                </UBadge>
              </div>
            </template>

            <UTable
              :data="rows"
              :columns="columns"
            />
          </UCard>

          <UCard class="id-brand-preview-grid">
            <template #header>
              <h2 class="text-base font-semibold text-highlighted">
                Brand canvas
              </h2>
            </template>

            <div class="space-y-4">
              <p class="text-sm text-muted">
                A brand layer can replace this with logos, layouts, and richer primitives. A runtime theme should only adjust stable values.
              </p>

              <div class="rounded-lg border border-default bg-default p-4">
                <IdLogo />
              </div>
            </div>
          </UCard>
        </div>
      </UPageSection>
    </UMain>
  </UApp>
</template>
