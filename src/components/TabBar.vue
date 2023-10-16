<script setup>
    import router from '@/router';
    import LightLayout from '@/layout/LightLayout.vue';

        // Get Content
        import { ref, onMounted } from 'vue'
        import { useStore } from 'vuex'
        import {
            gData
        } from '@/store/functions.js'
        const store = useStore()
        const form = ref({
            content: {}
        })
        function data(name) {
            return gData(form.value.content, name)
        }
        onMounted(async() => {
            form.value.content = await store.state.api.content
        })

    function redirectToStatistics() {
        router.push('/statistics');
    }
</script>

<template>
    <LightLayout>
        <div class="flex flex-raw justify-evenly">
            <div class="img-btn-container">        
                <img
                    class="img-btn h-8 w-8"
                    src="@/assets/stats.svg"
                    alt="Statistics Image"
                    :title="data('statistics')"
                    @click="redirectToStatistics"
                >
                <p class="text-xs">{{ data('statistics') }}</p>
            </div>
        </div>
    </LightLayout>
  </template>