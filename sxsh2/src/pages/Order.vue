<template>
    <div>
        <a-row :gutter="12">
            <a-col :span="6" class="bg-light-200">
                <a-input-search
                    placeholder="商品名称/拼音/条码"
                    enter-button
                    class="w-full"
                    v-model:value="filter.keyword"
                />
                <OrderSkeletonList v-if="!orderList.length" />
                <a-list
                    v-else
                    item-layout="horizontal"
                    :data-source="orderList"
                    class="border h-75vh overflow-y-scroll mt-2 w-full bg-white cursor-pointer"
                    size="small"
                >
                    <template #renderItem="{ item, index }">
                        <a-list-item
                            key="item.title"
                            class="pl-3 flex flex-col"
                            :class="{
                                'bg-indigo-100': activeIdx === index,
                            }"
                            @click="activeIdx = index"
                        >
                            <a-list-item-meta
                                :description="`${item.dtCreate}`"
                                class="w-full"
                            >
                                <template #title> {{ item.iId }} </template>
                                <template #avatar
                                    ><a-avatar :src="finishSvg"
                                /></template>
                            </a-list-item-meta>
                            <div class="w-full text-pink-500 truncate">
                                {{
                                    `共 ${
                                        item.iCount
                                    } 件商品，已付 ￥${item.dRealPay.toFixed(
                                        2,
                                    )} 元`
                                }}
                            </div>
                        </a-list-item>
                    </template>
                </a-list>
            </a-col>
            <a-col :span="18" class="bg-light-200" v-if="orderList.length">
                <a-card size="small">
                    <a-descriptions bordered size="small" :column="2">
                        <a-descriptions-item label="订单号">
                            {{ orderList[activeIdx].iId }}
                        </a-descriptions-item>
                        <a-descriptions-item label="结算时间">
                            {{ orderList[activeIdx].dtCreate }}
                        </a-descriptions-item>
                        <a-descriptions-item label="总价">
                            ￥{{
                                (
                                    orderList[activeIdx].dNeedPay +
                                    orderList[activeIdx].dCoupon
                                ).toFixed(2)
                            }}元
                        </a-descriptions-item>
                        <a-descriptions-item label="应付">
                            ￥{{ orderList[activeIdx].dNeedPay.toFixed(2) }}元
                        </a-descriptions-item>
                        <a-descriptions-item label="实收">
                            ￥{{ orderList[activeIdx].dRealPay.toFixed(2) }}元
                        </a-descriptions-item>
                        <a-descriptions-item label="优惠">
                            ￥{{ orderList[activeIdx].dCoupon.toFixed(2) }}元
                        </a-descriptions-item>
                        <a-descriptions-item label="找零">
                            ￥{{ orderList[activeIdx].dChange.toFixed(2) }}元
                        </a-descriptions-item>
                        <a-descriptions-item label="付款方式">
                            {{ orderList[activeIdx].sPayway }}
                        </a-descriptions-item>
                        <a-descriptions-item label="其他信息">
                            {{
                                `共 ${orderList[activeIdx].aGoods.length} 种 ${
                                    orderList[activeIdx].iCount
                                } 件商品，
                            总价 ￥${(
                                orderList[activeIdx].dNeedPay +
                                orderList[activeIdx].dCoupon
                            ).toFixed(2)} 元，
                            优惠 ￥${orderList[activeIdx].dCoupon.toFixed(
                                2,
                            )} 元，
                            已付 ￥${orderList[activeIdx].dRealPay.toFixed(
                                2,
                            )} 元`
                            }}
                        </a-descriptions-item>
                    </a-descriptions>
                </a-card>
                <a-card class="mt-2 h-42vh" size="small">
                    <a-table
                        size="small"
                        :dataSource="orderList[activeIdx].aGoods"
                        :columns="columns"
                        :scroll="{ x: 400, y: 265 }"
                        :pagination="false"
                    >
                        <template #bodyCell="{ column, record, index }">
                            <template v-if="column.key === 'dSubTotal'">
                                {{ record.iCount * record.dPay }}
                            </template>
                        </template>
                    </a-table>
                </a-card>
                <a-card size="small" class="mt-2 text-right">
                    <a-button type="primary" @click="test()" ghost
                        >显示屏</a-button
                    >
                    <a-button type="primary" ghost>打印小票</a-button>
                </a-card>
            </a-col>
            <OrderSkeletonDetail v-else/>
        </a-row>
    </div>
</template>

<script setup>
import { FileMarkdownOutlined } from "@ant-design/icons-vue"
import store, { ACT_LOADORDER, STA_ORDER } from "../config/store"
import finishSvg from "~/assets/finish.svg"
import { reactive, ref } from "@vue/reactivity"
import { computed, onActivated } from "@vue/runtime-core"
import OrderSkeletonList from "./components/OrderSkeletonList.vue"
import OrderSkeletonDetail from "./components/OrderSkeletonDetail.vue"

const test = () => {
    const win = window.open(
        "/#/jumbotron",
        "_blank",
        "width=400, height=300, left=1920, top=100",
    )

    console.log(win)
}

const filter = reactive({
    keyword: "",
})
const activeIdx = ref(0)

const orderList = computed(() => {
    if (filter.keyword) {
        return store.state[STA_ORDER].filter(
            (item) => JSON.stringify(item).indexOf(filter.keyword) >= 0,
        )
    }
    return store.state[STA_ORDER]
})

const columns = [
    { title: "条码", dataIndex: "sBarCode", key: "sBarCode", width: 110 },
    {
        title: "名称",
        dataIndex: "sName",
        key: "sName",
        width: 200,
        ellipsis: true,
    },
    { title: "原价", dataIndex: "dPrice", key: "dPrice", width: 55 },
    { title: "售价", dataIndex: "dPay", key: "dPay", width: 55 },
    { title: "数量", dataIndex: "iCount", key: "iCount", width: 55 },
    { title: "小计", dataIndex: "dSubTotal", key: "dSubTotal", width: 55 },
]

onActivated(() => {
    console.log("order get", store.state[STA_ORDER])
})
</script>
