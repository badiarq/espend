<script>
    import allCategories from '../data/categories.json'
    import { ref } from 'vue';

    export default {

        setup() {

            let spendCategory = ref(null);
            let spendSubCategory = ref(null);

            const date = new Date()
            // using an existing datetime as `v-model` you must format its dateValue to 'YYYY-MM-DDThh:mm'
            const formattedDate = date.toISOString().slice(0, 10)  
            const dateValue = ref(formattedDate)

            return {
                spendCategory,
                spendSubCategory,
                allCategories,
                dateValue
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
            <div class="grid grid-cols-2 gap-4">
                <div class="w-full">
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
                            v-for="(category, index) in allCategories" :key="index"
                            :value="index" 
                        >
                            {{ index }}
                        </option>
                    </select>
                </div>
                <div class="w-full">
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
                            v-for= "(subCategory, index) in allCategories[spendCategory]" :key="index"
                        >
                            {{ subCategory }}
                        </option>
                    </select>
                </div>
                <div class="w-full">
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
                <div class="w-full">
                    <label 
                        for="grid-first-name"
                        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        >
                        Date
                    </label>
                    <input 
                        type="date" 
                        id="spend-date" 
                        name="spend-date" 
                        v-model="dateValue"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-primary-middle rounded py-3 px-4 mb-3 leading-tight"
                    />
                </div>
                <div class="w-full col-span-2">
                    <label 
                        for="spend-description"
                        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        >
                        Description
                    </label>
                    <textarea name="spend-description" id="spend-description" cols="30" rows="3" class="col-span-2"></textarea>
                </div>
            </div>
        </form>
    </main>
</template>

<style>

</style>