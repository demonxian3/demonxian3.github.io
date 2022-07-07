import {
    AlipayCircleFilled,
    CreditCardFilled,
    QrcodeOutlined,
    RedEnvelopeFilled,
    WechatOutlined,
} from "@ant-design/icons-vue"

import wechatPay from "~/assets/wechat.png"
import aliPay from "~/assets/alipay.png"

export const STATUS_PENDING = 0
export const STATUS_PAYING = 1
export const STATUS_FINISH = 2

export default (onNotice = null, ms = 1000) => {
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
        console.log(payway)
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
        const { availWidth } = 1280
        const { availHeight } = 800
        const { availLeft } = 1280
        const { availTop } = 0

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
