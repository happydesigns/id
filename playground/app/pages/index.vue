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
  },
  {
    surface: 'Accented',
    token: 'bg-accented',
    use: 'Pressed and selected states'
  }
]
</script>

<template>
  <UApp>
    <UTheme :ui="brandTheme.currentTheme.value?.ui">
      <div class="min-h-screen id-runtime-surface">
        <UHeader
          :toggle="false"
          title="@happydesigns/id"
        >
          <template #left>
            <ULink
              to="/"
              class="flex items-center gap-2 text-sm font-semibold text-highlighted"
              aria-label="@happydesigns/id playground"
            >
              <UIcon
                name="i-lucide-fingerprint"
                class="size-5 text-primary"
              />
              <span class="hidden sm:inline">@happydesigns/id</span>
              <span class="sm:hidden">id</span>
            </ULink>
          </template>

          <template #right>
            <div class="flex items-center gap-2">
              <IdThemeSelect />
              <IdColorModeButton />
            </div>
          </template>
        </UHeader>

        <UMain>
          <UPageHero
            headline="@happydesigns/id"
            title="Nuxt UI identity runtime"
            description="Switch already shipped brand themes while the page keeps using standard Nuxt UI components, semantic utilities, app config, and light or dark color mode."
          >
            <template #links>
              <UButton
                color="primary"
                trailing-icon="i-lucide-palette"
              >
                {{ brandTheme.currentTheme.value?.label }}
              </UButton>
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
            description="The same Nuxt UI markup responds to CSS variables, app-config defaults, and color mode."
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
                  <UButton
                    color="primary"
                    variant="ghost"
                    icon="i-lucide-sparkles"
                  >
                    Ghost
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
            title="Component defaults"
            description="Theme packs can also tune stable Nuxt UI component defaults through app config."
          >
            <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <UCard>
                <template #header>
                  <div class="flex items-center justify-between gap-4">
                    <h2 class="text-base font-semibold text-highlighted">
                      Surface map
                    </h2>
                    <UBadge color="primary">
                      Nuxt UI
                    </UBadge>
                  </div>
                </template>

                <dl class="divide-y divide-default sm:hidden">
                  <div
                    v-for="row in rows"
                    :key="row.token"
                    class="grid gap-1 py-3 first:pt-0 last:pb-0"
                  >
                    <dt class="text-sm font-medium text-highlighted">
                      {{ row.surface }}
                    </dt>
                    <dd class="font-mono text-xs text-primary break-all">
                      {{ row.token }}
                    </dd>
                    <dd class="text-sm text-muted">
                      {{ row.use }}
                    </dd>
                  </div>
                </dl>

                <div class="hidden sm:block">
                  <UTable
                    :data="rows"
                    :columns="columns"
                  />
                </div>
              </UCard>

              <UCard class="id-brand-preview-grid">
                <template #header>
                  <div class="flex items-center justify-between gap-4">
                    <h2 class="text-base font-semibold text-highlighted">
                      Brand canvas
                    </h2>
                    <UBadge
                      color="secondary"
                      variant="subtle"
                    >
                      {{ brandTheme.currentTheme.value?.name }}
                    </UBadge>
                  </div>
                </template>

                <div class="space-y-4">
                  <p class="text-sm text-muted">
                    A brand layer can replace this with logos, layouts, and richer primitives. A runtime theme should only adjust stable values.
                  </p>

                  <div class="rounded-lg border border-default bg-default p-4">
                    <IdLogo />
                  </div>

                  <div class="grid grid-cols-2 gap-3 text-sm">
                    <div class="rounded-lg border border-default bg-muted p-3">
                      <p class="font-medium text-highlighted">
                        Radius
                      </p>
                      <p class="mt-1 text-muted">
                        var(--ui-radius)
                      </p>
                    </div>
                    <div class="rounded-lg border border-default bg-muted p-3">
                      <p class="font-medium text-highlighted">
                        Mode
                      </p>
                      <p class="mt-1 text-muted">
                        light / dark
                      </p>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </UPageSection>
        </UMain>
      </div>
    </UTheme>
  </UApp>
</template>
