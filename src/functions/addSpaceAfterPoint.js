export function addSpaceAfterPoint(text) {
    const newText = text.replace(/(\.)([^ ])/g, '$1 $2');
    return newText;
}