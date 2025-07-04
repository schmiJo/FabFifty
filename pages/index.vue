<template>
    <div class="min-h-screen bg-gray-50">
        <div class="p-4 max-w-md mx-auto">
            <h1 class="text-3xl font-bold mb-2 text-center text-gray-800">Fab Fifty</h1>
            <p class="text-center text-gray-600 mb-8">Choose a category to upload your photos</p>

            <div class="space-y-3">
                <button v-for="category in categories" :key="category.id" @click="selectCategory(category)"
                    :disabled="selectedCategory === category.id"
                    class="w-full p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                                {{ category.name }}
                            </h3>
                            <p class="text-sm text-gray-500 mt-1">{{ category.description }}</p>
                        </div>
                        <div v-if="selectedCategory === category.id" class="flex items-center">
                            <svg class="animate-spin w-5 h-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            <span class="text-sm text-blue-600">Loading...</span>
                        </div>
                        <svg v-else class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7">
                            </path>
                        </svg>
                    </div>
                </button>
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
        name: 'Bester Teller Buffet',
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
        id: 'dresscode-nicht-erfuellt',
        name: 'Dresscode nicht erfüllt',
        description: 'Humorvolle Outfit-Pannen und Stilbrüche',
        path: 'images/dresscode-nicht-erfuellt'
    },
    {
        id: 'kreativster-schnappschuss',
        name: 'Kreativster Schnappschuss',
        description: 'Die originellsten und kreativsten Fotos',
        path: 'images/kreativster-schnappschuss'
    },
    {
        id: 'lieblingsbild-geburtstagskinder',
        name: 'Lieblingsbild Geburtstagskinder',
        description: 'Die schönsten Momente der Jubilare',
        path: 'images/lieblingsbild-geburtstagskinder'
    },
    {
        id: 'most-impressive-dress',
        name: 'Most Impressive Dress',
        description: 'Die beeindruckendsten Outfits des Abends',
        path: 'images/most-impressive-dress'
    },
    {
        id: 'pose-ohne-absicht',
        name: 'Pose ohne Absicht',
        description: 'Spontane und natürliche Momente',
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

function selectCategory(category: Category) {
    selectedCategory.value = category.id
    navigateTo(`/upload/${category.id}?path=${encodeURIComponent(category.path)}&name=${encodeURIComponent(category.name)}`)
}
</script>
