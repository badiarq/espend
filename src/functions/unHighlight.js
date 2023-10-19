export function unHighlight(id) {
    const DOM = document.getElementById(id)
    if (DOM.classList.contains('border-red-500')) {
        DOM.classList.remove('border-red-500')
        DOM.classList.remove('border-2')
    }
}