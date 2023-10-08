<script setup>
    import ListLayout from '@/layout/ListLayout.vue'
    import SearchSpends from '@/components/SearchSpends.vue'
    import LastSpends from '@/components/LastSpends.vue'
    import LastSpendsTitle from '@/components/LastSpendsTitle.vue'
</script>

<template>
    <ListLayout>
        <LastSpendsTitle />
        <SearchSpends />
        <LastSpends />
    </ListLayout>
</template>