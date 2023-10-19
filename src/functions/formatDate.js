import { getDays } from '@/store/functions'

export function formatLongDate(date) {
    // const weekDays = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const weekDays = getDays();

    // Analyse date
    const analizedDate = new Date(date);
    
    // Get days names
    const weekDay = weekDays[analizedDate.getDay()];
    
    // Get day, month, and year
    const day = analizedDate.getDate();
    const month = analizedDate.getMonth() + 1; // Los meses en JavaScript se cuentan desde 0
    const year = analizedDate.getFullYear();

    // Add 0 at the beginning if it's a 1 number
    let formattedDay = day < 10 ? `0${day}` : day;
    let formattedMonth = month < 10 ? `0${month}` : month;

    // Format the date
    const formattedDate = `${weekDay} ${formattedDay}/${formattedMonth}/${year}`;
    
    return formattedDate;
}

export function formatShortDate(date) {
    // Analyse date
    const analizedDate = new Date(date);
    // Get day, month, and year
    const day = analizedDate.getDate();
    const month = analizedDate.getMonth() + 1; // Los meses en JavaScript se cuentan desde 0
    const year = analizedDate.getFullYear();
    // Add 0 at the beginning if it's a 1 number
    let formattedDay = day < 10 ? `0${day}` : day;
    let formattedMonth = month < 10 ? `0${month}` : month;
    // Format the date
    const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
    return formattedDate;
}