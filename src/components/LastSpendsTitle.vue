<script setup>
    // Get Content
    import { ref, onMounted } from 'vue'
        import { useStore } from 'vuex'
        import router from '@/router';
        import {
            gData
        } from '@/store/functions.js'
        const store = useStore()
        const form = ref({
            content: {},
            test: 'hallo'
        })
        function data(name) {
            return gData(form.value.content, name)
        }
        onMounted(async() => {
            form.value.content = await store.state.api.content
        })

    function handleSearchBar() {
        console.log('handleSearchBar function runned')
    }
</script>

<template>
    <div class="flex justify-between items-center mb-2">
        <h3 
            class="text-base md:text-xl font-bold leading-none text-gray-900 dark:text-white"
            >
                {{ data('last_spends') }}
            </h3>
        <a 
            href="#" 
            class="text-xs md:text-sm text-end font-medium text-blue-600 hover:underline dark:text-blue-500"
            @click="router.push('/view-all-spends')"
            >
                {{ data('all_spends') }}
        </a>
    </div>
</template>