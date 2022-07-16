import { debounce } from "~/lib/utils.js"

export default function useEvent(
    onBeforeMount,
    onUnmounted,
    onActivated,
    onDeactivated,
) {
    let timer = 0;
    let scanResult = '';
    let hasListener = false
    // 保证listener只存在一次，避免反复重复添加
    const addEventHandleOnce = (e, handle, name) => {
        const listenerSwitch = (bind, hook) => {
            if (bind === hasListener) return
            console.log( `[LOG] ${bind ? "add" : "remove"}_listener ${name} on ${hook}` )
            hasListener = bind
            bind
                ? window.addEventListener(e, handle)
                : window.removeEventListener(e, handle)
        }

        onBeforeMount(() => listenerSwitch(true, "beforeMount"))
        onUnmounted(() => listenerSwitch(false, "unmounted"))
        onActivated(() => listenerSwitch(true, "activated"))
        onDeactivated(() => listenerSwitch(false, "deactived"))
    }

    const listenCodeScanGun = (callback) => (e) => {
        if (document.activeElement.tagName !== "INPUT") {
            if (!timer) {
                scanResult = ""
            }

            if (e.key.length === 1) {
                scanResult += e.key
            }

            timer = debounce(() => {
                timer = 0
                // if (e.key === "Enter") {
                callback(scanResult)
                // }
            }, timer)
        }
    } 

    return {
        addEventHandleOnce,
        listenCodeScanGun,
    }
}
