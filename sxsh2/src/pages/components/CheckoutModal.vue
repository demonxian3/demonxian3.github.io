<template>
    <a-modal
        v-model:visible="checkoutVisible"
        :title="'结算'"
        @ok="commitOrder"
        okText="确定"
        cancelText="取消"
        destroyOnClose
        width="520px"
        @cancel="pending"
        :maskClosable="false"
    >
        <a-form
            id="goodsForm"
            name="checkout_data"
            class="ant-advanced-search-form"
            :model="checkoutData"
            autocomplete="off"
        >
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item name="dNeedPay" :label="`应付款`">
                        <a-input-number
                            class="w-full text-rose-600 bg-gray-200"
                            :value="checkoutData.dNeedPay"
                            :min="0"
                            :step="1"
                            readonly
                            :formatter="(v) => `￥${(+v).toFixed(2)}元`"
                        />
                    </a-form-item>
                    <a-form-item name="dChange" :label="`找零钱`">
                        <a-input-number
                            :class="{
                                'text-teal-600': getCheckoutChange < 0,
                                'text-gray-400': getCheckoutChange == 0,
                                'text-rose-500': getCheckoutChange > 0,
                            }"
                            class="w-full bg-gray-200"
                            :value="getCheckoutChange"
                            :step="1"
                            readonly
                            :formatter="(v) => `￥${(+v).toFixed(2)}元`"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item name="dCoupon" :label="`优惠额`">
                        <a-input-number
                            class="w-full"
                            v-model:value="checkoutData.dCoupon"
                            :min="0"
                            :step="1"
                            @click="checkoutData.dCoupon = ''"
                            @blur="checkoutData.dCoupon = +checkoutData.dCoupon"
                            @change="updateRealPay()"
                        />
                    </a-form-item>
                    <a-form-item name="dRealPay" :label="`实付款`">
                        <a-input-number
                            class="w-full"
                            v-model:value="checkoutData.dRealPay"
                            :step="1"
                            @click="checkoutData.dRealPay = ''"
                            @blur="
                                checkoutData.dRealPay = +checkoutData.dRealPay
                            "
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-form-item name="sPayway" label="付款方式">
                <a-radio-group
                    v-model:value="checkoutData.sPayway"
                    @change="
                        (e) => paying(checkoutData.dNeedPay, e.target.value)
                    "
                >
                    <a-radio-button :value="key" :key="key"  v-for="(item, key) in paywayMap">
                        <component :is="item.icon" :class="item.color" />
                        {{item.label}}
                    </a-radio-button>
                </a-radio-group>
            </a-form-item>
            <a-form-item name="" :label="``"> </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup>


import store, { USH_ORDERITEM } from "~/config/store"
import { reactive, ref, toRef, unref } from "@vue/reactivity"
import { computed } from "@vue/runtime-core"
import moment from "moment"
import { message } from "ant-design-vue"
import useCart from "~/pages/hooks/useCart.js"
import useNotice from "../hooks/useNotice"

const { getTotalPrice, getTotalCount, shopCart, clearCart } = useCart()
const { paying, pending, settle, paywayMap } = useNotice()
const checkoutVisible = ref(false)
const checkoutData = reactive({
    iId: moment().unix(),
    dtCreate: moment().format("YYYY-MM-DD hh:mm:ss"),
    dNeedPay: 0.0,
    dRealPay: 0.0,
    dChange: 0.0,
    dCoupon: 0.0,
    iCount: 0,
    sPayway: "scan",
    aGoods: [],
})

const showCheckoutModal = () => {
    if (!shopCart.length) {
        message.warning("没有可以结算的商品，无法收款")
        return
    }

    cleatCheckoutData()
    // checkoutData.aGoods.splice(0, checkoutData.aGoods.length);
    checkoutData.dRealPay = checkoutData.dNeedPay = getTotalPrice()
    checkoutData.iCount = getTotalCount()
    // shopCart.forEach(goods => checkoutData.aGoods.push(goods))
    checkoutData.aGoods = shopCart.slice()
    paying(checkoutData.dNeedPay, checkoutData.sPayway)
    checkoutVisible.value = true
}

const cleatCheckoutData = () => {
    checkoutData.iId = 0
    checkoutData.dtCreate = ""
    checkoutData.dNeedPay = 0
    checkoutData.dRealPay = 0
    checkoutData.dChange = 0
    checkoutData.dCoupon = 0
    checkoutData.iCount = 0
    checkoutData.aGoods = []
}

const getCheckoutChange = computed(() => {
    return (
        checkoutData.dRealPay - (checkoutData.dNeedPay - checkoutData.dCoupon)
    )
})

const updateRealPay = () => {
    checkoutData.dRealPay = checkoutData.dNeedPay - checkoutData.dCoupon
}

const commitOrder = () => {
    checkoutData.iId = moment().unix()
    checkoutData.dtCreate = moment().format("YYYY-MM-DD hh:mm:ss")
    checkoutData.aGoods = shopCart.slice()
    store.commit(USH_ORDERITEM, JSON.parse(JSON.stringify(checkoutData)))
    message.success("收款成功")
    clearCart()
    settle()
    checkoutVisible.value = false
}

defineExpose({ showCheckoutModal })
</script>

<style>
.ant-radio-button-checked {
    @apply bg-sky-100;
}
</style>
