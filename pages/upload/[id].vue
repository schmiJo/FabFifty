<template>
    <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <!-- Festliche Hintergrund-Animation -->
        <div class="absolute inset-0 overflow-hidden">
            <div class="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div class="absolute top-20 right-20 w-1 h-1 bg-pink-400 rounded-full animate-ping"></div>
            <div class="absolute bottom-32 left-20 w-3 h-3 bg-yellow-300 rounded-full animate-bounce"></div>
            <div class="absolute bottom-20 right-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        </div>

        <div class="relative z-10 p-6 max-w-md mx-auto">
            <!-- Zurück-Button und Header -->
            <div class="mb-6">
                <button @click="goBack"
                    class="flex items-center text-yellow-300 hover:text-yellow-200 transition-colors mb-6 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 hover:border-yellow-400/50">
                    <i class="fas fa-arrow-left mr-3 text-lg"></i>
                    <span class="font-medium">Zurück zu den Kategorien</span>
                </button>

                <div
                    class="text-center bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl mb-6">
                    <div class="mb-4">
                        <i :class="getCategoryIcon(categoryId)" class="text-4xl text-yellow-400 mb-3 block"></i>
                    </div>
                    <h1 class="text-2xl font-bold text-white mb-3 font-playfair">{{ categoryName }}</h1>
                    <p class="text-yellow-200 text-sm">Lade deine schönsten Fotos für diese Kategorie hoch</p>
                </div>
            </div>

            <!-- Upload-Pfad Information -->
            <div
                class="mb-6 p-4 bg-gradient-to-r from-yellow-400/10 to-yellow-600/5 backdrop-blur-sm rounded-xl border border-yellow-400/30">
                <div class="text-sm">
                    <span class="font-medium text-yellow-200">
                        <i class="fas fa-folder text-yellow-400 mr-2"></i>
                        Upload-Ziel:
                    </span>
                    <span class="text-yellow-100 ml-2 font-mono">{{ uploadPath }}</span>
                </div>
            </div>

            <!-- Photo Uploader Component -->
            <PhotoUploader :concurrency-limit="3" :upload-path="uploadPath" :category-id="categoryId"
                :category-name="categoryName" @upload-start="onUploadStart" @upload-progress="onUploadProgress"
                @upload-complete="onUploadComplete" @upload-error="onUploadError" />

            <!-- Session-Zusammenfassung -->
            <div v-if="totalUploads > 0"
                class="mt-6 p-5 bg-gradient-to-r from-green-400/10 to-emerald-600/5 backdrop-blur-sm rounded-xl border border-green-400/30">
                <h3 class="text-lg font-semibold text-green-200 mb-4 flex items-center">
                    <i class="fas fa-chart-bar text-green-400 mr-3"></i>
                    Session-Übersicht
                </h3>
                <div class="space-y-2">
                    <p class="text-sm text-green-100 flex justify-between">
                        <span>Verarbeitete Dateien:</span>
                        <span class="font-semibold">{{ totalUploads }}</span>
                    </p>
                    <p class="text-sm text-green-100 flex justify-between">
                        <span>Erfolgreich hochgeladen:</span>
                        <span class="font-semibold text-green-300">{{ successfulUploads }}</span>
                    </p>
                    <p v-if="totalUploads - successfulUploads > 0" class="text-sm text-red-200 flex justify-between">
                        <span>Fehlgeschlagen:</span>
                        <span class="font-semibold text-red-300">{{ totalUploads - successfulUploads }}</span>
                    </p>
                </div>
            </div>

            <!-- Fehlermeldungen -->
            <div v-if="errors.length > 0" class="mt-4 space-y-3">
                <div v-for="(error, index) in errors" :key="index"
                    class="p-4 bg-gradient-to-r from-red-400/10 to-red-600/5 backdrop-blur-sm rounded-xl border border-red-400/30">
                    <div class="flex items-start">
                        <i class="fas fa-exclamation-triangle text-red-400 mr-3 mt-1 flex-shrink-0"></i>
                        <p class="text-sm text-red-200">{{ error }}</p>
                    </div>
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

// Funktion für passende Icons zu jeder Kategorie
function getCategoryIcon(categoryId: string): string {
    const iconMap: Record<string, string> = {
        'bester-teller-buffet': 'fas fa-utensils',
        'coolster-tanzschritt': 'fas fa-music',
        'dresscode-nicht-erfuellt': 'fas fa-tshirt',
        'kreativster-schnappschuss': 'fas fa-camera-retro',
        'lieblingsbild-geburtstagskinder': 'fas fa-heart',
        'most-impressive-dress': 'fas fa-crown',
        'pose-ohne-absicht': 'fas fa-laugh',
        'romantischster-moment': 'fas fa-kiss',
        'schoenstes-gruppenfoto': 'fas fa-users'
    }
    return iconMap[categoryId] || 'fas fa-camera'
}

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
    title: `Upload - ${categoryName} | Fab Fifty`
})
</script>

<style scoped>
.font-playfair {
    font-family: 'Playfair Display', serif;
}
</style>
