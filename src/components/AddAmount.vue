<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import { convertToValidPercentage, 
    convertToValidAmount, 
    gObjectParameter1ByParameter2,
    gTodayDate
} from '../store/functions.js'

const store = useStore()

// Get Categories and subCategories
const gCategories = async() => {
    try {
        const response = await axios.get(store.state.api.getCategories)
        db.value.categories = response.data
    } catch (e) {
        console.log(e)
    }
}
const gSubCategories = async() => {
    try {
        const response = await axios.get(store.state.api.getSubCategories)
        db.value.subCategories = response.data
    } catch (e) {
        console.log(e)
    }
}

// Get Default Pourcentages
const defaultPercentages = () => {
    
    form.value.percentagePart1 = 
    gObjectParameter1ByParameter2(
        db.value.participants, 
        'default_percentage', 
        'part_reference', 
        'Part 1'
    ) 

    form.value.percentagePart2 = 
    gObjectParameter1ByParameter2(
        db.value.participants, 
        'default_percentage', 
        'part_reference', 
        'Part 2'
    ) 
} 

// Get Participants
const gParticipants = async() => {
    try {
        const response = await axios.get(store.state.api.participants)
        db.value.participants = response.data
        for (let i = 0; i < response.data.length; i++) {
            const name = response.data[i].name;
            form.value.participantsNames.push(name)
        }
    } catch (e) {
        console.log(e)
    }
}

onMounted(async() => {
    await gCategories()
    await gSubCategories()
    await gParticipants()
    defaultPercentages()
})

// Global Form
const scDisabled = ref(true)
const form = ref({
    spendCategory: '',
    spendSubCategory: '',
    spendAmount: '',
    dateValue: gTodayDate(),
    percentagePart1: '',
    percentagePart2: '',
    amountPart1: 0,
    amountPart2: 0,
    description: '',
    participantsNames: [],
    currentSubCategories: []

})
const db = ref({
    participants: {},
    categories: [],
    subCategories: []
})

function onChangeCategorySelector() {

    let filtredSubCat = []
    for (let i = 0; i < db.value.subCategories.length; i++) {
        const sc = db.value.subCategories[i];
        for (let i = 0; i < db.value.categories.length; i++) {
            const cat = db.value.categories[i];
            if(sc.categories_id === cat.id && sc.categories_id === form.value.spendCategory) {
                filtredSubCat.push(sc)
                if(sc.selected_by_default === true) {
                    form.value.spendSubCategory = sc.id
                    form.value.percentagePart1 = gObjectParameter1ByParameter2(
                        db.value.subCategories, 
                        'percentage_part1', 
                        'id', 
                        sc.id
                    )
                    form.value.percentagePart2 = gObjectParameter1ByParameter2(
                        db.value.subCategories, 
                        'percentage_part2', 
                        'id', 
                        sc.id
                    )

                }
            }
        }
    }
    form.value.currentSubCategories = filtredSubCat
    form.value.currentSubCategories ? scDisabled.value = false : scDisabled.value = true

    onChangeSubCategorySelector()
}

function onChangeSubCategorySelector() {
    form.value.percentagePart1 = gObjectParameter1ByParameter2(
        db.value.subCategories, 
        'percentage_part1', 
        'id',
        form.value.spendSubCategory
    )
    form.value.percentagePart2 = gObjectParameter1ByParameter2(
        db.value.subCategories, 
        'percentage_part2', 
        'id',
        form.value.spendSubCategory
    )
    handleSpendAmount()
}

// calculate part amounts from total and percentages
function handleSpendAmount() {
    const getSpendAmout = form.value.spendAmount
    form.value.spendAmount = convertToValidAmount(getSpendAmout)
    form.value.amountPart1 = form.value.spendAmount * form.value.percentagePart1 / 100
    form.value.amountPart2 = form.value.spendAmount * form.value.percentagePart2 / 100
}

// Choose the paying participant
function handleParticipant(value) {
    console.log(value)
}

