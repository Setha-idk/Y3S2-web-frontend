<template>
  <div class="flex flex-col items-center justify-center py-8">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
    <p class="text-gray-500"><slot>Loading...</slot></p>
  </div>
</template>

<script setup>
// No script needed for this simple spinner
</script>
