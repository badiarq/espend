<script setup>
    import { computed, ref, onMounted } from 'vue'
    import { useStore } from 'vuex' // Import useStore from 'vuex'
    import axios from 'axios'
    import { 
        gObjectParameter1ByParameter2,
        addNewOption,
        handleSpendAmount,
        resetSubCategories,
        gData,
        groupByParameter
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

    // Get Content
    const form = ref({
        content: {}
    })
    function data(name) {
        return gData(form.value.content, name)
    }

    // Get Spends Data
    const gSpends = async() => {
        try {
            const response = await axios.get(store.state.api.spendsTable)
            db.value.spends = response.data
            console.log('reduced', reducedListByCategory(db.value.spends, 'spend_date', 7))
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

    function setHandleSpendAmount(spendAmount, percentagePart1, percentagePart2) {
      const { newSpendAmount, amountPart1, amountPart2 } = handleSpendAmount(spendAmount, percentagePart1, percentagePart2)
      document.getElementById('spend-amount').value = newSpendAmount
      document.getElementById('amount-part1').value = amountPart1
      document.getElementById('amount-part2').value = amountPart2
    }

    function reducedListByCategory(data, category, numberOfElements) {
        console.log('data', data)
        const groupedData = groupByParameter(data, category)
        console.log('groupdata', groupedData)
        return reducedList(groupedData, numberOfElements)
        
    }

    function reducedList(arrayList, numberOfElements) {
        console.log('arrayList', JSON.stringify(arrayList))
        console.log('sliced', arrayList.slice(0, 7))
        return arrayList.slice(0, numberOfElements)
    }

    onMounted(async() => {
        form.value.content = await store.state.api.content
        await gSpends()
        await gCategories()
        await gSubCategories()
        await gParticipants()
    })
</script>

<!-- <template>
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
</template> -->

<template>
    <div class="flow-root">
        <ul v-for="(spend, index) in groupByParameter(db.spends, 'spend_date')"
            v-bind:key="index"
            role="list" 
            class="divide-y divide-gray-200 dark:divide-gray-700 "   
        >
            <div>
                <p class="text-[14px] ml-2 text-gray-500">{{ data('date')}} : {{ spend[0].spend_date }}</p>
            </div>
            <div class="date-spends bg-white">
                <li v-for="(item, index) in spend"
                    :key="index" 
                    class="p-2 mx-1 "
                >
                    <a href="#" 
                        class="spend-container justify-between flex flex-row" 
                            @click="handleSelectedSpend(item, db.subCategories)"
                        >
                        <div class="w-3/4">
                            <div class="flex flex-raw">
                                <p class="w-56 mr-2 text-[16px] md:text-[18px] font-medium text-primary-dark truncate dark:text-white">
                                    {{ gObjectParameter1ByParameter2(db.categories,'category_label', 'id', item.categories_id) }}
                                </p>
                            </div>
                            <div class="flex flex-raw justify-between">
                                <p class="mr-2 text-xs md:text-base text-gray-500 truncate dark:text-gray-400 flex items-center">
                                    {{ gObjectParameter1ByParameter2(db.subCategories,'subcategory_label', 'id', item.sub_categories_id) }}
                                </p>
                                <div class="flex flex-raw text-xs md:text-base text-gray-500">
                                    <p>{{ data('paid_by')}}: {{ gObjectParameter1ByParameter2(db.participants,'name', 'id', item.users_id) }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="w-1/4 flex flex-col justify-between">
                            <div>
                                <p class="text-xs md:text-[14px] text-gray-500 flex justify-end">{{ item.spend_date }}</p>
                            </div>
                            <div class="flex justify-end text-[14px] md:text-[18px] font-semibold text-gray-900 dark:text-white">
                                {{ item.total_amount }} €
                            </div>
                        </div>
                    </a>
                    <div class="amount-repartition flex flex-raw justify-end">
                        <span class="text-[11px] md:text-[13px] flex justify-end text-primary-middle">
                            {{ gObjectParameter1ByParameter2(db.participants,'part_reference', 'id', 1) }} ({{ item.part1_percentage }}%) : {{ item.part1_amount }}€
                        </span>
                        <span class="text-[11px] md:text-[13px]">&nbsp&nbsp-&nbsp&nbsp</span>
                        <span class="text-[11px] md:text-[13px] flex justify-end text-secondary-dark">
                            {{ gObjectParameter1ByParameter2(db.participants,'part_reference', 'id', 2) }} ({{ item.part2_percentage }}%) : {{ item.part2_amount }}€
                        </span>
                    </div>
                </li>
            </div>
            <div class="my-2 bg-gray-200"></div>  
        </ul>
    </div>
</template>