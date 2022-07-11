<template>
    <div id="home">
        <a-row :gutter="16">
            <a-col class="gutter-row" :span="6">
                <a-card size="small" class="hover:shadow cursor-pointer">
                    <div class="text-sm flex justify-between text-gray-500">
                        <span>总销售额</span>
                        <a-tooltip>
                            <template #title
                                >销售总额等于按销售价格计算的初始销售收入或流入资产的价值</template
                            >
                            <InfoCircleOutlined />
                        </a-tooltip>
                    </div>
                    <div class="py-4 text-3xl text-rose-400">
                        ￥<CountTo :value="3277.93" :fixed="2" />
                    </div>
                    <div class="py-3 flex justify-between">
                        <span>
                            <span class="text-gray-400">周同比</span> 12%
                            <CaretUpFilled class="text-red-400" />
                        </span>
                        <span>
                            <span class="text-gray-400">日环比</span> 11%
                            <CaretDownFilled class="text-green-500" />
                        </span>
                    </div>
                    <a-divider class="my-0" />
                    <div class="pt-4">
                        <span class="text-gray-400">日均销售额</span> ￥12,423
                    </div>
                </a-card>
            </a-col>
            <a-col class="gutter-row" :span="6">
                <a-card size="small" class="hover:shadow cursor-pointer">
                    <div class="text-sm flex justify-between text-gray-500">
                        <span>总销售量</span>
                        <a-tooltip>
                            <template #title></template>
                            <InfoCircleOutlined />
                        </a-tooltip>
                    </div>
                    <div class="py-4 text-3xl">
                        <CountTo :value="13203" />
                    </div>
                    <div class="">
                        <SalesCount class="w-full h-45px" />
                    </div>
                    <a-divider class="my-0" />
                    <div class="pt-4">
                        <span class="text-gray-400">日均销售量</span> 3200
                    </div>
                </a-card>
            </a-col>
            <a-col class="gutter-row" :span="6">
                <a-card size="small" class="hover:shadow cursor-pointer">
                    <div class="text-sm flex justify-between text-gray-500">
                        <span>总支付笔数</span>
                        <a-tooltip>
                            <template #title></template>
                            <InfoCircleOutlined />
                        </a-tooltip>
                    </div>
                    <div class="py-4 text-3xl">
                        <CountTo :value="463" />
                    </div>
                    <div class="">
                        <PayCount class="w-full h-45px" />
                    </div>
                    <a-divider class="my-0" />
                    <div class="pt-4">
                        <span class="text-gray-400">转换率</span> 32%
                    </div>
                </a-card>
            </a-col>
            <a-col class="gutter-row" :span="6">
                <a-card size="small" class="hover:shadow cursor-pointer">
                    <div class="text-sm flex justify-between text-gray-500">
                        <span>收益率</span>
                        <a-tooltip>
                            <template #title></template>
                            <InfoCircleOutlined />
                        </a-tooltip>
                    </div>
                    <div class="py-4 text-3xl"><CountTo :value="78" />%</div>
                    <div class="py-3">
                        <EarnRate :value="78" />
                    </div>
                    <a-divider class="my-0" />
                    <div class="pt-4 flex justify-between">
                        <span>
                            <span class="text-gray-400">周同比</span> 12%
                            <CaretUpFilled class="text-red-500" />
                        </span>
                        <span>
                            <span class="text-gray-400">日环比</span> 11%
                            <CaretDownFilled class="text-green-500" />
                        </span>
                    </div>
                </a-card>
            </a-col>
        </a-row>

        <a-card size="small" class="mt-4 hover:shadow">
            <template #title>
                <a-tabs v-model:activeKey="salesDimension" class="!-mb-24px">
                    <a-tab-pane key="salesPrice" tab="销售额"> </a-tab-pane>
                    <a-tab-pane key="salesCount" tab="销售量"> </a-tab-pane>
                </a-tabs>
            </template>

            <template #extra>
                <a-radio-group
                    v-model:value="dimension"
                    option-type="button"
                    :options="options"
                    size="small"
                />
                <a-range-picker
                    v-model:value="timeRange"
                    format="YYYY/MM/DD"
                    class="ml-5"
                />
            </template>

            <a-row :gutter="4">
                <a-col class="gutter-row" :span="17">
                    <div class="gutter-box">
                        <SalesAmount class="w-full h-300px" />
                    </div>
                </a-col>
                <a-col class="gutter-row" :span="7">
                    <div class="gutter-box">
                        <a-list
                            size="small"
                            :data-source="salesRank"
                            class="h-300px overflow-y-scroll"
                        >
                            <template #renderItem="{ item, index }">
                                <a-list-item class="flex justify-between">
                                    <span>
                                        <span
                                            ><a-badge
                                                :count="index + 1"
                                                show-zero
                                                class="mr-3"
                                                :number-style="{
                                                    backgroundColor:
                                                        index < 3
                                                            ? '#2c3e4e'
                                                            : '#262626',
                                                }"
                                        /></span>
                                        <span>{{ item.name }}</span>
                                    </span>
                                    <span>{{ item.price }}</span>
                                </a-list-item>
                            </template>
                        </a-list>
                    </div>
                </a-col>
            </a-row>
        </a-card>

        <a-row :gutter="16" class="mt-4">
            <a-col class="gutter-row" :span="12">
                <a-card
                    size="small"
                    title="销量排名"
                    class="hover:shadow cursor-pointer"
                >
                    <a-table
                        :dataSource="dataSource"
                        :columns="columns"
                        size="small"
                        :scroll="{y: 105}"
                    />
                </a-card>
            </a-col>
            <a-col class="gutter-row" :span="12">
                <a-card
                    size="small"
                    title="支付渠道占比"
                    class="hover:shadow cursor-pointer"
                >
                    <PaywayPie class="h-200px" />
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script setup>
import { onActivated, onMounted, reactive, ref } from "@vue/runtime-core"
import CountTo from "./components/CountTo.vue"
import useOrder from "./hooks/useOrder"
import PayCount from "~/pages/charts/PayCount.vue"
import SalesCount from "~/pages/charts/SalesCount.vue"
import SalesAmount from "~/pages/charts/SalesAmount.vue"
import SalesCountBar from "~/pages/charts/SalesCountBar.vue"
import EarnRate from "./charts/EarnRate.vue"
import PaywayPie from "./charts/PaywayPie.vue"

