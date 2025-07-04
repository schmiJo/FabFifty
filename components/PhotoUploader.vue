<template>
    <div>
        <!-- Category Info (if provided) -->
        <div v-if="categoryName"
            class="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="font-medium text-blue-800">{{ categoryName }}</h3>
                    <p class="text-sm text-blue-600">{{ uploadPath }}</p>
                </div>
                <div class="text-right">
                    <p class="text-xs text-blue-500">Category ID:</p>
                    <p class="text-xs font-mono text-blue-600">{{ categoryId }}</p>
                </div>
            </div>
        </div>

        <!-- File Input -->
        <div class="mb-6">
            <label class="block w-full">
                <div
                    class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors">
                    <div class="text-gray-600 mb-2">
                        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                            </path>
                        </svg>
                        <p class="text-sm">Tap to select photos</p>
                        <p class="text-xs text-gray-500 mt-1">Multiple photos supported</p>
                    </div>
                </div>
                <input type="file" multiple accept="image/*" @change="handleFiles" class="hidden" />
            </label>
        </div>

        <!-- Upload Progress -->
        <div v-if="uploads.length > 0" class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-800">Upload Progress</h2>

            <div v-for="upload in uploads" :key="upload.id" class="bg-white rounded-lg p-4 shadow-sm border">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700 truncate flex-1 mr-2">
                        {{ upload.fileName }}
                    </span>
                    <span class="text-xs text-gray-500">
                        {{ upload.progress }}%
                    </span>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        :style="{ width: upload.progress + '%' }"></div>
                </div>

                <!-- Status -->
                <div class="flex items-center justify-between">
                    <span class="text-xs" :class="{
                        'text-blue-600': upload.status === 'uploading',
                        'text-green-600': upload.status === 'completed',
                        'text-red-600': upload.status === 'error'
                    }">
                        {{ upload.status === 'uploading' ? 'Uploading...' :
                            upload.status === 'completed' ? 'Completed' :
                                upload.status === 'error' ? 'Error' : 'Waiting...' }}
                    </span>

                    <a v-if="upload.status === 'completed' && upload.publicUrl" :href="upload.publicUrl" target="_blank"
                        class="text-xs text-blue-600 underline">
                        View
                    </a>
                </div>
            </div>

            <!-- Overall Progress -->
            <div class="bg-white rounded-lg p-4 shadow-sm border">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">
                        Overall Progress
                    </span>
                    <span class="text-xs text-gray-500">
                        {{ completedUploads }}/{{ uploads.length }}
                    </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full transition-all duration-300"
                        :style="{ width: overallProgress + '%' }"></div>
                </div>
            </div>
        </div>

        <!-- Success Message -->
        <div v-if="allUploadsComplete && uploads.length > 0"
            class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <p class="text-sm text-green-800">All photos uploaded successfully!</p>
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

// Props
interface Props {
    concurrencyLimit?: number
    uploadPath?: string
    categoryId?: string
    categoryName?: string
}

const props = withDefaults(defineProps<Props>(), {
    concurrencyLimit: 3,
    uploadPath: 'images'
})

// Emits
const emit = defineEmits<{
    uploadStart: [files: File[]]
    uploadProgress: [completedCount: number, totalCount: number]
    uploadComplete: [uploads: Upload[]]
    uploadError: [error: string]
}>()

// State
const uploads = ref<Upload[]>([])

// Computed
const completedUploads = computed(() =>
    uploads.value.filter(upload => upload.status === 'completed').length
)

const overallProgress = computed(() => {
    if (uploads.value.length === 0) return 0
    const totalProgress = uploads.value.reduce((sum, upload) => sum + upload.progress, 0)
    return Math.round(totalProgress / uploads.value.length)
})

const allUploadsComplete = computed(() =>
    uploads.value.length > 0 && uploads.value.every(upload => upload.status === 'completed')
)

// Watch for completion
watch(completedUploads, (newCount) => {
    emit('uploadProgress', newCount, uploads.value.length)

    if (allUploadsComplete.value) {
        emit('uploadComplete', uploads.value)
    }
})

// Methods
function generateId() {
    return Math.random().toString(36).substr(2, 9)
}

async function handleFiles(event: Event) {
    const input = event.target as HTMLInputElement
    const files = Array.from(input.files || [])

    if (files.length === 0) return

    console.log(`🔄 Starting upload for ${files.length} files`)
    console.log(`📁 Upload path: ${props.uploadPath}`)
    console.log(`🏷️ Category: ${props.categoryName} (${props.categoryId})`)

    // Emit upload start event
    emit('uploadStart', files)

    // Create upload objects
    const newUploads: Upload[] = files.map(file => ({
        id: generateId(),
        fileName: file.name,
        file,
        progress: 0,
        status: 'waiting' as const
    }))

    uploads.value = [...uploads.value, ...newUploads]

    // Upload files concurrently (but limit concurrency to avoid overwhelming the server)
    const chunks = []

    for (let i = 0; i < newUploads.length; i += props.concurrencyLimit) {
        chunks.push(newUploads.slice(i, i + props.concurrencyLimit))
    }

    for (const chunk of chunks) {
        await Promise.all(chunk.map(upload => uploadFile(upload)))
    }

    // Clear input
    input.value = ''
}