// Assign Parts pecentages
function handlePartPercentage(percentage, type) {
    if(type === 'part1') {
        const percentageVal1 = +percentage
        form.value.percentagePart1 = convertToValidPercentage(percentageVal1)
        form.value.amountPart1 = form.value.spendAmount * form.value.percentagePart1 / 100
        form.value.percentagePart2 = 100 - (form.value.percentagePart1)
        form.value.amountPart2 = form.value.spendAmount * form.value.percentagePart2 / 100
    } else {
        const percentageVal2 = +percentage
        form.value.percentagePart2 = convertToValidPercentage(percentageVal2)
        form.value.amountPart2 = form.value.spendAmount * form.value.percentagePart2 / 100
        form.value.percentagePart1 = 100 - (form.value.percentagePart2)
        form.value.amountPart1 = form.value.spendAmount * form.value.percentagePart1 / 100
    }
}

// Assign Parts Amounts
function handlePartAmount(amount, type) {
    if(type === 'part1') {
        form.value.amountPart2 = form.value.spendAmount - amount
        form.value.percentagePart1 = amount / form.value.spendAmount * 100
        form.value.percentagePart2 = 100 - form.value.percentagePart1
    } else {
        form.value.amountPart1 = form.value.spendAmount - amount
        form.value.percentagePart2 = amount / form.value.spendAmount * 100
        form.value.percentagePart1 = 100 - form.value.percentagePart2
    }
}

// Send to Database
const message = ref({
    success: false,
    text: ''
})
const submitHandler = async () => {
    let formData = new FormData();

    if(Object.keys(db.value.categories).length === 0 || Object.keys(db.value.subCategories).length === 0) {
        message.value = {
            success: false,
            text: 'Vous devez valider tous les champs'
        }
        return
    }

    const selectedCategorie = db.value.categories.filter((c) => c.id === db.value.categories)
    const selectedSubCategorie = db.value.subCategories.filter((c) => c.id === db.value.subCategories)
    
    formData.append('category', selectedCategorie[0].label)
    formData.append('sub_category', selectedSubCategorie[0].label)
    formData.append('amount', form.value.spendAmount)
    formData.append('date', form.value.dateValue)
    formData.append('percentage_part1', form.value.percentagePart1)
    formData.append('percentage_part2', form.value.percentagePart2)
    formData.append('amount_part1', form.value.amountPart1)
    formData.append('amount_part2', form.value.amountPart2)
    formData.append('description', form.value.description)

    axios
    .post(store.state.api.postData, formData) 
    .then((response) => {
        message.value = {
            success: true,
            text: 'Montant envoyé avec succès'
        }
        setTimeout(() => {
            window.location.reload()
        }, 2000);
    })
    .catch(error => {
        console.log(error)
    })
}

</script>

