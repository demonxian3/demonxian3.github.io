import enUS from "ant-design-vue/es/locale/en_US"
import zhCN from "ant-design-vue/es/locale/zh_CN"
import { ref } from "@vue/reactivity"
import dayjs from "dayjs"
import "dayjs/locale/zh-cn"
import "dayjs/locale/en"

export default () => {
    const locale = ref(zhCN.locale)

    const toggleLang = () => {
        locale.value = locale.value === "en" ? "cn" : "en"
        dayjs.locale(locale.value)
    }

    return {
        zhCN,
        enUS,
        locale,
        toggleLang,
    }
}
