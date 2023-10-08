<script setup>
import SearchBar from '@/layout/SearchBar.vue';
    // Get Content
        import { ref, onMounted } from 'vue'
        import { useStore } from 'vuex'
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
    <SearchBar>
        <input 
            type="text"
            class="appearance-none block h-8 my-2 bg-gray-200 text-gray-700 border border-gray-400 rounded leading-tight focus:outline-none focus:bg-white"
            id="searching-bar"
            :placeholder= "data('search...')"
            @blur="handleSearchBar()"
            v-model="form.searched"
        >
    </SearchBar>
</template>