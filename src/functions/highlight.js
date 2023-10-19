export function highlight(id) {
    const DOM = document.getElementById(id)
    DOM.classList.add('border-red-500')
    DOM.classList.add('border-2')
}