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