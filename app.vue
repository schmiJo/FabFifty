<template>
  <div class="min-h-screen bg-gray-50">
    <div class="p-4 max-w-md mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Fab Fifty Photo Uploader</h1>

      <!-- Photo Uploader Component -->
      <PhotoUploader :concurrency-limit="3" @upload-start="onUploadStart" @upload-progress="onUploadProgress"
        @upload-complete="onUploadComplete" @upload-error="onUploadError" />

      <!-- Additional Status Information -->
      <div v-if="totalUploads > 0" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 class="text-sm font-medium text-blue-800 mb-2">Session Summary</h3>
        <p class="text-xs text-blue-600">
          Total files processed: {{ totalUploads }}
        </p>
        <p class="text-xs text-blue-600">
          Successfully uploaded: {{ successfulUploads }}
        </p>
        <p v-if="totalUploads - successfulUploads > 0" class="text-xs text-red-600">
          Failed uploads: {{ totalUploads - successfulUploads }}
        </p>
      </div>

      <!-- Error Messages -->
      <div v-if="errors.length > 0" class="mt-4 space-y-2">
        <div v-for="(error, index) in errors" :key="index" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-xs text-red-800">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Upload {
  id: string
  fileName: string
  file: File
  progress: number
  status: 'waiting' | 'uploading' | 'completed' | 'error'
  publicUrl?: string
  error?: string
}

// State for tracking uploads across sessions
const totalUploads = ref(0)
const successfulUploads = ref(0)
const errors = ref<string[]>([])

// Event handlers
function onUploadStart(files: File[]) {
  console.log(`� Upload started for ${files.length} files`)
  totalUploads.value += files.length
}

function onUploadProgress(completedCount: number, totalCount: number) {
  console.log(`� Upload progress: ${completedCount}/${totalCount}`)
}

function onUploadComplete(uploads: Upload[]) {
  const newSuccessfulUploads = uploads.filter(upload => upload.status === 'completed').length
  successfulUploads.value += newSuccessfulUploads
  console.log(`✅ Upload batch completed: ${newSuccessfulUploads} successful uploads`)
}

function onUploadError(error: string) {
  errors.value.push(error)
  console.error(`❌ Upload error: ${error}`)
}
</script>
