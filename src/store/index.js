import { createApp } from 'vue'
import { createStore } from 'vuex'

const store = createStore({
    state () {
        return {
            api: {
                // getCategories: '../src/data/mycategories.json',
                participants: 'https://x8ki-letl-twmt.n7.xano.io/api:YGQ3vho5/partipants',
                getCategories: 'https://x8ki-letl-twmt.n7.xano.io/api:YGQ3vho5/categories',
                getSubCategories: 'https://x8ki-letl-twmt.n7.xano.io/api:YGQ3vho5/sub_categories',
                postData: 'https://x8ki-letl-twmt.n7.xano.io/api:YGQ3vho5/spends',
            }
        }
    },
})

export default store;