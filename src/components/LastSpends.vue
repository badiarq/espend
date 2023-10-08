<script setup>
    import { computed, ref, onMounted } from 'vue'
    import { useStore } from 'vuex' // Import useStore from 'vuex'
    import axios from 'axios'
    import { 
        gObjectParameter1ByParameter2,
        addNewOption,
        handleSpendAmount,
        resetSubCategories,
        gData
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
        const subCategoryId = 'subcategory-selector'
        const category = document.getElementById('category-selector')
        const subCategory = document.getElementById(subCategoryId);
        const spendAmount = document.getElementById('spend-amount')
        const percentagePart1 = document.getElementById('percentage-part1')
        const percentagePart2 = document.getElementById('percentage-part2')
        subCategory.disabled = false
        resetSubCategories()
        const activeSubCategories = subCategories.filter((sc) => sc.categories_id === item.categories_id)        
        activeSubCategories.forEach((sc) => addNewOption(subCategoryId, sc.id, sc.subcategory_label, sc.id))
        category.value = item.categories_id
        subCategory.value = item.sub_categories_id
        spendAmount.value = item.total_amount
        percentagePart1.value = item.part1_percentage
        percentagePart2.value = item.part2_percentage
        setHandleSpendAmount(
            spendAmount.value, 
            percentagePart1.value, 
            percentagePart2.value
        )
        return false;
    }

    function setHandleSpendAmount(spendAmount, percetagePart1, percetagePart2) {
      const { newSpendAmount, amountPart1, amountPart2 } = handleSpendAmount(spendAmount, percetagePart1, percetagePart2)
      document.getElementById('spend-amount').value = newSpendAmount
      document.getElementById('amount-part1').value = amountPart1
      document.getElementById('amount-part2').value = amountPart2
    }

    onMounted(async() => {
        await gSpends()
        await gCategories()
        await gSubCategories()
        await gParticipants()
    })
</script>

<template>
    <div class="flow-root">
        <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="(item, index) in sortedSpendTable.slice(0, 10)" 
                :key="index" 
                class="py-3 md:py-4"
            >
                <a href="#" class="flex flex-row justify-between" @click="handleSelectedSpend(item, db.subCategories)">
                    <div>
                        <p class="text-sm md:text-base font-medium text-gray-900 truncate dark:text-white">
                            {{ gObjectParameter1ByParameter2(db.categories,'category_label', 'id', item.categories_id) }}
                        </p>
                        <p class="text-sm md:text-base text-gray-500 truncate dark:text-gray-400">
                            {{ gObjectParameter1ByParameter2(db.subCategories,'subcategory_label', 'id', item.sub_categories_id) }}
                        </p>
                    </div>
                    <div class="flex items-end text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                        {{ item.total_amount }} €
                    </div>
                </a>
            </li>
        </ul>
    </div>
</template>