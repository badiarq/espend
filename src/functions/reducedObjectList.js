import { groupByParameter } from './groupByParameter.js';

function reducedObjectList(data, numberOfElements) {
    const reducedObjectList = {};
    let counter = 0;
    for (const key in data) {
        if (counter < numberOfElements) {
            reducedObjectList[key] = data[key];
            counter++;
        } else {
            return reducedObjectList
            break;
        }
    }
    return reducedObjectList
}

export function reducedObjectListByCategory(data, category, numberOfElements) {
    const groupedData = groupByParameter(data, category)
    return reducedObjectList(groupedData, numberOfElements)
}