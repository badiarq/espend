<script setup>
    import router from '@/router';
    import LightLayout from '@/layout/LightLayout.vue';

        // Get Content
        import { ref, onMounted } from 'vue'
        import { useStore } from 'vuex'
        import { 
            gData
        } from '@/functions'
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

    function redirectToHome() {
        router.push('/');
    }
</script>

<template>
    <LightLayout>
        <div class="relative">
            <img
                class="img-btn h-8 w-8 absolute z-20        "
                src="@/assets/home.svg"
                alt="Home image"
                :title="data('home')"
                @click="redirectToHome"
            >
            <div class="powerbi-container">
                <iframe 
                    title="231015 F-Pers - Xano" 
                    src="https://app.powerbi.com/reportEmbed?reportId=0cb9b7e1-ea39-4882-a881-ac6432564084&autoAuth=true&ctid=066d0cfb-e2e6-48f0-93a4-15c5c8979a86" 
                    frameborder="0" 
                    allowFullScreen="true">
                </iframe>
            </div>
        </div>
    </LightLayout>
</template>