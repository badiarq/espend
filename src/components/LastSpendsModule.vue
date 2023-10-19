<script setup>
    import ListLayout from '@/layout/ListLayout.vue'
    import SearchSpends from '@/components/SearchSpends.vue'
    import LastSpends from '@/components/LastSpends.vue'
    import LastSpendsTitle from '@/components/LastSpendsTitle.vue'
</script>

<template>
    <div class="bg-gray-100 rounded-md shadow-md">
        <ListLayout>
            <LastSpendsTitle />
            <SearchSpends />
        </ListLayout>
        <div class="h-2"></div>
        <LastSpends />
    </div>
</template>