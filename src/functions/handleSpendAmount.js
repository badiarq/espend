import { unHighlight } from './unHighlight.js';
import { convertToValidAmount } from './convertToValidAmount.js';

export function handleSpendAmount(spendAmount, percentagePart1, percentagePart2) {
    unHighlight('spend-amount')
    const getSpendAmout = spendAmount
    const newSpendAmount = convertToValidAmount(getSpendAmout)
    const amountPart1 = newSpendAmount * percentagePart1 / 100
    const amountPart2 = newSpendAmount * percentagePart2 / 100
    return { newSpendAmount, amountPart1, amountPart2 }
}