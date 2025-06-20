<template>
  <div class="space-y-1">
    <label class="block text-sm font-medium text-gray-700">Attachments (Optional)</label>
    <div v-if="file" class="flex items-center justify-between bg-gray-50 rounded-md p-2">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
        <a :href="fileUrl" target="_blank" class="text-sm text-blue-600 hover:underline cursor-pointer">
          {{ file.name }}
        </a>
      </div>
      <button @click="removeFile" class="text-gray-400 hover:text-gray-600 p-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
    <div class="mt-1">
      <label class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
        <input type="file" @change="onFileChange" class="sr-only">
        <svg class="-ml-1 mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        Choose File
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskFileUpload',
  props: {
    value: File,
  },
  data() {
    return {
      file: null,
      fileUrl: null,
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.file = newVal
          this.setFileUrl(newVal)
        } else {
          this.file = null
          this.fileUrl = null
        }
      }
    }
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0]
      if (file) {
        this.file = file
        this.setFileUrl(file)
        this.$emit('input', file)
      }
    },
    removeFile() {
      if (this.fileUrl) {
        URL.revokeObjectURL(this.fileUrl)
      }
      this.file = null
      this.fileUrl = null
      this.$emit('input', null)
    },
    setFileUrl(file) {
      if (this.fileUrl) {
        URL.revokeObjectURL(this.fileUrl)
      }
      this.fileUrl = URL.createObjectURL(file)
    }
  },
  beforeDestroy() {
    if (this.fileUrl) {
      URL.revokeObjectURL(this.fileUrl)
    }
  }
}
</script>
