<script setup>
    import { ref, onMounted } from 'vue'
    import { useStore } from 'vuex'
    import axios from 'axios'
    import { 
        gObjectParameter1ByParameter2,
        gTodayDate,
        highlight,
        unHighlight,
        getTable,
        handleSpendAmount,
        resetSubCategories,
        gData,
        capitalCase,
        isValueExist
    } from '@/functions'

    // Function of getting content
    function data(name) {
        return gData(content, name)
    }

    // Global variables
    const store = useStore()
    const scDisabled = ref(true)
    // Global Form
    const form = ref({

        spendCategory: 0,
        spendSubCategory: 0,
        spendAmount: 0,
        dateValue: gTodayDate(),
        percentagePart1: 0,
        percentagePart2: 0,
        amountPart1: 0,
        amountPart2: 0,
        description: '',
        participantsNames: [],
        currentSubCategories: []

    })
    // Store from DataBase
    const db = ref({
        participants: {},
        categories: [],
        subCategories: [],
        spends: []
    })
    let content = {}

    // Store list of participants
    function storeParticipants() {
        for (let i = 0; i < db.value.participants.length; i++) {
            const name = db.value.participants[i].name;
            form.value.participantsNames.push(name)
        }
    }

    // Get Default Pourcentages
    const defaultPercentages = () => {
        form.value.percentagePart1 = gObjectParameter1ByParameter2(db.value.participants, 'default_percentage', 'part_reference', 'Part 1') 
        form.value.percentagePart2 = gObjectParameter1ByParameter2(db.value.participants, 'default_percentage', 'part_reference', 'Part 2') 
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

    function onChangeCategorySelector() {
        unHighlight( 'category-selector' )
        form.value.currentSubCategories = []
        let filtredSubCat = []
        for (let i = 0; i < db.value.subCategories.length; i++) {
            let sc = db.value.subCategories[i];
            for (let i = 0; i < db.value.categories.length; i++) {
                const cat = db.value.categories[i];
                if(sc.categories_id === cat.id && sc.categories_id === form.value.spendCategory) {
                    filtredSubCat.push(sc)
                    if(sc.selected_by_default === true) {
                        form.value.spendSubCategory = parseInt(sc.id)
                        form.value.percentagePart1 = gObjectParameter1ByParameter2(db.value.subCategories, 'percentage_part1', 'id', sc.id)
                        form.value.percentagePart2 = gObjectParameter1ByParameter2(db.value.subCategories, 'percentage_part2', 'id', sc.id)
                    }
                }
            }
        }
        if(form.value.currentSubCategories) {
            resetSubCategories()
            form.value.currentSubCategories = filtredSubCat
        }
        form.value.currentSubCategories ? scDisabled.value = false : scDisabled.value = true

        onChangeSubCategorySelector()
        if(form.value.currentSubCategories) {
            unHighlight('subcategory-selector')
        }
    }

    function onChangeSubCategorySelector() {
        form.value.percentagePart1 = gObjectParameter1ByParameter2(db.value.subCategories, 'percentage_part1', 'id',form.value.spendSubCategory)        
        form.value.percentagePart2 = gObjectParameter1ByParameter2(db.value.subCategories, 'percentage_part2', 'id',form.value.spendSubCategory)
        setHandleSpendAmount(form.value.spendAmount, form.value.percentagePart1, form.value.percentagePart2)
    }

    function setHandleSpendAmount(spendAmount, percetagePart1, percetagePart2) {
      const { newSpendAmount, amountPart1, amountPart2 } = handleSpendAmount(spendAmount, percetagePart1, percetagePart2)
      form.value.spendAmount = newSpendAmount
      form.value.amountPart1 = amountPart1
      form.value.amountPart2 = amountPart2
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

    // Remove Highlight if there is description
    function handleDescription() {
        unHighlight('spend-description')
    }
    
    // Send to Database
    const message = ref({
        success: false,
        text: ''
    })
    const submitHandler = async () => {
        let formData = new FormData();

        let spendReference = generateRefCode(9)
        while ( isValueExist(db.value.spends, "reference", spendReference) ) {
            spendReference = generateRefCode(9)
        }
        const participantId = gObjectParameter1ByParameter2(db.value.participants, 'id', 'name', form.value.participantsNames)
        const descriptionCapitalized = capitalCase(form.value.description)

        if(!form.value.spendSubCategory || !form.value.spendAmount || !participantId) {
            // 12 is the ID of the category "Autres"
            if (form.value.spendCategory == '12') { 
                if (!form.value.description) {
                    message.value = {
                        success: false,
                        text: 'Vous devez renseigner une description quand la catégorie est "AUTRES"'
                    }
                    highlight('spend-description')
                }
            } else {
                if(!form.value.spendCategory) { highlight('category-selector') }
                if(!form.value.spendSubCategory) { highlight('subcategory-selector') }
                if(!form.value.spendAmount) { highlight('spend-amount') }
                if(!participantId) { highlight('participant') }
                message.value = {
                    success: false,
                    text: 'Vous devez valider tous les champs'
                } 
            }
            return
        }

        formData.append('reference', spendReference)
        formData.append('categories_id', form.value.spendCategory)
        formData.append('sub_categories_id', form.value.spendSubCategory)
        formData.append('total_amount', form.value.spendAmount)
        formData.append('part1_amount', form.value.amountPart1)
        formData.append('part2_amount', form.value.amountPart2)
        formData.append('part1_percentage', form.value.percentagePart1)
        formData.append('part2_percentage', form.value.percentagePart2)
        formData.append('spend_date', form.value.dateValue)
        formData.append('users_id', participantId)
        formData.append('description', descriptionCapitalized)

        axios
        .post(store.state.api.spendsTable, formData) 
        .then((response) => {
            message.value = {
                success: true,
                text: 'Montant envoyé avec succès'
            }
            setTimeout(() => {
                window.location.reload()
            }, 2000);
            console.log('post success')
        })
        .catch(error => {
            console.log(error)
        })
    }



    onMounted(async() => {
        content = await store.state.api.content
        db.value.categories = await getTable(store.state.api.categoriesTable)
        db.value.subCategories = await getTable(store.state.api.subCategoriesTable)
        db.value.participants = await getTable(store.state.api.participantsTable)
        await gSpends()
        storeParticipants()
        defaultPercentages()
    })

</script>

<template>
    <form @submit.prevent="submitHandler" class="w-full bg-white p-6 rounded-md border shadow-md">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <div class="col-span-2 md:col-span-1">
                <label 
                    for="category-selector"
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-0 md:mb-2"
                    >
                    {{ data('category') }}
                    
                </label>
                <select 
                    id="category-selector" 
                    class="bg-white rounded-md border border-gray-300 px-4 py-2 text-sm"
                    v-model="form.spendCategory"
                    @change="onChangeCategorySelector"
                >
                    <option value="" selected disabled> {{ data('choose_category') }}</option>
                    <option 
                        v-for="category in db.categories" :key="category.id"
                        :value="category.id" 
                    >
                        {{ category.category_label }}
                    </option>
                </select>
            </div>
            <div class="col-span-2 md:col-span-1">
                <label 
                    for="category-selector"
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-0 md:mb-2"
                    >
                    {{ data('subcategory') }}
                </label>
                <select 
                    id="subcategory-selector" 
                    class="bg-white rounded-md border border-gray-300 px-4 py-2 text-sm"
                    v-model="form.spendSubCategory"
                    :disabled="scDisabled"
                    @change="onChangeSubCategorySelector"
                >
                <option value="title" selected disabled> {{ data('choose_subcategory') }}</option>
                    <option 
                        v-for= "subCategory in form.currentSubCategories" :key="subCategory.id"
                        :value="subCategory.id"
                    >
                        {{ subCategory.subcategory_label }}
                    </option>
                </select>
            </div>
            <div class="col-span-2 md:col-span-1">
                <label 
                    for="grid-first-name"
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-0 md:mb-2"
                    >
                    {{ data('amount') }}
                </label>
                <div class="flex flex-row">
                    <input 
                        type="Number"
                        step="0.01"
                        id="spend-amount"   
                        v-model="form.spendAmount"
                        class="bg-white rounded-md border border-gray-300 px-4 py-2 text-sm"
                        @input="setHandleSpendAmount(form.spendAmount, form.percentagePart1, form.percentagePart2)"
                        @click="form.spendAmount = null"
                    >
                    <span class="bg-gray-200 rounded-md border border-gray-300 px-4 py-2 text-sm ml-3">€</span>
                </div>
            </div>
            <div class="col-span-2 md:col-span-1">
                <label 
                    for="grid-first-name"
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-0 md:mb-2"
                    >
                    {{ data('date') }}
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
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-0 md:mb-2"
                    >
                    {{ data('paid_by') }}
                </label>
                <select 
                    id="participant" 
                    class="bg-white rounded-md border border-gray-300 px-4 py-2 text-sm"
                    v-model="form.participantsNames"
                    @click="unHighlight('participant')"
                >
                    <option 
                        v-for="participant in db.participants" :key="participant.id"
                        :value="participant.name" 
                    >
                        {{ participant.name }}
                    </option>
                </select>
            </div>
            <div class="col-span-2 md:col-span-1">
                <label 
                    for="amount-part1"
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-0 md:mb-2"
                    >
                    {{ data('part') }} 1 - 
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
                            step="0.01"
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
                            step="0.01"
                            class="appearance-none block h-8 bg-gray-200 text-gray-700 border border-gray-400 rounded py-3 leading-tight focus:outline-none focus:bg-white"
                            id="amount-part1"
                            v-model="form.amountPart1"
                            @input="handlePartAmount(form.amountPart1, 'part1')"
                        >
                        <h4 class="px-2 rounded-full">€</h4>
                    </div>
                </div>
            </div>
            <div class="col-span-2 md:col-span-1">
                <label 
                    for="amount-part2"
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-0 md:mb-2"
                    >
                    {{ data('part') }} 2 - 
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
                            step="0.01"
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
                            step="0.01"
                            class="appearance-none block h-8 bg-gray-200 text-gray-700 border border-gray-400 rounded py-3 leading-tight focus:outline-none focus:bg-white"
                            id="amount-part2"
                            v-model="form.amountPart2"
                            @input="handlePartAmount(form.amountPart2, 'part2')"
                        >
                        <h4 class="px-2 rounded-full">€</h4>
                    </div>
                </div>
            </div>
            <div class="col-span-2">
                <span>
                    <label 
                        for="spend-description"
                        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-0 md:mb-2"
                        >
                        {{ data('description') }}  ( {{ data('50_characters') }} )
                    </label>
                </span>
                <input
                    type="text"
                    name="spend-description" 
                    id="spend-description"
                    class="col-span-2"
                    maxlength="50"
                    v-model="form.description"
                    @input="handleDescription"
                >
            </div>
            <div class="w-full col-span-2 flex flex-row justify-end">
                <div 
                    v-if="message.text" 
                    class="text-center text-sm text-white p-3 rounded-md w-full"
                    :class="message.success ? 'bg-green-500' : 'bg-red-500'"
                >
                    {{ message.text }}
                </div>
                <button 
                    type="submit"
                    class="btn bg-primary-middle"
                    >
                    {{ data('save_spend') }}
                </button>
            </div>
        </div> 
    </form>
</template>