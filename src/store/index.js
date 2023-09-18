import { createApp } from 'vue'
import { createStore } from 'vuex'

const store = createStore({
    state () {
        return {
            title: 'Hello from store',
        }
    },
})

export default store;