<script setup>
import CreateSpend from '@/components/CreateSpend.vue'
import LastSpendsModule from '@/components/LastSpendsModule.vue';
import TabBar from '../components/TabBar.vue';
</script>

<template>
    <main class="container py-8">
        <TabBar />
        <div class="my-2"></div>        
        <CreateSpend />
        <div class="my-2"></div>
        <LastSpendsModule />
    </main>
</template>

<style>

</style>