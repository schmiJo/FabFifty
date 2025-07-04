<template>
    <div class="min-h-screen bg-gray-50">
        <div class="p-4 max-w-md mx-auto">
            <!-- Back Button and Header -->
            <div class="mb-6">
                <button @click="goBack"
                    class="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7">
                        </path>
                    </svg>
                    Back to Categories
                </button>

                <h1 class="text-2xl font-bold text-center text-gray-800">{{ categoryName }}</h1>
                <p class="text-center text-gray-600 mt-2">Upload your photos for this category</p>
            </div>

            <!-- Upload Path Info -->
            <div class="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="text-sm">
                    <span class="font-medium text-blue-800">Upload destination:</span>
                    <span class="text-blue-600 ml-2">{{ uploadPath }}</span>
                </div>
            </div>

            <!-- Photo Uploader Component -->
            <PhotoUploader :concurrency-limit="3" :upload-path="uploadPath" :category-id="categoryId"
                :category-name="categoryName" @upload-start="onUploadStart" @upload-progress="onUploadProgress"
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
                <div v-for="(error, index) in errors" :key="index"
                    class="p-3 bg-red-50 border border-red-200 rounded-lg">
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

// Get route parameters
const route = useRoute()
const categoryId = route.params.id as string
const uploadPath = route.query.path as string || `images/${categoryId}`
const categoryName = route.query.name as string || categoryId

// Validate required parameters
if (!categoryId) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
    })
}

// State for tracking uploads across sessions
const totalUploads = ref(0)
const successfulUploads = ref(0)
const errors = ref<string[]>([])

// Event handlers
function onUploadStart(files: File[]) {
    console.log(`📤 Upload started for ${files.length} files`)
    totalUploads.value += files.length
}

function onUploadProgress(completedCount: number, totalCount: number) {
    console.log(`📈 Upload progress: ${completedCount}/${totalCount}`)
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

function goBack() {
    navigateTo('/')
}

// Set page title
useHead({
    title: `Upload - ${categoryName}`
})
</script>
