<script setup lang="ts">
import { ref } from '#imports'
import { de, en } from '@nuxt/ui/locale'
import type { ComponentExampleContext } from '../../../src/component-examples'

const props = defineProps<{
  name: string
  context: ComponentExampleContext
}>()

const locale = ref('en')

const locales = [en, de]

const authFields = [{
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'hello@example.com'
}, {
  name: 'password',
  type: 'password',
  label: 'Password',
  placeholder: 'Password'
}]

const scopedThemeProps = {
  button: {
    color: 'secondary' as const,
    variant: 'solid' as const,
    size: 'sm' as const
  },
  badge: {
    color: 'secondary' as const,
    variant: 'subtle' as const
  },
  alert: {
    color: 'secondary' as const,
    variant: 'soft' as const
  }
}
</script>

<template>
  <ClientOnly v-if="props.name === 'color-mode-button'">
    <UColorModeButton />
  </ClientOnly>

  <ClientOnly v-else-if="props.name === 'color-mode-switch'">
    <UColorModeSwitch />
  </ClientOnly>

  <ClientOnly v-else-if="props.name === 'color-mode-select'">
    <UColorModeSelect class="max-w-xs" />
  </ClientOnly>

  <ClientOnly v-else-if="props.name === 'color-mode-avatar'">
    <UColorModeAvatar
      v-if="props.context.assets.symbol"
      :light="props.context.assets.symbol"
      :dark="props.context.assets.symbol"
      :alt="props.context.logoAlt"
    />
    <UAvatar
      v-else
      :text="props.context.copy.brandLabel.slice(0, 2).toUpperCase()"
      :alt="props.context.logoAlt"
    />
  </ClientOnly>

  <ClientOnly v-else-if="props.name === 'color-mode-image'">
    <div class="grid gap-3 rounded-sm border border-default bg-default p-4 sm:grid-cols-2">
      <div class="flex min-h-28 items-center justify-center rounded-sm border border-default bg-default p-5">
        <img
          v-if="props.context.assets.wordmark"
          :src="props.context.assets.wordmark"
          :alt="`${props.context.copy.brandLabel} wordmark`"
          class="h-6 w-auto"
        >
        <span v-else class="font-semibold text-highlighted">{{ props.context.copy.brandLabel }}</span>
      </div>
      <div class="flex min-h-28 items-center justify-center rounded-sm border border-default bg-inverted p-5 text-inverted">
        <img
          v-if="props.context.assets.wordmarkInverse"
          :src="props.context.assets.wordmarkInverse"
          :alt="`${props.context.copy.brandLabel} inverse wordmark`"
          class="h-6 w-auto"
        >
        <span v-else class="font-semibold">{{ props.context.copy.brandLabel }}</span>
      </div>
    </div>
  </ClientOnly>

  <ULocaleSelect
    v-else-if="props.name === 'locale-select'"
    v-model="locale"
    :locales="locales"
    class="max-w-xs"
  />

  <ClientOnly v-else-if="props.name === 'auth-form'">
    <UAuthForm
      title="Access project"
      description="Use clear labels and one primary path."
      icon="i-lucide-lock-keyhole"
      :fields="authFields"
      :submit="{ label: 'Continue' }"
    />
    <template #fallback>
      <div class="rounded-sm border border-default bg-muted p-4 text-sm text-muted">
        Auth form preview
      </div>
    </template>
  </ClientOnly>

  <div v-else-if="props.name === 'error'" class="overflow-hidden rounded-sm border border-default">
    <UError
      :error="{ statusCode: 404, statusMessage: 'Pattern not found', message: 'The requested component pattern is not available yet.' }"
      :links="[{ label: 'Open components', to: props.context.paths.components, color: 'neutral', variant: 'outline' }]"
      :ui="{ root: 'min-h-0 px-4 py-8', statusMessage: 'text-2xl', message: 'text-sm' }"
    />
  </div>

  <UTheme
    v-else-if="props.name === 'theme'"
    :props="scopedThemeProps"
  >
    <div class="grid gap-3 rounded-sm border border-default bg-muted p-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <UAlert
        icon="i-lucide-info"
        title="Theme scope"
        description="Use scoped theme props for controlled demos and reusable layer previews."
      />
      <div class="flex flex-wrap items-center gap-2">
        <UBadge label="Scoped" />
        <UButton label="Preview" icon="i-lucide-eye" />
      </div>
    </div>
  </UTheme>

  <ClientOnly v-else-if="props.name === 'system-appearance-pattern'">
    <div class="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
      <div class="space-y-4">
        <div class="space-y-2">
          <p class="font-semibold text-highlighted">
            Header control
          </p>
          <UColorModeButton />
        </div>
        <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
          <UColorModeSwitch />
          <UColorModeSelect />
        </div>
      </div>
      <UTheme :props="scopedThemeProps">
        <div class="grid gap-3 rounded-sm border border-default bg-muted p-4">
          <UAlert
            icon="i-lucide-info"
            title="Theme scope"
            description="Use scoped theme props for controlled previews and reusable layer examples."
          />
          <div class="flex flex-wrap items-center gap-2">
            <UBadge label="Scoped" />
            <UButton label="Preview" icon="i-lucide-eye" />
          </div>
        </div>
      </UTheme>
    </div>
    <template #fallback>
      <div class="rounded-sm border border-default bg-muted p-4 text-sm text-muted">
        System controls load on the client.
      </div>
    </template>
  </ClientOnly>

  <div v-else-if="props.name === 'system-assets-pattern'" class="space-y-5">
    <div class="grid gap-5 lg:grid-cols-2">
      <div class="space-y-3">
        <p class="font-semibold text-highlighted">
          Wordmark variants
        </p>
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="flex min-h-28 items-center justify-center rounded-sm border border-default bg-default p-5">
            <img
              v-if="props.context.assets.wordmark"
              :src="props.context.assets.wordmark"
              :alt="`${props.context.copy.brandLabel} wordmark on light surface`"
              class="h-6 w-auto"
            >
            <span v-else class="font-semibold text-highlighted">{{ props.context.copy.brandLabel }}</span>
          </div>
          <div class="flex min-h-28 items-center justify-center rounded-sm border border-default bg-inverted p-5 text-inverted">
            <img
              v-if="props.context.assets.wordmarkInverse"
              :src="props.context.assets.wordmarkInverse"
              :alt="`${props.context.copy.brandLabel} inverse wordmark on dark surface`"
              class="h-6 w-auto"
            >
            <span v-else class="font-semibold">{{ props.context.copy.brandLabel }}</span>
          </div>
        </div>
      </div>
      <div class="space-y-3">
        <p class="font-semibold text-highlighted">
          Symbol object
        </p>
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="flex min-h-28 items-center justify-center rounded-sm border border-default bg-default p-5">
            <img
              v-if="props.context.assets.symbol"
              :src="props.context.assets.symbol"
              :alt="`${props.context.copy.brandLabel} symbol on light surface`"
              class="size-16"
            >
            <UAvatar
              v-else
              :text="props.context.copy.brandLabel.slice(0, 2).toUpperCase()"
              size="xl"
            />
          </div>
          <div class="flex min-h-28 items-center justify-center rounded-sm border border-default bg-inverted p-5 text-inverted">
            <img
              v-if="props.context.assets.symbol"
              :src="props.context.assets.symbol"
              :alt="`${props.context.copy.brandLabel} symbol on dark surface`"
              class="size-16"
            >
            <UAvatar
              v-else
              :text="props.context.copy.brandLabel.slice(0, 2).toUpperCase()"
              size="xl"
            />
          </div>
        </div>
      </div>
    </div>
    <p class="text-sm text-muted">
      Wordmarks can swap for contrast. Symbols should remain legible across light and dark surfaces.
    </p>
  </div>

  <div v-else-if="props.name === 'system-access-pattern'" class="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
    <div class="space-y-4">
      <UFormField
        label="Language"
        help="Locale controls stay close to language-sensitive content."
      >
        <ULocaleSelect v-model="locale" :locales="locales" />
      </UFormField>
      <div class="overflow-hidden rounded-sm border border-default">
        <UError
          :error="{ statusCode: 404, statusMessage: 'Pattern not found', message: 'The requested component pattern is not available yet.' }"
          :links="[{ label: 'Open components', to: props.context.paths.components, color: 'neutral', variant: 'outline' }]"
          :ui="{ root: 'min-h-0 px-4 py-6', statusMessage: 'text-xl', message: 'text-sm' }"
        />
      </div>
    </div>
    <ClientOnly>
      <UAuthForm
        title="Access project"
        description="Use clear labels and one primary path."
        icon="i-lucide-lock-keyhole"
        :fields="authFields"
        :submit="{ label: 'Continue' }"
      />
      <template #fallback>
        <div class="rounded-sm border border-default bg-muted p-4 text-sm text-muted">
          Auth form preview
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
