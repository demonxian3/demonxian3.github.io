
export function debounce(fn, timer, ms = 600) {
    clearTimeout(timer)
    return setTimeout(fn, ms);
}

export function download(filename, content) {
    const elemA = document.querySelector("a")
    elemA.setAttribute("download", filename)
    elemA.setAttribute("href", `data:plain/text;charset=UTF-8,${content}`)
    elemA.click()
}