export const STATUS_PENDING = 0
export const STATUS_PAYING = 1
export const STATUS_FINISH = 2

export default (onNotice = null, ms = 1000) => {
    let lastMessage = ""
    let noticeTimer = 0
    let listenKey = "message"
    let timer = 0;

    const addTimer = () => {
        noticeTimer = setInterval(() => {
            try {
                const currentMsg = localStorage.getItem(listenKey)
                if (currentMsg !== lastMessage) {
                    const message = JSON.parse(currentMsg)
                    if (typeof onNotice === "function") {
                        onNotice(message)
                    }
                    lastMessage = currentMsg
                }
            } catch (e) {
                console.log(e)
            }
        }, ms)
    }
    const removeTimer = () => {
        clearInterval(noticeTimer)
    }
    const paying = (price) => {
        clearTimeout(timer)
        localStorage.setItem(
            listenKey,
            JSON.stringify({ price, status: STATUS_PAYING }),
        )
    }
    const pending = () => {
        localStorage.setItem(
            listenKey,
            JSON.stringify({ status: STATUS_PENDING }),
        )
    }

    const settle = () => {
        localStorage.setItem(
            listenKey,
            JSON.stringify({ status: STATUS_FINISH }),
        )

        timer = setTimeout(() => {
            pending()
        }, 7000)
    }

    const openNotice = () => {
        getScreenDetails().then((res) => {
            const { availWidth } = res.screens[1]
            const { availHeight } = res.screens[1]
            const { availLeft } = res.screens[1]
            const { availTop } = res.screens[1]

            const config = `
                width=${availWidth}, 
                height=${availHeight}, 
                left=${availLeft}, 
                top=${availTop}, 
                popup=1,
                location=no
                `
            let windowObjectReference = window.open(
                "/#/jumbotron",
                "_blank",
                config,
            )
            let timer = setInterval(() => {
                if (windowObjectReference && !windowObjectReference.closed) {
                    const fullScreen = () =>
                        !windowObjectReference.document.fullscreenElement &&
                        windowObjectReference.document.documentElement.requestFullscreen()
                    windowObjectReference.visibilitychange =
                        windowObjectReference.onload =
                        windowObjectReference.onfocus =
                            fullScreen
                    clearInterval(timer)
                }
            }, 500)
        })
    }

    return {
        openNotice,
        addTimer,
        removeTimer,
        paying,
        pending,
        settle,
    }
}
