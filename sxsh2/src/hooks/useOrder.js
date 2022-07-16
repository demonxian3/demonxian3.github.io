import { reactive, ref } from "vue"
import { computed, onActivated } from "@vue/runtime-core"
import store, { STA_ORDER } from "~/config/store.js"
import { download } from '~/lib/utils'

export default () => {
    const filter = reactive({
        keyword: "",
        type: "",
    })

    const orderList = computed(() => {
        if (filter.keyword) {
            return store.state[STA_ORDER].filter(
                (item) => JSON.stringify(item).indexOf(filter.keyword) >= 0,
            )
        }
        return store.state[STA_ORDER]
    })

    const orders = store.state[STA_ORDER]


    const exportOrderJson = () => {
        download(
            "order.js",
            "export%20default%20" + localStorage.getItem(STA_ORDER),
        )
    }

    return {
        exportOrderJson,
        orders,
        filter,
        orderList,
    }
}