import {
    CaretDownFilled,
    CaretUpFilled,
    InfoCircleOutlined,
} from "@ant-design/icons-vue"
const { orderList } = useOrder()
const options = [
    { label: "今日", value: "day" },
    { label: "本周", value: "week" },
    { label: "本月", value: "month" },
    { label: "今年", value: "year" },
]
const salesDimension = ref("salesPrice")
const dimension = ref("day")
const timeRange = ref([])
const salesRank = [
    { name: "可口可乐250ml", price: 3273.32 },
    { name: "金色好日子", price: 3272.32 },
    { name: "芙蓉王", price: 3271.32 },
    { name: "可口可乐250ml", price: 3271.32 },
    { name: "可口可乐250ml", price: 3271.32 },
    { name: "可口可乐250ml", price: 3271.32 },
    { name: "可口可乐250ml", price: 3271.32 },
]

const columns = [
    {
        title: "排名",
        dataIndex: "rank",
        key: "rank",
    },
    {
        title: "商品名称",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "销售数量",
        dataIndex: "count",
        key: "count",
    },
    {
        title: "周涨幅",
        dataIndex: "rate",
        key: "rate",
    },
]

const dataSource = [
    {name: '王老吉凉茶', count: 372, rate: '32%', rank: 1},
    {name: '王老吉凉茶', count: 372, rate: '32%', rank: 2},
    {name: '王老吉凉茶', count: 372, rate: '32%', rank: 3},
    {name: '王老吉凉茶', count: 372, rate: '32%', rank: 4},
    {name: '王老吉凉茶', count: 372, rate: '32%', rank: 5},
    {name: '王老吉凉茶', count: 372, rate: '32%', rank: 6},
]
</script>

<script></script>

<style scoped lang="less"></style>
