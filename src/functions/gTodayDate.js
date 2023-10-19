export function gTodayDate() {
    const date = new Date() 
    const formattedDate = date.toISOString().slice(0, 10)
    return formattedDate
}