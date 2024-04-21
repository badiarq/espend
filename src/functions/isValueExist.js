export function isValueExist(database, column, value) {

    let existingValues = [];

    database.forEach(e => {
        existingValues.push(e[column])
    });
    
    return existingValues.includes(value) ? true : false;
}