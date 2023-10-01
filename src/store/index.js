import { createApp } from 'vue'
import { createStore } from 'vuex'

const store = createStore({
    state () {
        return {
            api: {
                // getCategories: '../src/data/mycategories.json',
                participantsTable: 'https://x8ki-letl-twmt.n7.xano.io/api:YGQ3vho5/partipants',
                categoriesTable: 'https://x8ki-letl-twmt.n7.xano.io/api:YGQ3vho5/categories',
                subCategoriesTable: 'https://x8ki-letl-twmt.n7.xano.io/api:YGQ3vho5/sub_categories',
                spendsTable: 'https://x8ki-letl-twmt.n7.xano.io/api:YGQ3vho5/spends',
            }
        }
    },
})

export default store;