<script setup>
    import { computed, ref, onMounted } from 'vue'
    import { useStore } from 'vuex' // Import useStore from 'vuex'
    import axios from 'axios'
    import { 
        gObjectParameter1ByParameter2,
        addNewOption,
        handleSpendAmount
    } from '../store/functions.js'
    
    const store = useStore()
    const db = ref({
        spends: [],
        categories: [],
        subCategories: []
    })
    const selectedSpend = ref({
        spendCategory: 0,
        spendSubCategory: 0,
        spendAmount: 0,
        percentagePart1: 0,
        percentagePart2: 0,
        amountPart1: 0,
        amountPart2: 0,
        description: '',
        participantsNames: []
    })

    // Get Spends Data
    const gSpends = async() => {
        try {
            const response = await axios.get(store.state.api.spendsTable)
            db.value.spends = response.data
        } catch (e) {
            console.log(e)
        }
    }
    // Get Categories and subCategories
        const gCategories = async() => {
        try {
            const response = await axios.get(store.state.api.categoriesTable)
            db.value.categories = response.data
        } catch (e) {
            console.log(e)
        }
    }
    const gSubCategories = async() => {
        try {
            const response = await axios.get(store.state.api.subCategoriesTable)
            db.value.subCategories = response.data
        } catch (e) {
            console.log(e)
        }
    }
    // Get Participants
    const gParticipants = async() => {
        try {
            const response = await axios.get(store.state.api.participantsTable)
            db.value.participants = response.data
            for (let i = 0; i < response.data.length; i++) {
                const name = response.data[i].name;
                selectedSpend.value.participantsNames.push(name)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const sortedSpendTable = computed(() => {
        // Sort the spendTable by the 'date' parameter in descending order (most recent first)
        return db.value.spends.slice().sort((a, b) => new Date(b.spend_date) - new Date(a.spend_date))
    })

    function handleSelectedSpend(item, subCategories) {
        document.getElementById('category-selector').value = item.categories_id
        document.getElementById('subcategory-selector').disabled = false
        const activeSubCategories = subCategories.filter((sc) => sc.categories_id === item.categories_id)        
        activeSubCategories.forEach((subCategory) => addNewOption(subCategory.id, subCategory.subcategory_label, subCategory.id, 'subcategory-selector'))
        const select = document.getElementById('subcategory-selector');
        select.value = item.sub_categories_id
        document.getElementById('spend-amount').value = item.total_amount
        document.getElementById('percentage-part1').value = item.part1_percentage
        document.getElementById('percentage-part2').value = item.part2_percentage
        //handleSpendAmount()
        return false;
    }

    function setHandleSpendAmount(spendAmout, percetagePart1, percetagePart2) {
      const { amountPart1, amountPart2 } = handleSpendAmount(spendAmout, percetagePart1, percetagePart2)
      form.value.amountPart1 = amountPart1
      form.value.amountPart2 = amountPart2
    }

    onMounted(async() => {
        await gSpends()
        await gCategories()
        await gSubCategories()
        await gParticipants()
    })
</script>

<template>
    <!-- This is an example component -->
    <div class="max-w-2xl mx-auto">

    <div class="p-4 max-w-md bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Dernières dépenses</h3>
            <a href="#" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                Voir toutes les dépenses
            </a>
        </div>
            <div class="flow-root">
                <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">


                <li v-for="(item, index) in sortedSpendTable.slice(0, 10)" 
                    :key="index" 
                    class="py-3 sm:py-4"
                >
                    <a href="#" class="flex flex-row justify-between" @click="handleSelectedSpend(item, db.subCategories)">
                        <div>
                            <p class="text-md font-medium text-gray-900 truncate dark:text-white">
                                {{ gObjectParameter1ByParameter2(db.categories,'category_label', 'id', item.categories_id) }}
                            </p>
                            <p class="text-md text-gray-500 truncate dark:text-gray-400">
                                {{ gObjectParameter1ByParameter2(db.subCategories,'subcategory_label', 'id', item.sub_categories_id) }}
                            </p>
                        </div>
                        <div class="flex items-end text-base font-semibold text-gray-900 dark:text-white">
                            {{ item.total_amount }} €
                        </div>
                    </a>
                </li>


                <!-- <li class="py-3 sm:py-4">
                        <div class="flex items-center space-x-4">
                            <div class="flex-shrink-0">
                                <img class="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-1.jpg" alt="Neil image">
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                    Neil Sims
                                </p>
                                <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                    email@windster.com
                                </p>
                            </div>
                            <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                $320
                            </div>
                        </div>
                    </li> -->
                </ul>
            </div>
        </div>
    </div>
</template>