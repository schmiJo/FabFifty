<template>
    <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <!-- Festliche Hintergrund-Animation -->
        <div class="absolute inset-0 overflow-hidden">
            <div class="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div class="absolute top-20 right-20 w-1 h-1 bg-pink-400 rounded-full animate-ping"></div>
            <div class="absolute bottom-32 left-20 w-3 h-3 bg-yellow-300 rounded-full animate-bounce"></div>
            <div class="absolute bottom-20 right-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        </div>

        <div class="relative z-10 p-4 max-w-4xl mx-auto">
            <!-- Header mit Zurück-Button -->
            <div class="mb-8">
                <button @click="goBack"
                    class="flex items-center text-yellow-300 hover:text-yellow-200 transition-colors mb-6 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 hover:border-yellow-400/50">
                    <i class="fas fa-arrow-left mr-3 text-lg"></i>
                    <span class="font-medium">Zurück zu den Kategorien</span>
                </button>

                <div
                    class="text-center bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div class="mb-4">
                        <i :class="getCategoryIcon(categoryId)" class="text-5xl text-yellow-400 mb-3 block"></i>
                    </div>
                    <h1 class="text-3xl font-bold text-white mb-3 font-playfair">{{ categoryName }}</h1>
                    <p class="text-yellow-200 text-lg mb-4">Galerie</p>

                    <!-- Statistiken -->
                    <div v-if="!loading" class="flex justify-center space-x-6 text-sm">
                        <div class="text-center">
                            <p class="text-2xl font-bold text-yellow-400">{{ images.length }}</p>
                            <p class="text-yellow-200">{{ images.length === 1 ? 'Foto' : 'Fotos' }}</p>
                        </div>

                    </div>
                </div>
            </div>

            <!-- Upload Button - prominent platziert -->
            <div class="mb-8 text-center">
                <NuxtLink
                    :to="`/upload/${categoryId}?path=${encodeURIComponent(uploadPath)}&name=${encodeURIComponent(categoryName)}`"
                    class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-yellow-300 hover:to-yellow-400">
                    <i class="fas fa-cloud-upload-alt text-2xl mr-3"></i>
                    <div class="text-left">
                        <div class="text-lg">Neue Fotos hochladen</div>
                        <div class="text-sm opacity-80">Füge deine Erinnerungen hinzu</div>
                    </div>
                </NuxtLink>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-16">
                <div
                    class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-full mb-4">
                    <i class="fas fa-spinner fa-spin text-2xl text-yellow-400"></i>
                </div>
                <p class="text-white text-lg">Lade Bilder...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-16">
                <div
                    class="bg-gradient-to-r from-red-400/10 to-red-600/5 backdrop-blur-sm rounded-xl p-6 border border-red-400/30 inline-block">
                    <i class="fas fa-exclamation-triangle text-3xl text-red-400 mb-4 block"></i>
                    <p class="text-red-200 text-lg mb-2">Fehler beim Laden der Bilder</p>
                    <p class="text-red-100 text-sm">{{ error }}</p>
                    <button @click="loadImages"
                        class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                        <i class="fas fa-retry mr-2"></i>
                        Erneut versuchen
                    </button>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="images.length === 0" class="text-center py-16">
                <div
                    class="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 inline-block">
                    <i class="fas fa-images text-6xl text-gray-400 mb-6 block"></i>
                    <h3 class="text-2xl font-semibold text-white mb-4">Noch keine Fotos vorhanden</h3>
                    <p class="text-gray-300 mb-6">Sei der Erste, der Erinnerungen in dieser Kategorie teilt!</p>
                    <NuxtLink
                        :to="`/upload/${categoryId}?path=${encodeURIComponent(uploadPath)}&name=${encodeURIComponent(categoryName)}`"
                        class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                        <i class="fas fa-plus mr-2"></i>
                        Erstes Foto hochladen
                    </NuxtLink>
                </div>
            </div>

            <!-- Bilder-Galerie -->
            <div v-else class="space-y-6">
                <!-- Masonry Grid für die Bilder -->
                <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                    <div v-for="(image, index) in images" :key="image.key"
                        class="break-inside-avoid bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                        @click="openLightbox(index)">

                        <!-- Bild -->
                        <div class="relative">
                            <img :src="image.url" :alt="image.fileName" class="w-full h-auto object-cover"
                                loading="lazy" @error="handleImageError(image)">

                            <!-- Overlay mit Informationen -->
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <div class="text-white">
                                    <p class="text-sm font-medium truncate mb-1">{{ image.fileName }}</p>
                                    <p class="text-xs text-gray-300">{{ formatDate(image.lastModified) }}</p>
                                </div>
                            </div>

                            <!-- Zoom Icon -->
                            <div
                                class="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <i class="fas fa-search-plus text-white text-sm"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Lightbox Modal -->
            <div v-if="lightboxOpen"
                class="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center p-4"
                @click="closeLightbox">

                <div class="relative flex-1 flex flex-col items-center justify-center max-w-7xl max-h-full">
                    <!-- Close Button -->
                    <button @click="closeLightbox"
                        class="absolute top-4 right-4 z-10 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                        <i class="fas fa-times text-xl"></i>
                    </button>

                    <!-- Navigation Arrows -->
                    <button v-if="currentImageIndex > 0" @click.stop="previousImage"
                        class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                        <i class="fas fa-chevron-left text-xl"></i>
                    </button>

                    <button v-if="currentImageIndex < images.length - 1" @click.stop="nextImage"
                        class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                        <i class="fas fa-chevron-right text-xl"></i>
                    </button>

                    <!-- Image Container -->
                    <div class="flex-1 flex items-center justify-center mb-4">
                        <img v-if="currentImage" :src="currentImage.url" :alt="currentImage.fileName"
                            class="max-w-full max-h-full object-contain rounded-lg" @click.stop>
                    </div>
                </div>

                <!-- Image Info - Now at the bottom of the screen -->
                <div class="w-full max-w-7xl bg-black/50 backdrop-blur-sm rounded-xl p-4 text-white" @click.stop>
                    <div class="flex items-center justify-between">
                        <div>
                            <!--Bitte hier upvoting knopf und coutner einfügen-->
                            <p class="text-sm text-gray-300">{{ formatDate(currentImage?.lastModified) }}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-300">{{ currentImageIndex + 1 }} / {{ images.length }}</p>
                            <a :href="currentImage?.url" target="_blank"
                                class="text-yellow-400 hover:text-yellow-300 transition-colors text-sm">
                                <i class="fas fa-external-link-alt mr-1"></i>
                                Original öffnen
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface ImageData {
    key: string
    url: string
    lastModified?: string
    size?: number
    fileName: string
}

