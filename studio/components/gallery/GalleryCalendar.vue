<script setup lang="ts">

</script>

<template>
<UCard :ui="{ body: 'p-3 sm:p-4' }" class="example-card">
        <h2 class="sr-only">Choose a date</h2><UCalendar aria-label="Choose a date" :year-controls="false" class="w-full" />
      </UCard>
</template>
