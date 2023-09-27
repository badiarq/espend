<script>
    // import allCategories from '../data/categories.json'
    // import percentage from '../data/percentage.json'
    import { ref } from 'vue';

    export default {

        setup() {

            let spendCategory = ref(null);
            let spendSubCategory = ref(null);
            let percentagePart1 = ref(percentage.Default.part1)
            let percentagePart2 = ref(percentage.Default.part2)

            const date = new Date()
            // using an existing datetime as `v-model` you must format its dateValue to 'YYYY-MM-DDThh:mm'
            const formattedDate = date.toISOString().slice(0, 10)  
            const dateValue = ref(formattedDate)

            return {
                allCategories,
                percentage,
                spendCategory,
                spendSubCategory,
                percentagePart1,
                percentagePart2,
                dateValue
            }
        },
        methods: {
            onChangeCategorySelector(event) {
                let subCategorySelector = document.getElementById("subcategory-selector");
                subCategorySelector.selectedIndex = 0
            },
            handleSpendAmount(id) {
                let part1Percentage = document.getElementById("percentage-part1").value;
                let part2Percentage = document.getElementById("percentage-part2").value;
                let spendAmount = document.getElementById(id).value;
                let newSpendAmount = this.convertToValidAmount(spendAmount)
                document.getElementById(id).value = newSpendAmount
                document.getElementById("amount-part1").value = newSpendAmount * part1Percentage / 100
                document.getElementById("amount-part2").value = newSpendAmount * part2Percentage / 100
            },
            handlePartPercentage(id) {
                let spendAmount = document.getElementById("spend-amount").value;
                let percentage = document.getElementById(id).value
                let validPercentage = this.convertToValidPercentage(percentage)
                document.getElementById(id).value = validPercentage
                if(id.includes("1")) {
                    document.getElementById("amount-part1").value = spendAmount * validPercentage / 100
                    let newPercentage2 = 100 - (validPercentage)
                    document.getElementById("percentage-part2").value = newPercentage2
                    document.getElementById("amount-part2").value = spendAmount * newPercentage2 / 100
                } else {
                    document.getElementById("amount-part2").value = spendAmount * validPercentage / 100
                    let newPercentage1 = 100 - (validPercentage)
                    document.getElementById("percentage-part1").value = newPercentage1
                    document.getElementById("amount-part1").value = spendAmount * newPercentage1 / 100
                }
            },
            handlePartAmount(id) {
                let spendAmount = document.getElementById("spend-amount").value;
                if(id.includes("1")) {
                    document.getElementById("amount-part2").value = spendAmount - document.getElementById("amount-part1").value
                    document.getElementById("percentage-part1").value = document.getElementById("amount-part1").value / spendAmount * 100
                    document.getElementById("percentage-part2").value = 100 - document.getElementById("percentage-part1").value
                } else {
                    document.getElementById("amount-part1").value = spendAmount - document.getElementById("amount-part2").value
                    document.getElementById("percentage-part1").value = document.getElementById("amount-part1").value / spendAmount * 100
                    document.getElementById("percentage-part2").value = 100 - document.getElementById("percentage-part1").value
                }
            },
            convertToValidPercentage(percentage) {
                percentage = Math.abs(percentage)
                percentage = this.roundIfDouble(percentage)
                percentage = this.maxValuePermited(percentage, 100)
                return percentage
            },
            convertToValidAmount(amount){
                amount = Math.abs(parseFloat(amount).toFixed(2));
                return amount
            },
            countDecimals(value) { 
                if ((value % 1) != 0) 
                    return value.toString().split(".")[1].length;  
                return 0;
            },
            maxValuePermited(numberToCheck, maxValue){
                if (numberToCheck > maxValue) {
                    numberToCheck = maxValue
                }
                return numberToCheck
            },
            roundIfDouble(value){
                if (this.countDecimals(value) > 0) {
                    value = Math.round(value)
                    return value
                } else {
                    return value
                }
            },
            handleSaveButton() {
                let spendCategory = document.getElementById("category-selector").value;
                let spendSubCategory = document.getElementById("subcategory-selector").value;
                let spendAmount = document.getElementById("spend-amount").value;
                let spendDate = document.getElementById("spend-date").value;
                let spendDescription = document.getElementById("spend-description").value;
                alert(spendCategory + spendSubCategory + spendAmount + spendDate + spendDescription)
            },
            defaultPercentages() {
                document.getElementById("percentage-part1").defaultValue = percentage.Default.part1
                document.getElementById("percentage-part2").defaultValue = percentage.Default.part2
            }
        },
        mounted() {
            // this.defaultPercentages()
        }
    }

