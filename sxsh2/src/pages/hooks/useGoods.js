
import { reactive, ref } from "vue"
import store, {
    STA_GOODS,
    DEL_GOODSITEM,
    GET_GOODSTYPE,
} from "~/config/store.js"

export default () => {
    const filter = reactive({
        keyword: "",
        type: "",
    })

    const goodsList = ref(store.state[STA_GOODS])

    const getGoodsType = () => {
        return store.getters[GET_GOODSTYPE]
    }

    const searchGoods = () => {
        let field = !isNaN(filter.keyword)
            ? "sBarCode"
            : /[\u4e00-\u9fa5]+/.test(filter.keyword)
            ? "sName"
            : "sPinyin"

        let goods = store.state[STA_GOODS].filter(
            (g) =>
                g[field]
                    .toString()
                    .toLowerCase()
                    .indexOf(filter.keyword.toLowerCase()) >= 0 &&
                (filter.type.length ? g.sType === filter.type : true),
        )
        goodsList.value = goods
    }


    const dropGoods = (record) => {
        store.commit(DEL_GOODSITEM, record.sBarCode)
    }

    return {
        filter,
        goodsList,
        dropGoods,
        searchGoods,
        getGoodsType,
    }
}