// Route Parameter
const route = useRoute()
const categoryId = route.params.id as string
const uploadPath = route.query.path as string || `images/${categoryId}`
const categoryName = route.query.name as string || categoryId

// State
const loading = ref(true)
const error = ref<string | null>(null)
const images = ref<ImageData[]>([])
const lightboxOpen = ref(false)
const currentImageIndex = ref(0)

// Computed
const currentImage = computed(() => images.value[currentImageIndex.value])

const totalSizeMB = computed(() => {
    const totalBytes = images.value.reduce((sum, img) => sum + (img.size || 0), 0)
    return (totalBytes / (1024 * 1024)).toFixed(1)
})

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

// Methods
async function loadImages() {
    try {
        loading.value = true
        error.value = null

        console.log(`🔍 Loading images for path: ${uploadPath}`)

        const response = await $fetch('/api/list-images', {
            query: { path: uploadPath }
        }) as { images: ImageData[], success: boolean }

        if (response.success) {
            images.value = response.images
            console.log(`📸 Loaded ${response.images.length} images`)
        } else {
            throw new Error('Failed to load images')
        }
    } catch (err) {
        console.error('❌ Error loading images:', err)
        error.value = err instanceof Error ? err.message : 'Fehler beim Laden der Bilder'
    } finally {
        loading.value = false
    }
}

function formatDate(dateString?: string): string {
    if (!dateString) return 'Unbekannt'

    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

function handleImageError(image: ImageData) {
    console.error(`❌ Failed to load image: ${image.url}`)
}

function openLightbox(index: number) {
    currentImageIndex.value = index
    lightboxOpen.value = true
    document.body.style.overflow = 'hidden'
}

function closeLightbox() {
    lightboxOpen.value = false
    document.body.style.overflow = 'auto'
}

function nextImage() {
    if (currentImageIndex.value < images.value.length - 1) {
        currentImageIndex.value++
    }
}

function previousImage() {
    if (currentImageIndex.value > 0) {
        currentImageIndex.value--
    }
}

function goBack() {
    navigateTo('/')
}

// Keyboard Navigation für Lightbox
function handleKeydown(event: KeyboardEvent) {
    if (!lightboxOpen.value) return

    switch (event.key) {
        case 'Escape':
            closeLightbox()
            break
        case 'ArrowRight':
            nextImage()
            break
        case 'ArrowLeft':
            previousImage()
            break
    }
}

// Lifecycle
onMounted(() => {
    loadImages()
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'auto'
})

// Page Meta
useHead({
    title: `${categoryName} - Galerie | Fab Fifty`,
    meta: [
        { name: 'description', content: `Entdecke die schönsten Fotos in der Kategorie "${categoryName}" vom 50. Geburtstag.` }
    ]
})
</script>

<style scoped>
.font-playfair {
    font-family: 'Playfair Display', serif;
}

/* Masonry Grid Fallback für bessere Browser-Unterstützung */
@supports not (columns: 3) {
    .columns-1 {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
    }
}

/* Smooth Lightbox Transitions */
.lightbox-enter-active,
.lightbox-leave-active {
    transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
    opacity: 0;
}
</style>