async function uploadFile(uploadObj: Upload) {
    try {
        // Update status to uploading - find and update the object in the reactive array
        const uploadIndex = uploads.value.findIndex(u => u.id === uploadObj.id)
        if (uploadIndex !== -1) {
            uploads.value[uploadIndex].status = 'uploading'
            uploads.value[uploadIndex].progress = 10
        }

        console.log('🔄 Starting upload for file:', uploadObj.fileName)

        // Step 1: Get the presigned URL from the backend
        const res = await $fetch('/api/upload-url', {
            method: 'POST',
            body: {
                fileName: uploadObj.fileName,
                fileType: uploadObj.file.type,
                path: props.uploadPath
            }
        })

        // Update progress
        if (uploadIndex !== -1) {
            uploads.value[uploadIndex].progress = 30
        }
        console.log('📋 Got signed URL response:', res)

        // Step 2: Upload the file using the signed URL with XMLHttpRequest for progress tracking
        await uploadWithProgress(uploadObj, res)

    } catch (error) {
        console.error('❌ Upload failed for file:', uploadObj.fileName, error)
        const uploadIndex = uploads.value.findIndex(u => u.id === uploadObj.id)
        if (uploadIndex !== -1) {
            uploads.value[uploadIndex].status = 'error'
            uploads.value[uploadIndex].error = error instanceof Error ? error.message : 'Upload failed'
        }
        emit('uploadError', `Failed to upload ${uploadObj.fileName}: ${error instanceof Error ? error.message : 'Upload failed'}`)
    }
}

function uploadWithProgress(uploadObj: Upload, signedUrlData: any): Promise<void> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 70) // 30% already done, so 70% remaining
                const newProgress = 30 + percentComplete

                // Update progress in reactive array
                const uploadIndex = uploads.value.findIndex(u => u.id === uploadObj.id)
                if (uploadIndex !== -1) {
                    uploads.value[uploadIndex].progress = newProgress
                }
            }
        })

        xhr.addEventListener('load', async () => {
            const uploadIndex = uploads.value.findIndex(u => u.id === uploadObj.id)

            if (xhr.status === 200) {
                // Update in reactive array
                if (uploadIndex !== -1) {
                    uploads.value[uploadIndex].progress = 100
                    uploads.value[uploadIndex].status = 'completed'
                    uploads.value[uploadIndex].publicUrl = signedUrlData.publicUrl
                }

                console.log('✅ Upload successful for:', uploadObj.fileName)
                console.log('🔗 File available at:', signedUrlData.publicUrl)

                // Optional: test if it's publicly accessible
                setTimeout(async () => {
                    try {
                        const testResponse = await fetch(signedUrlData.publicUrl, { method: 'HEAD' })
                        console.log(`🧪 File accessibility test for ${uploadObj.fileName}:`,
                            testResponse.status === 200 ? '✅ ACCESSIBLE' : '❌ NOT ACCESSIBLE')
                    } catch (error) {
                        console.error(`🧪 File accessibility test failed for ${uploadObj.fileName}:`, error)
                    }
                }, 2000)

                resolve()
            } else {
                console.error('❌ Upload failed with status:', xhr.status)

                // Update error in reactive array
                if (uploadIndex !== -1) {
                    uploads.value[uploadIndex].status = 'error'
                    uploads.value[uploadIndex].error = `Upload failed with status: ${xhr.status}`
                }
                reject(new Error(`Upload failed with status: ${xhr.status}`))
            }
        })

        xhr.addEventListener('error', () => {
            console.error('❌ Upload error for file:', uploadObj.fileName)

            // Update error in reactive array
            const uploadIndex = uploads.value.findIndex(u => u.id === uploadObj.id)
            if (uploadIndex !== -1) {
                uploads.value[uploadIndex].status = 'error'
                uploads.value[uploadIndex].error = 'Network error during upload'
            }
            reject(new Error('Network error during upload'))
        })

        // Configure and send the request
        xhr.open('PUT', signedUrlData.url)
        xhr.setRequestHeader('Content-Type', uploadObj.file.type)
        xhr.setRequestHeader('x-amz-acl', 'public-read')
        xhr.send(uploadObj.file)
    })
}

// Expose methods for parent component
defineExpose({
    clearUploads: () => {
        uploads.value = []
    },
    getUploads: () => uploads.value,
    getCompletedUploads: () => uploads.value.filter(upload => upload.status === 'completed')
})
</script>
