
import { message } from 'ant-design-vue'
import { reactive, ref } from "vue"
import store, {
    STA_GOODS,
    DEL_GOODSITEM,
    GET_GOODSTYPE,
} from "~/config/store.js"
import { download } from '../../lib/utils'

export default () => {
    const typeWeight = {
        无条码: 99,
        零食: 88,
        啤酒: 87,
        国内烟草: 82,
        果汁: 80,
        奶茶: 79,
        牛奶: 77,
        方便面: 75,
        茶饮料: 73,
        白酒: 72,
        汽水: 60,
        矿泉水: 50,
        功能饮料: 40,
        雪糕: 32,
        日用品: 31,
        鸡尾酒: 30,
        出口烟草: 29,
        进口烟草: 28,
        洋酒: 27,
        红酒: 26,
        无分类: 25,
        医疗用品: 20,
    }


    const filter = reactive({
        keyword: "",
        type: "",
    })

    const goodsList = ref(store.state[STA_GOODS])

    const getGoodsType = () => {
        const goodsTypelist = store.getters[GET_GOODSTYPE]
        const typeList = store.getters[GET_GOODSTYPE].sort(
            (a, b) => (typeWeight[b] ?? 0) - (typeWeight[a] ?? 0)
        )
        return typeList;
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
        store.commit(DEL_GOODSITEM, record.sBarCode);
        searchGoods();
        message.success('删除成功')
    }

    const exportGoodsJson = () => {
        download('goods.js',   "export%20default%20"+ localStorage.getItem(STA_GOODS))
    }

    return {
        filter,
        goodsList,
        dropGoods,
        searchGoods,
        getGoodsType,
        exportGoodsJson,
    }
}