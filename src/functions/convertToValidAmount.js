export function convertToValidAmount(amount){
    amount = Math.abs(parseFloat(amount).toFixed(2));
    return amount
}