<script>
import allCategories from '../data/categories.json'
import { ref } from 'vue';

export default {

    setup() {

        let spendCategory = ref(null);
        let spendSubCategory = ref(null);

        return {
            spendCategory,
            spendSubCategory,
            allCategories, 
        }
    },
    methods: {
        onChangeCategorySelector(event) {
            let subCategorySelector = document.getElementById("subcategory-selector");
            subCategorySelector.selectedIndex = 0
        },
  },
}

</script>

<template>
    <main class="container py-8">
        <form @submit.prevent="newSpend" class="w-full max-w-lg">
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label 
                        for="grid-first-name"
                        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        >
                        Catégorie
                    </label>
                    <select 
                        name="category-selector" 
                        id="category-selector" 
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        v-model="spendCategory"
                        @change="onChangeCategorySelector"
                    >
                        <option 
                            v-for="(category, index) in allCategories"
                            :value="index" 
                            class="bg-blue-500"
                        >
                            {{ index }}
                        </option>
                    </select>
                </div>
                <div class="w-full md:w-1/2 px-3">
                    <label 
                        for="grid-first-name"
                        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        >
                        Sous-catégorie
                    </label>
                    <select 
                        name="subcategory-selector"
                        id="subcategory-selector" 
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        v-model="spendSubCategory"
                    >
                        <option 
                            v-for= "subCategory in allCategories[spendCategory]"
                            class="bg-blue-500"
                        >
                            {{ subCategory }}
                        </option>
                    </select>
                </div>
                <div class="w-full md:w-1/2 px-3">
                    <label 
                        for="grid-first-name"
                        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        >
                        Montant
                    </label>
                    <div class="flex flex-row">
                        <input 
                            type="Number" 
                            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="grid-first-name"
                        >
                        <h4 class="p-2 ml-2 rounded-full w-8">€</h4>
                    </div>
                </div>
            </div>
        </form>
    </main>
</template>

<style>

</style>