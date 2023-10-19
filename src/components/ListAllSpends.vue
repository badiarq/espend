<script setup>
    import { ref, onMounted } from 'vue'
    import { useStore } from 'vuex' // Import useStore from 'vuex'
    import axios from 'axios'
    import { gObjectParameter1ByParameter2, groupByParameter, gData } from '../store/functions.js'

    const store = useStore()
    const db = ref({
        spends: [],
        categories: [],
        subCategories: [],
        participants: []
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
        } catch (e) {
            console.log(e)
        }
    }
    // Get Participants
    const gParticipants = async() => {
    try {
        const response = await axios.get(store.state.api.participantsTable)
        db.value.participants = response.data
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

    onMounted(async() => {
        form.value.content = await store.state.api.content
        await gSpends()
        await gCategories()
        await gSubCategories()
        await gParticipants()
    })
</script>

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
                    <a href="#">
                        <div class="spend-container justify-between flex flex-row">
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
                        </div>
                        <div class="amount-repartition flex flex-raw justify-end">
                            <span class="text-[11px] md:text-[13px] flex justify-end text-primary-middle">
                                {{ gObjectParameter1ByParameter2(db.participants,'part_reference', 'id', 1) }} ({{ item.part1_percentage }}%) : {{ item.part1_amount }}€
                            </span>
                            <span class="text-[11px] md:text-[13px]">&nbsp&nbsp-&nbsp&nbsp</span>
                            <span class="text-[11px] md:text-[13px] flex justify-end text-secondary-dark">
                                {{ gObjectParameter1ByParameter2(db.participants,'part_reference', 'id', 2) }} ({{ item.part2_percentage }}%) : {{ item.part2_amount }}€
                            </span>
                        </div>
                    </a>
                </li>
            </div>
            <div class="mb-2"></div>  
        </ul>
    </div>
</template>

