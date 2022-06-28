import { createStore } from "vuex"
import goodList from '~/data/goods.js'

export const STA_GOODS = 'goods';
export const STA_ORDER = "order";
export const STA_CURORDER = 'currentOrder';
export const ACT_LOADGOODS = "loadGoods"
export const ACT_LOADORDER = "loadOrder"
export const SET_GOODS = "setGoods"
export const SET_GOODSITEM = "setGoodsItem"
export const DEL_GOODSITEM = "delGoodsItem"
export const GET_GOODSTYPE = "getGoodsType"

export default createStore({
    state() {
        return {
            [STA_GOODS]: [],
            [STA_ORDER]: [],
            [STA_CURORDER]: {},
        }
    },
    mutations: {
        [SET_GOODS](state, info) {
            state[STA_GOODS] = info
        },
        [DEL_GOODSITEM](state, barcode) {
            const idx = state[STA_GOODS].findIndex(g => g.sBarCode === barcode)
            if (idx >= 0) {
                state[STA_GOODS].splice(idx, 1)
            }
            localStorage.setItem(STA_GOODS, JSON.stringify(state[STA_GOODS]))
        },
        [SET_GOODSITEM](state, item) {
            let { sBarCode } = item;
            let idx = state[STA_GOODS].findIndex(g => g.sBarCode === sBarCode);
            if (idx >= 0) {
                state[STA_GOODS].splice(idx, 1, item)
            } else {
                state[STA_GOODS].push(item)
            }
            
            localStorage.setItem(STA_GOODS, JSON.stringify(state[STA_GOODS]))
        },
    },
    actions: {
        [ACT_LOADGOODS]({ commit }) {
            let goods = []
            try {
                goods = JSON.parse(localStorage.getItem(STA_GOODS)) || []
            } catch (e) {
                goods = []
            }

            console.log(goods)

            if (!goods.length) {
                goods = goodList
                localStorage.setItem(STA_GOODS, JSON.stringify(goods))
            }

            commit(SET_GOODS, goods)
        },
    },
    getters: {
        [GET_GOODSTYPE](state) {
            const typeMap = {}
            state[STA_GOODS].forEach(g => typeMap[g.sType] = 1)
            return Object.keys(typeMap)
        },
    },
})