<template>
    <form @submit.prevent="newSpend" class="w-full">
        <div class="grid grid-cols-2 gap-6">
            <div>
                <label 
                    for="category-selector"
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    >
                    Catégorie
                </label>
                <select 
                    id="category-selector" 
                    class="bg-white rounded-md border border-gray-300 px-4 py-2 text-sm"
                    v-model="form.spendCategory"
                    @change="onChangeCategorySelector"
                >
                    <option value="" selected disabled>Selectionnez une catégorie</option>
                    <option 
                        v-for="category in db.categories" :key="category.id"
                        :value="category.id" 
                    >
                        {{ category.category_label }}
                    </option>
                </select>
            </div>
            <div>
                <label 
                    for="category-selector"
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    >
                    Sous-catégorie
                </label>
                <select 
                    id="category-selector" 
                    class="bg-white rounded-md border border-gray-300 px-4 py-2 text-sm"
                    v-model="form.spendSubCategory"
                    :disabled="scDisabled"
                    @change="onChangeSubCategorySelector"
                >
                <option value="" selected disabled>Sous-catégories</option>
                    <option 
                        v-for= "subCategory in form.currentSubCategories" :key="subCategory.id"
                        :value="subCategory.id"
                    >
                        {{ subCategory.subcategory_label }}
                    </option>
                </select>
            </div>
            <div>
                <label 
                    for="grid-first-name"
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    >
                    Montant
                </label>
                <div class="flex flex-row">
                    <input 
                        type="Number"
                        id="spend-amount"   
                        v-model="form.spendAmount"
                        class="bg-white rounded-md border border-gray-300 px-4 py-2 text-sm"
                        @input="handleSpendAmount"
                    >
                    <span class="bg-gray-200 rounded-md border border-gray-300 px-4 py-2 text-sm ml-3">€</span>
                </div>
            </div>
            <div>
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
                    v-model="form.dateValue"
                    class="bg-white rounded-md border border-gray-300 px-4 py-2 text-sm"
                />
            </div>
            <div class="col-span-2">
                <label 
                    for="participant"
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    >
                    Payé par
                </label>
                <select 
                    id="participant" 
                    class="bg-white rounded-md border border-gray-300 px-4 py-2 text-sm"
                    v-model="form.participantsNames"
                >
                    <option 
                        v-for="participant in db.participants" :key="participant.id"
                        :value="participant.name" 
                    >
                        {{ participant.name }}
                    </option>
                </select>
            </div>
            <div>
                <label 
                    for="amount-part1"
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    >
                    Part 1 - 
                    {{ gObjectParameter1ByParameter2(
                        db.participants, 
                        'name', 
                        'part_reference', 
                        'Part 1') 
                    }}
                </label>
                <div class="flex flex-row items-center p-2 border rounded bg-secondary-light border-secondary-middle">
                    <div class="flex flex-row items-center w-2/5">
                        <input 
                            type="Number"
                            class="px-[7px] appearance-none block h-8 bg-gray-200 text-gray-700 border border-gray-400 rounded py-3 leading-tight focus:outline-none focus:bg-white"
                            id="percentage-part1"
                            @blur="handlePartPercentage(form.percentagePart1, 'part1')"
                            v-model="form.percentagePart1"
                        >
                        <h4 class="px-2 mr-3 rounded-full">%</h4>
                    </div>
                    <div class="flex flex-row items-center w-3/5">
                        <input 
                            type="Number"
                            class="appearance-none block h-8 bg-gray-200 text-gray-700 border border-gray-400 rounded py-3 leading-tight focus:outline-none focus:bg-white"
                            id="amount-part1"
                            v-model="form.amountPart1"
                            @input="handlePartAmount(form.amountPart1, 'part1')"
                        >
                        <h4 class="px-2 rounded-full">€</h4>
                    </div>
                </div>
            </div>
            <div>
                <label 
                    for="amount-part2"
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    >
                    Part 2 - 
                    {{ gObjectParameter1ByParameter2(
                        db.participants, 
                        'name', 
                        'part_reference', 
                        'Part 2') 
                    }}
                </label>
                <div class="flex flex-row items-center p-2 border rounded bg-primary-light border-primary-middle">
                    <div class="flex flex-row items-center w-2/5">
                        <input 
                            type="Number"
                            class="px-[7px] appearance-none block h-8 bg-gray-200 text-gray-700 border border-gray-400 rounded py-3 leading-tight focus:outline-none focus:bg-white"
                            id="percentage-part2"
                            @blur="handlePartPercentage(form.percentagePart2, 'part2')"
                            v-model="form.percentagePart2"
                        >
                        <h4 class="px-2 mr-3 rounded-full">%</h4>
                    </div>
                    <div class="flex flex-row items-center w-3/5">
                        <input 
                            type="Number"
                            class="appearance-none block h-8 bg-gray-200 text-gray-700 border border-gray-400 rounded py-3 leading-tight focus:outline-none focus:bg-white"
                            id="amount-part2"
                            v-model="form.amountPart2"
                            @input="handlePartAmount(form.amountPart2, 'part2')"
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
                    v-model="form.description"
                ></textarea>
            </div>
            <div class="w-full col-span-2 flex flex-row justify-end">
                <button 
                    class="btn bg-primary-middle"
                    @click="submitHandler"
                    >
                    Enregistrer 
                </button>
            </div>
            <div 
                v-if="message.text" 
                class="mt-4 text-center text-sm text-white p-3 col-span-2"
                :class="message.success ? 'bg-green-500' : 'bg-red-500'"
            >
                {{ message.text }}
            </div>
        </div> 
    </form>
</template>