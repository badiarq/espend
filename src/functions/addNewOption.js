export function addNewOption(parentNodeId, optionId, optionText, optionValue) {
    const selectorDOM = document.getElementById(parentNodeId);
    const optionNode = document.getElementById(optionId)
    if(!optionNode) {
        const newOption = document.createElement('option');
        newOption.setAttribute("id", optionId)
        const newSubCategory = document.createTextNode(optionText)
        newOption.appendChild(newSubCategory)   
        newOption.setAttribute('value', optionValue)
        selectorDOM.appendChild(newOption)
    }
}