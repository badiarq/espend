export function removeChildren(parentNodeId) {
    const selectorDOM = document.getElementById(parentNodeId);        
    let child = selectorDOM.lastElementChild; 
    while (child) {
        selectorDOM.removeChild(child);
        child = selectorDOM.lastElementChild;
    }
}