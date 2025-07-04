<template>
    <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <!-- Festliche Hintergrund-Animation -->
        <div class="absolute inset-0 overflow-hidden">
            <div class="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div class="absolute top-20 right-20 w-1 h-1 bg-pink-400 rounded-full animate-ping"></div>
            <div class="absolute bottom-32 left-20 w-3 h-3 bg-yellow-300 rounded-full animate-bounce"></div>
            <div class="absolute bottom-20 right-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div class="absolute top-1/3 left-1/4 w-1 h-1 bg-blue-300 rounded-full animate-ping"></div>
            <div class="absolute top-2/3 right-1/3 w-2 h-2 bg-pink-300 rounded-full animate-bounce"></div>
        </div>

        <!-- Goldene Konfetti-Partikel -->
        <div class="absolute inset-0 pointer-events-none">
            <div class="absolute top-10 left-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-pulse opacity-70"></div>
            <div class="absolute top-1/4 right-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-bounce opacity-80"></div>
            <div class="absolute bottom-1/4 left-1/3 w-1 h-1 bg-yellow-500 rounded-full animate-ping opacity-60"></div>
            <div class="absolute bottom-10 right-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-75"></div>
        </div>

        <div class="relative z-10 p-6 max-w-md mx-auto">
            <!-- Goldenes Banner mit Jubiläumstitel -->
            <div class="text-center mb-8">
                <div
                    class="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-transparent bg-clip-text mb-2">
                    <i class="fas fa-birthday-cake text-6xl mb-4 block text-yellow-400"></i>
                </div>
                <h1
                    class="text-3xl font-bold mb-3 text-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text font-playfair">
                    ✨ Fabulous Fifty ✨
                </h1>
                <div
                    class="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400/30 shadow-xl">
                    <p class="text-yellow-200 text-lg font-medium mb-2">
                        🎉 Ein Abend voller Erinnerung 🎉
                    </p>
                    <p class="text-yellow-100 text-sm">
                        Wähle eine Kategorie und teile deine schönsten Momente mit uns
                    </p>
                </div>
            </div>

            <!-- Elegante Kategorie-Karten -->
            <div class="space-y-4">
                <button v-for="category in categories" :key="category.id" @click="selectCategory(category)"
                    :disabled="selectedCategory === category.id"
                    class="w-full p-5 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl hover:border-yellow-400/50 hover:bg-gradient-to-r hover:from-yellow-400/10 hover:to-yellow-600/5 transition-all duration-300 text-left group disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <div class="flex-shrink-0">
                                <i :class="getCategoryIcon(category.id)"
                                    class="text-2xl text-yellow-400 group-hover:text-yellow-300 transition-colors"></i>
                            </div>
                            <div class="flex-1">
                                <h3
                                    class="font-semibold text-white group-hover:text-yellow-200 transition-colors text-lg">
                                    {{ category.name }}
                                </h3>
                                <p class="text-sm text-gray-300 group-hover:text-gray-200 transition-colors mt-1">
                                    {{ category.description }}
                                </p>
                            </div>
                        </div>
                        <div v-if="selectedCategory === category.id" class="flex items-center ml-4">
                            <div
                                class="animate-spin w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full mr-3">
                            </div>
                            <span class="text-sm text-yellow-300 font-medium">Wird geladen...</span>
                        </div>
                        <div v-else class="ml-4">
                            <div
                                class="w-8 h-8 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center group-hover:from-yellow-400/30 group-hover:to-yellow-600/30 transition-all">
                                <i
                                    class="fas fa-arrow-right text-yellow-400 group-hover:text-yellow-300 transition-colors"></i>
                            </div>
                        </div>
                    </div>
                </button>
            </div>

            <!-- Festlicher Footer -->
            <div class="mt-8 text-center">
                <div
                    class="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <p class="text-yellow-200 text-sm mb-2">
                        <i class="fas fa-camera text-yellow-400 mr-2"></i>
                        Lade deine Lieblingsfotos hoch
                    </p>
                    <p class="text-yellow-100 text-xs">
                        Jede Erinnerung macht diesen besonderen Tag noch unvergesslicher
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Category {
    id: string
    name: string
    description: string
    path: string
}

const categories: Category[] = [
    {
        id: 'bester-teller-buffet',
        name: 'Bester Buffet Teller',
        description: 'Die kreativsten und leckersten Buffet-Teller',
        path: 'images/bester-teller-buffet'
    },
    {
        id: 'coolster-tanzschritt',
        name: 'Coolster Tanzschritt',
        description: 'Die besten Moves auf der Tanzfläche',
        path: 'images/coolster-tanzschritt'
    },
    {
        id: 'kreativster-schnappschuss',
        name: 'Kreativster Schnappschuss',
        description: 'Der beste Spontan-Schnappschuss des Abends',
        path: 'images/kreativster-schnappschuss'
    },
    {
        id: 'best-of-geburtstagskinder',
        name: 'Best of Stefan und Lea',
        description: 'Bestes Bild von den Geburtstagskindern',
        path: 'images/best-of-geburtstagskindern'
    },
    {
        id: 'most-impressive-dress',
        name: 'Most Impressive Dress',
        description: 'Dresscode voll erfüllt!!',
        path: 'images/most-impressive-dress'
    },
    {
        id: 'pose-ohne-absicht',
        name: 'Pose ohne Absicht',
        description: 'Die besten Posen ohne es zu merken',
        path: 'images/pose-ohne-absicht'
    },
    {
        id: 'romantischster-moment',
        name: 'Romantischster Moment',
        description: 'Die schönsten romantischen Augenblicke',
        path: 'images/romantischster-moment'
    },
    {
        id: 'schoenstes-gruppenfoto',
        name: 'Schönstes Gruppenfoto',
        description: 'Die besten Gruppenbilder der Feier',
        path: 'images/schoenstes-gruppenfoto'
    }
]

const selectedCategory = ref<string | null>(null)

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

function selectCategory(category: Category) {
    selectedCategory.value = category.id
    navigateTo(`/gallery/${category.id}?path=${encodeURIComponent(category.path)}&name=${encodeURIComponent(category.name)}`)
}

// Setze die Seitentitel
useHead({
    title: '✨ Fab Fifty - 50 Jahre voller Erinnerungen',
    meta: [
        { name: 'description', content: 'Feiere mit uns den 50. Geburtstag! Teile deine schönsten Fotos und Erinnerungen.' }
    ]
})
</script>

<style>
/* Stelle sicher, dass Playfair Display verfügbar ist */
.font-playfair {
    font-family: 'Playfair Display', serif;
}

/* Zusätzliche Animationen */
@keyframes float {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-10px) rotate(5deg);
    }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

/* Goldener Glanz-Effekt */
@keyframes goldGlow {

    0%,
    100% {
        box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
    }

    50% {
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.4);
    }
}

.hover\:animate-gold-glow:hover {
    animation: goldGlow 2s ease-in-out infinite;
}
</style>
