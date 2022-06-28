
export function debounce(fn, timer, ms = 600) {
    clearTimeout(timer)
    return setTimeout(fn, ms);
}