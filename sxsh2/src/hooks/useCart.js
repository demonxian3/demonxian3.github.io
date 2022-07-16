import { reactive, ref, computed } from "vue"
import moment from "moment"
import { message } from "ant-design-vue"
import store, {
    STA_GOODS,
    STA_SHOPCART,
    SET_SHOPCART,
    PSH_SHOPCART,
    DEL_SHOPCART,
    CLS_SHOPCART,
    STA_BACKCARTS,
    SET_BACKCARTS,
    USH_BACKCARTS,
    DEL_BACKCARTS,
    INC_SHOPCART,
    DEC_SHOPCART,
} from "~/config/store.js"

export default () => {
    const shopCart = store.state[STA_SHOPCART]
    const backCarts = store.state[STA_BACKCARTS]

    const increseGoods = (index) => {
        store.commit(INC_SHOPCART, {index, key:'iCount'})
    }
    const decreseGoods = (index) => {
        if (shopCart[index].iCount <= 1) {
            return;
        }
        store.commit(DEC_SHOPCART, { index, key: "iCount" })
    }

    const joinCart = (barcode) => {
        const goods = store.state[STA_GOODS].find((g) => g.sBarCode === barcode)
        const index = shopCart.findIndex((g) => g.sBarCode === barcode)

        if (!goods) {
            return false;
        }

        index >= 0
            ? store.commit(INC_SHOPCART, { index, key: "iCount" })
            : store.commit(PSH_SHOPCART, {
                  sBarCode: goods.sBarCode,
                  sName: goods.sName,
                  dPrice: goods.dPrice,
                  dPay: goods.dPrice,
                  iCount: 1,
              })
        return true;
    }
    const batchJoinCart = (barcodes) => {
        barcodes.forEach(barcode => joinCart(barcode))
    }
    const removeGoods = (index) => {
        store.commit(DEL_SHOPCART, index)
    }

    const clearCart = () => {
        store.commit(CLS_SHOPCART)
    }

    const detachCart = () => {
        if (!shopCart.length) {
            message.warning('当前收银台没有商品无法挂单')
            return;
        }
        store.commit(USH_BACKCARTS, {
            time: moment().format("YYYY-MM-DD hh:mm:ss"),
            price: getTotalPrice(),
            count: getTotalCount(),
            list: shopCart.slice(),
        })
        store.commit(CLS_SHOPCART)
    }

    const attachCart = (index) => {
        if (shopCart.length) {
            message.error("收银台有商品未结算，无法取单")
            return
        }

        backCarts[index].list.forEach((item) => {
            store.commit(PSH_SHOPCART, item) 
        })
        store.commit(DEL_BACKCARTS, index)
    }

    const deleteCart = (index) => {
        store.commit(DEL_BACKCARTS, index)
    }

    const getTotalCount = () => {
        return shopCart.reduce((s, c) => (s += +c.iCount), 0)
    }

    const getTotalPrice = () => {
        return shopCart.reduce((s, c) => (s += c.iCount * c.dPay), 0)
    }

    return {
        shopCart,
        backCarts,
        getTotalCount,
        getTotalPrice,
        increseGoods,
        decreseGoods,
        joinCart,
        batchJoinCart,
        clearCart,
        removeGoods,
        attachCart,
        detachCart,
        deleteCart,
    }
}
