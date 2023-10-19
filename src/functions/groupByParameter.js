export function groupByParameter(data, parameter) {
    const groupedData = {};
    for (const item of data) {
        const date = item[parameter];
        if (!groupedData[date]) {
            groupedData[date] = [];
        }
        groupedData[date].push(item);
    }
    return groupedData
}