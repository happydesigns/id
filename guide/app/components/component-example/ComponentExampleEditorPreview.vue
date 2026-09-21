<template>
  <div class="overflow-hidden rounded-sm border border-default bg-default">
    <div class="flex flex-wrap items-center gap-1 border-b border-default bg-muted px-3 py-2">
      <UButton
        aria-label="Undo"
        icon="i-lucide-undo-2"
        color="neutral"
        variant="ghost"
        size="xs"
      />
      <UButton
        aria-label="Redo"
        icon="i-lucide-redo-2"
        color="neutral"
        variant="ghost"
        size="xs"
      />
      <USeparator
        orientation="vertical"
        class="mx-1 h-5"
      />
      <UBadge
        color="primary"
        variant="subtle"
      >
        H2
      </UBadge>
      <UButton
        aria-label="Bulleted list"
        icon="i-lucide-list"
        color="neutral"
        variant="ghost"
        size="xs"
      />
      <UButton
        aria-label="Quote"
        icon="i-lucide-quote"
        color="neutral"
        variant="ghost"
        size="xs"
      />
      <USeparator
        orientation="vertical"
        class="mx-1 h-5"
      />
      <UButton
        aria-label="Bold"
        icon="i-lucide-bold"
        color="neutral"
        variant="ghost"
        size="xs"
      />
      <UButton
        aria-label="Link"
        icon="i-lucide-link"
        color="neutral"
        variant="ghost"
        size="xs"
      />
      <UButton
        aria-label="Image"
        icon="i-lucide-image"
        color="neutral"
        variant="ghost"
        size="xs"
      />
    </div>

    <div class="space-y-4 p-4 sm:p-5">
      <div class="relative rounded-sm border border-default bg-elevated p-4 pl-11">
        <UButton
          aria-label="Move block"
          icon="i-lucide-grip-vertical"
          color="neutral"
          variant="ghost"
          size="xs"
          square
          class="absolute left-2 top-3"
        />
        <p class="text-lg font-semibold text-highlighted">
          Component note
        </p>
        <p class="mt-2 max-w-prose text-sm text-muted">
          Use visible structure before adding brand expression.
        </p>
      </div>

      <div class="rounded-sm border border-dashed border-default bg-muted px-3 py-2 text-sm text-muted">
        <span class="font-mono text-primary">/</span>
        Add callout, checklist, or implementation note.
      </div>
    </div>
  </div>
</template>
