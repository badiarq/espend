import { createStore } from 'vuex'
import { 
    getTable
} from '@/functions'

const store = createStore({
    state () {
        async function gData() {
            const data = await getTable('https://cabinetarchitecture.com/api/content')
            return data
        }

        return {
            api: {
                contentTable: 'https://cabinetarchitecture.com/api/content',
                participantsTable: 'https://cabinetarchitecture.com/api/participants',
                categoriesTable: 'https://cabinetarchitecture.com/api/categories',
                subCategoriesTable: 'https://cabinetarchitecture.com/api/sub_categories',
                spendsTable: 'https://cabinetarchitecture.com/api/spends',
                content: gData()
            }
        }
    },
})

export default store;