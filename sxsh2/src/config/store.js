import { createStore } from "vuex"
import goodList from "~/data/goods.js"
import orderList from "~/data/order.js"
import { toggleTheme } from "@zougt/vite-plugin-theme-preprocessor/dist/browser-utils.js"

export const STA_THEME = "theme"
export const STA_ISDARK = "isDarkTheme"
export const STA_SHOPCART = "shopCart"
export const SET_SHOPCART = "setShopCart"
export const DEL_SHOPCART = "delShopCart"
export const PSH_SHOPCART = "pushShopCart"
export const INC_SHOPCART = "increseShopCart"
export const DEC_SHOPCART = "decreseShopCart"
export const CLS_SHOPCART = "clearShopCart"

export const STA_BACKCARTS = "backCarts"
export const SET_BACKCARTS = "setBackCarts"
export const USH_BACKCARTS = "unshiftBackCarts"
export const DEL_BACKCARTS = "delBackCarts"

export const STA_GOODS = "goods"
export const SET_GOODS = "setGoods"
export const SET_GOODSITEM = "setGoodsItem"
export const DEL_GOODSITEM = "delGoodsItem"
export const ACT_LOADGOODS = "loadGoods"

export const STA_ORDER = "order"
export const SET_ORDER = "setOrder"
export const USH_ORDERITEM = "setOrderItem"
export const SET_THEME = "setTheme"
export const ACT_LOADORDER = "loadOrder"
export const ACT_LOADTHEME = "loadTheme"

export const GET_GOODSTYPE = "getGoodsType"

export default createStore({
    state() {
        return {
            [STA_GOODS]: [],
            [STA_ORDER]: [],
            [STA_SHOPCART]: [],
            [STA_BACKCARTS]: [],
            [STA_ISDARK]: false,
        }
    },
    mutations: {
        [SET_GOODS](state, info) {
            state[STA_GOODS] = info
        },
        [SET_ORDER](state, info) {
            state[STA_ORDER] = info
        },
        [SET_SHOPCART](state, info) {
            state[STA_SHOPCART] = info
        },
        [SET_THEME](state, theme) {
            state[STA_THEME] = theme
            toggleTheme({
                scopeName: theme === "dark" ? "theme-dark" : "theme-light",
            })
            localStorage.setItem(STA_THEME, theme)
        },
        [CLS_SHOPCART](state) {
            state[STA_SHOPCART].splice(0, state[STA_SHOPCART].length)
        },
        [PSH_SHOPCART](state, info) {
            state[STA_SHOPCART].push(info)
        },
        [DEL_SHOPCART](state, index) {
            state[STA_SHOPCART].splice(index, 1)
        },
        [INC_SHOPCART](state, info) {
            state[STA_SHOPCART][info.index][info.key]++
        },
        [DEC_SHOPCART](state, info) {
            state[STA_SHOPCART][info.index][info.key]--
        },
        [SET_BACKCARTS](state, info) {
            state[STA_BACKCARTS] = info
        },
        [USH_BACKCARTS](state, item) {
            state[STA_BACKCARTS].unshift(item)
        },
        [DEL_BACKCARTS](state, index) {
            state[STA_BACKCARTS].splice(index, 1)
        },
        [DEL_GOODSITEM](state, barcode) {
            const idx = state[STA_GOODS].findIndex(
                (g) => g.sBarCode === barcode,
            )
            if (idx >= 0) {
                state[STA_GOODS].splice(idx, 1)
            }
            localStorage.setItem(STA_GOODS, JSON.stringify(state[STA_GOODS]))
        },
        [SET_GOODSITEM](state, item) {
            let { sBarCode } = item
            let idx = state[STA_GOODS].findIndex((g) => g.sBarCode === sBarCode)
            if (idx >= 0) {
                state[STA_GOODS].splice(idx, 1, item)
            } else {
                state[STA_GOODS].push(item)
            }
            localStorage.setItem(STA_GOODS, JSON.stringify(state[STA_GOODS]))
        },
        [USH_ORDERITEM](state, item) {
            state[STA_ORDER].unshift(item)
            localStorage.setItem(STA_ORDER, JSON.stringify(state[STA_ORDER]))
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

            if (!goods.length) {
                goods = goodList
                localStorage.setItem(STA_GOODS, JSON.stringify(goods))
            }
            commit(SET_GOODS, goods)
        },
        [ACT_LOADORDER]({ commit }) {
            let order = []
            try {
                order = JSON.parse(localStorage.getItem(STA_ORDER)) || []
            } catch (e) {
                order = []
            }

            if (!order.length) {
                order = orderList
                localStorage.setItem(STA_ORDER, JSON.stringify(order))
            }
            commit(SET_ORDER, order)
        },
        [ACT_LOADTHEME]({ commit }) {
            const theme = localStorage.getItem("theme")
            commit(SET_THEME, theme || "light")
        },
    },
    getters: {
        [GET_GOODSTYPE](state) {
            const typeMap = {}
            state[STA_GOODS].forEach((g) => (typeMap[g.sType] = 1))
            return Object.keys(typeMap).filter((v) => !!v)
        },
    },
})
