
import { reactive, ref } from "vue"
import { computed, onActivated } from "@vue/runtime-core"
import store, {
    STA_ORDER,
} from "~/config/store.js"

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

    return {
        filter,
        orderList,
    }
}