import {
    AlipayCircleFilled,
    CreditCardFilled,
    QrcodeOutlined,
    RedEnvelopeFilled,
    WechatOutlined,
} from "@ant-design/icons-vue"

import wechatPay from "~/assets/wechat.png"
import aliPay from "~/assets/alipay.png"
import { message } from "ant-design-vue"

export const STATUS_PENDING = 0
export const STATUS_PAYING = 1
export const STATUS_FINISH = 2

export default (onNotice = null, ms = 1000) => {
    let windowObjectReference = null
    let lastMessage = ""
    let noticeTimer = 0
    let listenKey = "message"
    let timer = 0

    const paywayMap = {
        scan: {
            label: "扫码",
            icon: QrcodeOutlined,
            color: "text-dark-500",
        },
        wechat: {
            label: "微信",
            icon: WechatOutlined,
            color: "text-green-400",
            image: wechatPay,
        },
        alipay: {
            label: "支付宝",
            icon: AlipayCircleFilled,
            color: "text-blue-500",
            image: aliPay,
        },
        cash: {
            label: "现金",
            icon: RedEnvelopeFilled,
            color: "text-red-600",
        },
        bank: {
            label: "银联",
            icon: CreditCardFilled,
            color: "text-purple-500",
        },
    }

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
    const paying = (price, payway) => {
        clearTimeout(timer)
        localStorage.setItem(
            listenKey,
            JSON.stringify({ price, payway, status: STATUS_PAYING }),
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
        const openWindow = (availWidth, availHeight, availLeft, availTop) => {
            const config = `
                width=${availWidth}, 
                height=${availHeight}, 
                left=${availLeft}, 
                top=${availTop}, 
                popup=1,
                location=no
                `

            if (windowObjectReference) {
                message.warning("已经打开过新窗口了")
                return
            }

            windowObjectReference = window.open(
                "/#/jumbotron",
                "newWindow",
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
        }

        try {
            getScreenDetails().then((res) => {
                const bakScreen = res.screens.find((s) => !s.isPrimary)
                const { availWidth, availHeight, availLeft, availTop } =
                    bakScreen
                openWindow(availWidth, availHeight, availLeft, availTop)
            })
        } catch (e) {
            openWindow(1280, 800, 1280, 0)
            console.log(e)
        }
    }

    return {
        paywayMap,
        openNotice,
        addTimer,
        removeTimer,
        paying,
        pending,
        settle,
    }
}
