import { createStore } from 'vuex'
import { getTable
} from '../store/functions.js'

const store = createStore({
    state () {
        async function gData() {
            const data = await getTable('https://x8ki-letl-twmt.n7.xano.io/api:YGQ3vho5/content')
            return data
        }

        return {
            api: {
                contentTable: 'https://x8ki-letl-twmt.n7.xano.io/api:YGQ3vho5/content',
                participantsTable: 'https://x8ki-letl-twmt.n7.xano.io/api:YGQ3vho5/partipants',
                categoriesTable: 'https://x8ki-letl-twmt.n7.xano.io/api:YGQ3vho5/categories',
                subCategoriesTable: 'https://x8ki-letl-twmt.n7.xano.io/api:YGQ3vho5/sub_categories',
                spendsTable: 'https://x8ki-letl-twmt.n7.xano.io/api:YGQ3vho5/spends',
                content: gData()
            }
        }
    },
})

export default store;