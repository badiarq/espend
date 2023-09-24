import { createApp } from 'vue'
import { createStore } from 'vuex'

const store = createStore({
    state () {
        return {
            api: {
                getCategories: '../src/data/mycategories.json',
                getPercentage: '../src/data/percentage.json',
                postData: 'https://x8ki-letl-twmt.n7.xano.io/api:2e9hGhWt/percentage'
            }
        }
    },
})

export default store;