import axios from 'axios'
import { addNewOption } from './addNewOption.js';
import { removeChildren } from './removeChildren.js';
let lang = 'fr'
let content = {}
content = await getTable('https://x8ki-letl-twmt.n7.xano.io/api:YGQ3vho5/content')

// Function of getting content
function data(name) {
    return gData(content, name)
}

export function gData(database, name) {
    return gObjectParameter1ByParameter2(database, lang, 'code', name) 
}

export async function getTable(originUrl) {
    try {
        const response = await axios.get(originUrl)
        return response.data
    } catch (e) {
        console.log(e)
    }
}

export function gObjectParameterById(object, parameter, id) {
    for (const itemId in object) {
      if (object[itemId][id]=== id) {
        return object[itemId][parameter];
      }
    }
    return null;
}

export function gObjectParameter1ByParameter2(object, parameterName1, parameterName2, parameterValue2) {
    for (const itemId in object) {
      if (object[itemId][parameterName2] === parameterValue2) {
        return object[itemId][parameterName1];
      }
    }
    return null;
}

export function resetSubCategories() {
    const SelectorId = 'subcategory-selector'
    const subCategoryTitle = 'subcategory-title'
    const selectorDOM = document.getElementById(SelectorId)
    removeChildren(SelectorId)
    addNewOption(SelectorId, subCategoryTitle, data('choose_subcategory'),subCategoryTitle)
    const subCategoryDOM = document.getElementById(subCategoryTitle)
    subCategoryDOM.disabled = true
    selectorDOM.insertBefore(subCategoryDOM, selectorDOM.firstChild);
}

export function getDays() {
    const days = [];
    days.push(data('sunday'))
    days.push(data('monday'))
    days.push(data('tuesday'))
    days.push(data('wednesday'))
    days.push(data('thursday'))
    days.push(data('friday'))
    days.push(data('saturday'))
    return days
}