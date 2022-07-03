<template>
    <a-modal
        v-model:visible="checkoutVisible"
        :title="'结算'"
        @ok="commitOrder"
        okText="确定"
        cancelText="取消"
        destroyOnClose
        width="520px"
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
                            @change="updateNeedPay()"
                        />
                    </a-form-item>
                    <a-form-item name="dRealPay" :label="`实付款`">
                        <a-input-number
                            class="w-full"
                            v-model:value="checkoutData.dRealPay"
                            :step="1"
                            @click="checkoutData.dRealPay = ''"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-form-item name="sPayway" label="付款方式">
                <a-radio-group v-model:value="checkoutData.sPayway">
                    <a-radio-button value="scan">
                        <QrcodeOutlined class="text-dark-500" />
                        扫码
                    </a-radio-button>
                    <a-radio-button value="wechat">
                        <WechatOutlined class="text-green-400" />
                        微信
                    </a-radio-button>
                    <a-radio-button value="alipat">
                        <AlipayCircleFilled class="text-blue-500" />
                        支付宝
                    </a-radio-button>
                    <a-radio-button value="cash">
                        <RedEnvelopeFilled class="text-red-600" />
                        现金
                    </a-radio-button>
                    <a-radio-button value="bank">
                        <CreditCardFilled class="text-purple-500" />
                        银联
                    </a-radio-button>
                </a-radio-group>
            </a-form-item>
            <a-form-item name="" :label="``"> </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup>
import {
    AlipayCircleFilled,
    CreditCardFilled,
    QrcodeOutlined,
    RedEnvelopeFilled,
    WechatOutlined,
} from "@ant-design/icons-vue"

import store, {PSH_ORDERITEM} from '~/config/store'
import { reactive, ref, toRef, unref } from "@vue/reactivity"
import { computed } from "@vue/runtime-core"
import moment from 'moment'
import { message } from 'ant-design-vue'
import useCart from '~/pages/hooks/useCart.js';

const {
    getTotalPrice,
    shopCart,
} = useCart()

const checkoutVisible = ref(false)
const checkoutData = reactive({
    dtCreate: moment().format('YYYY-MM-DD hh:mm:ss'),
    dNeedPay: 0.0,
    dRealPay: 0.0,
    dChange: 0.0,
    dCoupon: 0.0,
    sPayway: "scan",
    aGoods: [],
})

const showCheckoutModal = () => {
    if (!shopCart.length) {
        message.warning('没有可以结算的商品，无法收款')
        return;
    }
    checkoutData.dRealPay = checkoutData.dNeedPay = getTotalPrice()
    checkoutData.aGoods = shopCart
    checkoutVisible.value = true
}

const getCheckoutChange = computed(() => {
    return checkoutData.dRealPay - checkoutData.dNeedPay
})

const updateNeedPay = () => {
    checkoutData.dRealPay = checkoutData.dNeedPay = getTotalPrice() - checkoutData.dCoupon
}

const commitOrder = () => {
    store.commit(PSH_ORDERITEM, checkoutData)
    message.success('收款成功')
    checkoutVisible.value = false
}

defineExpose({ showCheckoutModal })
</script>

<style>
.ant-radio-button-checked {
    @apply bg-sky-100;
}
</style>
