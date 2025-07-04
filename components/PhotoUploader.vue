<template>
    <div>
        <!-- Category Info (if provided)
        <div v-if="categoryName"
            class="mb-6 p-4 bg-gradient-to-r from-purple-400/10 to-blue-400/5 backdrop-blur-sm rounded-xl border border-purple-400/30">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="font-semibold text-purple-200 flex items-center">
                        <i class="fas fa-tag text-purple-300 mr-2"></i>
                        {{ categoryName }}
                    </h3>
                    <p class="text-sm text-purple-100 mt-1">{{ uploadPath }}</p>
                </div>
                <div class="text-right">
                    <p class="text-xs text-purple-300">Kategorie-ID:</p>
                    <p class="text-xs font-mono text-purple-200">{{ categoryId }}</p>
                </div>
            </div>
        </div>
 -->
        <!-- File Input -->
        <div class="mb-6">
            <label class="block w-full">
                <div
                    class="border-2 border-dashed border-yellow-400/50 bg-gradient-to-r from-yellow-400/5 to-yellow-600/10 backdrop-blur-sm rounded-2xl p-8 text-center cursor-pointer hover:border-yellow-400 hover:bg-gradient-to-r hover:from-yellow-400/10 hover:to-yellow-600/15 transition-all duration-300 transform hover:scale-[1.02]">
                    <div class="text-yellow-200 mb-3">
                        <i class="fas fa-cloud-upload-alt text-5xl text-yellow-400 mb-4 block"></i>
                        <p class="text-lg font-medium">Fotos auswählen</p>
                        <p class="text-sm text-yellow-100 mt-2">Mehrere Fotos werden unterstützt</p>
                        <p class="text-xs text-yellow-300 mt-1">
                            <i class="fas fa-magic mr-1"></i>
                            Deine Erinnerungen warten darauf geteilt zu werden
                        </p>
                    </div>
                </div>
                <input type="file" multiple accept="image/*" @change="handleFiles" class="hidden" />
            </label>
        </div>

        <!-- Upload Progress -->
        <div v-if="uploads.length > 0" class="space-y-4">
            <h2 class="text-xl font-semibold text-white mb-4 flex items-center">
                <i class="fas fa-tasks text-yellow-400 mr-3"></i>
                Upload-Fortschritt
            </h2>

            <div v-for="upload in uploads" :key="upload.id"
                class="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-medium text-white truncate flex-1 mr-3 flex items-center">
                        <i class="fas fa-image text-yellow-400 mr-2"></i>
                        {{ upload.fileName }}
                    </span>
                    <span class="text-xs text-yellow-200 bg-yellow-400/20 px-2 py-1 rounded-full">
                        {{ upload.progress }}%
                    </span>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-gray-700/50 rounded-full h-3 mb-3 overflow-hidden">
                    <div class="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500 relative"
                        :style="{ width: upload.progress + '%' }">
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse">
                        </div>
                    </div>
                </div>

                <!-- Status -->
                <div class="flex items-center justify-between">
                    <span class="text-sm flex items-center" :class="{
                        'text-blue-300': upload.status === 'uploading',
                        'text-green-300': upload.status === 'completed',
                        'text-red-300': upload.status === 'error',
                        'text-gray-300': upload.status === 'waiting'
                    }">
                        <i class="mr-2" :class="{
                            'fas fa-spinner fa-spin': upload.status === 'uploading',
                            'fas fa-check-circle': upload.status === 'completed',
                            'fas fa-exclamation-circle': upload.status === 'error',
                            'fas fa-clock': upload.status === 'waiting'
                        }"></i>
                        {{ upload.status === 'uploading' ? 'Wird hochgeladen...' :
                            upload.status === 'completed' ? 'Erfolgreich!' :
                                upload.status === 'error' ? 'Fehler aufgetreten' : 'Wartet...' }}
                    </span>

                    <a v-if="upload.status === 'completed' && upload.publicUrl" :href="upload.publicUrl" target="_blank"
                        class="text-sm text-yellow-300 hover:text-yellow-200 underline flex items-center transition-colors">
                        <i class="fas fa-external-link-alt mr-1"></i>
                        Ansehen
                    </a>
                </div>
            </div>

            <!-- Overall Progress -->
            <div
                class="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-lg">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-lg font-semibold text-white flex items-center">
                        <i class="fas fa-chart-line text-yellow-400 mr-3"></i>
                        Gesamtfortschritt
                    </span>
                    <span class="text-sm text-yellow-200 bg-yellow-400/20 px-3 py-1 rounded-full">
                        {{ completedUploads }}/{{ uploads.length }}
                    </span>
                </div>
                <div class="w-full bg-gray-700/50 rounded-full h-4 overflow-hidden">
                    <div class="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-700 relative"
                        :style="{ width: overallProgress + '%' }">
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Success Message -->
        <div v-if="allUploadsComplete && uploads.length > 0"
            class="mt-6 p-5 bg-gradient-to-r from-green-400/20 to-emerald-500/10 backdrop-blur-sm rounded-xl border border-green-400/30 shadow-lg">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <i class="fas fa-party-horn text-3xl text-green-400 mr-4"></i>
                </div>
                <div>
                    <p class="text-lg font-semibold text-green-200 mb-1">
                        🎉 Fantastisch! Alle Fotos hochgeladen!
                    </p>
                    <p class="text-sm text-green-100">
                        Deine Erinnerungen sind jetzt Teil der Fab Fifty Galerie
                    </p>
                </div>
            </div>
        </div>

        <!-- Success Popup Modal -->
        <Teleport to="body">
            <div v-if="showSuccessPopup"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                <div
                    class="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 border border-yellow-400/30 shadow-2xl transform scale-100 transition-all duration-300">
                    <!-- Confetti Animation Background -->
                    <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                        <div class="absolute top-4 left-8 w-2 h-2 bg-yellow-400 rounded-full animate-bounce opacity-80">
                        </div>
                        <div class="absolute top-8 right-12 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-70">
                        </div>
                        <div
                            class="absolute bottom-8 left-12 w-3 h-3 bg-yellow-300 rounded-full animate-pulse opacity-90">
                        </div>
                        <div
                            class="absolute bottom-4 right-8 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-75">
                        </div>
                        <div class="absolute top-1/3 left-1/4 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-60">
                        </div>
                        <div
                            class="absolute top-2/3 right-1/3 w-2 h-2 bg-pink-300 rounded-full animate-pulse opacity-85">
                        </div>
                    </div>

                    <div class="relative z-10 text-center">
                        <!-- Success Icon -->
                        <div class="mb-4 sm:mb-6">
                            <div class="relative inline-block">
                                <i class="fas fa-check-circle text-5xl sm:text-6xl text-green-400 animate-pulse"></i>
                                <div class="absolute -top-2 -right-2">
                                    <i class="fas fa-sparkles text-xl sm:text-2xl text-yellow-400 animate-bounce"></i>
                                </div>
                            </div>
                        </div>

                        <!-- Success Message -->
                        <h2 class="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 font-playfair">
                            🎉 Upload erfolgreich!
                        </h2>
                        <p class="text-yellow-200 mb-2 text-sm sm:text-base">
                            Alle deine Fotos wurden erfolgreich hochgeladen!
                        </p>
                        <p class="text-yellow-100 text-xs sm:text-sm mb-6 sm:mb-8">
                            {{ uploads.length }} {{ uploads.length === 1 ? 'Foto ist' : 'Fotos sind' }} jetzt in der
                            <strong>{{ categoryName }}</strong> Galerie verfügbar.
                        </p>

                        <!-- Action Buttons -->
                        <div class="space-y-3">
                            <button @click="goToGallery"
                                class="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-yellow-300 hover:to-yellow-400 text-sm sm:text-base">
                                <i class="fas fa-images mr-2 sm:mr-3"></i>
                                Zur Galerie
                            </button>

                            <button @click="uploadMore"
                                class="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl hover:border-yellow-400/50 hover:bg-gradient-to-r hover:from-yellow-400/10 hover:to-yellow-600/5 transition-all duration-300 text-sm sm:text-base">
                                <i class="fas fa-plus mr-2"></i>
                                Weitere Fotos hochladen
                            </button>
                        </div>

                        <!-- Close Button -->
                        <button @click="closeSuccessPopup"
                            class="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                            <i class="fas fa-times text-sm"></i>
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
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
const showSuccessPopup = ref(false)

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
        // Show success popup after a short delay
        setTimeout(() => {
            showSuccessPopup.value = true
        }, 500)
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

// Success popup methods
function goToGallery() {
    showSuccessPopup.value = false
    if (props.categoryId) {
        navigateTo(`/gallery/${props.categoryId}?path=${encodeURIComponent(props.uploadPath || '')}&name=${encodeURIComponent(props.categoryName || '')}`)
    }
}

function uploadMore() {
    showSuccessPopup.value = false
    // Clear uploads to allow new uploads
    uploads.value = []
}

function closeSuccessPopup() {
    showSuccessPopup.value = false
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

<style scoped>
.font-playfair {
    font-family: 'Playfair Display', serif;
}
</style>
