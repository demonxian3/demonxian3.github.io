const STATUS_PENDING = 0
const STATUS_PAYING = 1
const STATUS_FINISH = 2

export default (onNotice = null, ms = 1000) => {
    let lastMessage = ""
    let noticeTimer = 0
    let listenKey = "message"

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
        localStorage.setItem(
            listenKey,
            JSON.stringify({ price, status: STATUS_PAYING }),
        )
    }

    return {
        addTimer,
        removeTimer,
        paying,
    }
}
