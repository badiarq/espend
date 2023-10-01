import axios from 'axios'

export async function getTable(originUrl) {
    try {
        const response = await axios.get(originUrl)
        return response.data
    } catch (e) {
        console.log(e)
    }
}

export function convertToValidPercentage(percentage) {
    const result = Math.abs(percentage)
    const double = roundIfDouble(result)
    const permited = maxValuePermited(double, 100)
    return permited
}

export function countDecimals(value) { 
    if ((value % 1) != 0) {
        return value.toString().split(".")[1].length;  
		}
    return 0;
}

export function maxValuePermited(numberToCheck, maxValue) {
    if (numberToCheck > maxValue) {
        numberToCheck = +maxValue
    }
    return numberToCheck
}

export function roundIfDouble(value){
    if (countDecimals(value) > 0) {
        return Math.round(value)
    } else {
        return value
    }
}

export function convertToValidAmount(amount){
    amount = Math.abs(parseFloat(amount).toFixed(2));
    return amount
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

export function gTodayDate() {
    const date = new Date() 
    const formattedDate = date.toISOString().slice(0, 10)
    return formattedDate
}

export function highlight(id) {
    const DOM = document.getElementById(id)
    DOM.classList.add('border-red-500')
    DOM.classList.add('border-2')
}

export function unHighlight(id) {
    const DOM = document.getElementById(id)
    if (DOM.classList.contains('border-red-500')) {
        DOM.classList.remove('border-red-500')
        DOM.classList.remove('border-2')
    }
}