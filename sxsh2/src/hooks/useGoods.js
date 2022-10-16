import { message } from "ant-design-vue"
import { reactive, ref } from "vue"
import store, {
    STA_GOODS,
    SET_GOODS,
    DEL_GOODSITEM,
    SET_GOODSITEM,
    GET_GOODSTYPE,
} from "~/config/store.js"
import moment from "moment"
import { download } from "~/lib/utils"
import { queryBarcodeAPI } from "~/lib/api.js"
import pyutils from "~/lib/pinyin.js"
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

    const goodsForm = reactive({
        sBarCode: "",
        sName: "",
        sPinyin: "",
        sType: [],
        sSpec: "",
        dPrice: 0.0,
        dVip: 0.0,
        dCost: 0.0,
        sPinyin: "",
    })

    const loading = ref(false)

    const getGoodsType = (weight = typeWeight) => {
        const goodsTypelist = store.getters[GET_GOODSTYPE]
        const typeList = store.getters[GET_GOODSTYPE].sort(
            (a, b) => (weight[b] ?? 0) - (weight[a] ?? 0),
        )
        return typeList
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
        searchGoods()
        message.success("删除成功")
    }

    const exportGoodsJson = () => {
        download(
            "goods.js",
            "export%20default%20" + localStorage.getItem(STA_GOODS),
        )
    }

    const importGoodsJson = (info) => {
        var reader = new FileReader()
        reader.onload = function (evt) {
             try {
                const text = evt.target.result
                const goods = JSON.parse(text.substr(text.indexOf("[")))
                store.commit(SET_GOODS, goods)
                localStorage.setItem(STA_GOODS, JSON.stringify(goods))
                searchGoods()
                message.success(`${info.file.name} 导入成功`)
             } catch (e) {
                 message.error(`${info.file.name} 导入失败: `+e)
             }
        }
        reader.readAsText(info.file)
    }

    const queryBarcode = async (barcode) => {
        if (!barcode) {
            return
        }

        loading.value = true
        // 如果在 localStorage,优先返回
        const fetchGoods = store.state[STA_GOODS].find(
            (g) => g.sBarCode === barcode,
        )
        if (fetchGoods) {
            goodsForm.sBarCode = fetchGoods.sBarCode
            goodsForm.sName = fetchGoods.sName
            goodsForm.sPinyin = fetchGoods.sPinyin
            goodsForm.sType = fetchGoods.sType.split(",")
            goodsForm.sSpec = fetchGoods.sSpec
            goodsForm.dPrice = fetchGoods.dPrice
            goodsForm.dVip = fetchGoods.dVip
            goodsForm.dCost = fetchGoods.dCost
            goodsForm.iPricing = fetchGoods.iPricing
            goodsForm.sPinyin = fetchGoods.sPinyin
            goodsForm.action = fetchGoods.action
            loading.value = false
            return
        }

        try {
            const reply = await queryBarcodeAPI(barcode)
            if (reply.data.code === 1) {
                goodsForm.sBarCode = reply.data.data.barcode
                goodsForm.dPrice = reply.data.data.price
                goodsForm.sSpec = reply.data.data.standard
                goodsForm.sName = reply.data.data.goodsName
            } else {
                goodsForm.sBarCode = barcode
                goodsForm.sName = ""
                goodsForm.sSpec = ""
                goodsForm.dPrice = goodsForm.dVip = 0
            }
        } finally {
            loading.value = false
        }

        
    }

    const saveGoods = () => {
        const saveData = JSON.parse(JSON.stringify(goodsForm))

        if (!saveData.sName || !saveData.sName) {
            message.error("商品条码或商品名称不能为空")
            return
        }

        saveData.sType = saveData.sType.join("")
        saveData.dPrice = (+saveData.dPrice).toFixed(2)
        saveData.dCost = (+saveData.dCost).toFixed(2)
        saveData.dVip = (+saveData.dVip).toFixed(2)
        saveData.dVip = (+saveData.dVip).toFixed(2)

        saveData.dtCreateTime = moment().format("YYYY-MM-DD hh:mm:ss")
        saveData.dtUpdateTime = moment().format("YYYY-MM-DD hh:mm:ss")
        saveData.iStatus = 1

        store.commit(SET_GOODSITEM, saveData)
        message.success("保存成功")
    }

    const isStorage = () => {
        return !!store.state[STA_GOODS].find(
            (g) => g.sBarCode === goodsForm.sBarCode,
        )
    }

    const makePinyin = () => {
        goodsForm.sPinyin = pyutils.chineseToFirstLetter(goodsForm.sName)
    }


    const makeCode = () => {
        goodsForm.sBarCode = new Date().getTime() + 2e12
        goodsForm.sType = ["无条码"]
        goodsForm.sName = goodsForm.sPinyin = goodsForm.sSpec = ""
    }

    return {
        loading,
        filter,
        goodsList,
        goodsForm,
        isStorage,
        makeCode,
        dropGoods,
        saveGoods,
        makePinyin,
        searchGoods,
        queryBarcode,
        getGoodsType,
        exportGoodsJson,
        importGoodsJson,
    }
}