</script>

<template>
    <main class="container py-8">
        <form @submit.prevent="newSpend" class="w-full max-w-lg">
            <div class="grid grid-cols-2 gap-6">
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
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                        v-model="spendCategory"
                        @input="onChangeCategorySelector"
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
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
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
                            min="0" 
                            step="0.01" 
                            value="0.00"
                            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                            id="spend-amount"
                            @input="handleSpendAmount('spend-amount')"
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
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-primary-middle rounded py-3 px-4 leading-tight"
                    />
                </div>
                <div class="w-full">
                    <label 
                        for="amount-part1"
                        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        >
                        Part 1 (%)
                    </label>
                    <div class="flex flex-row items-center p-2 border rounded bg-secondary-light border-secondary-middle">
                        <div class="flex flex-row items-center w-2/5">
                            <input 
                                type="Number"
                                class="px-[7px] appearance-none block h-8 bg-gray-200 text-gray-700 border border-gray-400 rounded py-3 leading-tight focus:outline-none focus:bg-white"
                                id="percentage-part1"
                                @input="handlePartPercentage('percentage-part1')"
                                v-model="percentagePart1"
                            >
                            <h4 class="px-2 mr-3 rounded-full">%</h4>
                        </div>
                        <div class="flex flex-row items-center w-3/5">
                            <input 
                                type="Number"
                                value="0.00"
                                class="appearance-none block h-8 bg-gray-200 text-gray-700 border border-gray-400 rounded py-3 leading-tight focus:outline-none focus:bg-white"
                                id="amount-part1"
                                @input="handlePartAmount('amount-part1')"
                            >
                            <h4 class="px-2 rounded-full">€</h4>
                        </div>
                    </div>
                </div>
                <div class="w-full">
                    <label 
                        for="amount-part2"
                        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        >
                        Part 2 (%)
                    </label>
                    <div class="flex flex-row items-center p-2 border rounded bg-primary-light border-primary-middle">
                        <div class="flex flex-row items-center w-2/5">
                            <input 
                                type="Number"
                                class="px-[7px] appearance-none block h-8 bg-gray-200 text-gray-700 border border-gray-400 rounded py-3 leading-tight focus:outline-none focus:bg-white"
                                id="percentage-part2"
                                @input="handlePartPercentage('percentage-part2')"
                                v-model="percentagePart2"
                            >
                            <h4 class="px-2 mr-3 rounded-full">%</h4>
                        </div>
                        <div class="flex flex-row items-center w-3/5">
                            <input 
                                type="Number"
                                value="0.00"
                                class="appearance-none block h-8 bg-gray-200 text-gray-700 border border-gray-400 rounded py-3 leading-tight focus:outline-none focus:bg-white"
                                id="amount-part2"
                                @input="handlePartAmount('amount-part2')"
                            >
                            <h4 class="px-2 rounded-full">€</h4>
                        </div>
                    </div>
                </div>
                <div class="w-full col-span-2">
                    <label 
                        for="spend-description"
                        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        >
                        Description
                    </label>
                    <textarea 
                        name="spend-description" 
                        id="spend-description" 
                        cols="30" 
                        rows="3" 
                        class="col-span-2"
                    ></textarea>
                </div>
                <div class="w-full col-span-2 flex flex-row justify-end">
                    <button 
                        class="btn bg-primary-middle"
                        @click="handleSaveButton"
                        >
                        Enregistrer 
                    </button>
                </div>
            </div>
        </form>
    </main>
</template>

<style>

</style>