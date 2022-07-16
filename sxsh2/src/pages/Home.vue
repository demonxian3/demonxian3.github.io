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
                        ￥<CountTo
                            :value="totalAggregation.salesPrice"
                            :fixed="2"
                        />
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
                        <CountTo :value="totalAggregation.salesCount" />
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
                        <CountTo :value="totalAggregation.payCount" />
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
                    v-model:value="timeDimension"
                    option-type="button"
                    :options="options"
                    @change="calcAggregation"
                    size="small"
                />
                <a-range-picker
                    v-model:value="timeRange"
                    format="YYYY/MM/DD"
                    class="ml-5"
                    @change="calcAggregation"
                    valueFormat="YYYY-MM-DD hh:mm:ss"
                />
            </template>

            <a-row :gutter="4">
                <a-col class="gutter-row" :span="17">
                    <div class="gutter-box">
                        <SalesAmount 
                            class="w-full h-300px" 
                            :data-source="timesAggregation"
                            :dimension="timeDimension"
                            :target="salesDimension"
                        />
                    </div>
                </a-col>
                <a-col class="gutter-row" :span="7">
                    <div class="gutter-box">
                        <a-list
                            size="small"
                            :data-source="rankCollection.salesPriceRank"
                            class="h-300px overflow-y-scroll"
                        >
                            <template #renderItem="{ item, index }">
                                <a-list-item class="flex justify-between">
                                    <div class="truncate w-4/5">
                                        <span
                                            ><a-badge
                                                :count="index + 1"
                                                show-zero
                                                class="mr-3"
                                                :number-style="
                                                    getRankStyle(index)
                                                "
                                        /></span>
                                        <span>{{
                                            goodsStore[item.key].sName
                                        }}</span>
                                    </div>
                                    <span>{{ item.value }}</span>
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
                        :dataSource="rankCollection.salesCountRank"
                        :columns="columns"
                        size="small"
                        :scroll="{ y: 105 }"
                    >
                        <template #bodyCell="{ column, record, index }">
                            <template v-if="column.key === 'rank'">{{
                                index + 1
                            }}</template>
                            <template v-if="column.key === 'key'">
                                <a-tooltip
                                    :title="goodsStore[record.key].sName"
                                >
                                    <div class="truncate">
                                        {{ goodsStore[record.key].sName }}
                                    </div>
                                </a-tooltip>
                            </template>
                        </template>
                    </a-table>
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
import {
    onActivated,
    onBeforeMount,
    onMounted,
    reactive,
    ref,
} from "@vue/runtime-core"
import CountTo from "./components/CountTo.vue"
import useOrder from "~/hooks/useOrder"
import useNotice from "~/hooks/useNotice"
import useStatistic from "~/hooks/useStatistic"
import PayCount from "~/pages/charts/PayCount.vue"
import SalesCount from "~/pages/charts/SalesCount.vue"
import SalesAmount from "~/pages/charts/SalesAmount.vue"
import EarnRate from "./charts/EarnRate.vue"
import PaywayPie from "./charts/PaywayPie.vue"
import store, { STA_THEME } from "../config/store"
import {
    CaretDownFilled,
    CaretUpFilled,
    InfoCircleOutlined,
} from "@ant-design/icons-vue"
import moment from "moment"
import { p } from "@antfu/utils"

const { openNotice } = useNotice()
const { orders } = useOrder()
const {
    salesDimension,
    timeDimension,
    timeRange,
    goodsStore,
    totalAggregation,
    timesAggregation,
    rankCollection,
    calcAggregation,
} = useStatistic(orders)

onBeforeMount(calcAggregation)
onActivated(calcAggregation)

const options = [
    { label: "日", value: "day" },
    { label: "周", value: "week" },
    { label: "月", value: "month" },
    { label: "年", value: "year" },
]

const getRankStyle = (index) =>
    store.state.STA_THEME === "dark"
        ? { backgroundColor: index < 3 ? "#2c3e4e" : "#262626" }
        : { backgroundColor: index < 3 ? "orange" : "gray" }

const columns = [
    {
        title: "#",
        dataIndex: "rank",
        key: "rank",
        width: 40,
    },
    {
        title: "商品名称",
        dataIndex: "name",
        key: "key",
        width: 290,
    },
    {
        title: "销售数",
        dataIndex: "value",
        key: "value",
        align: "right",
    },
    {
        title: "周涨幅",
        dataIndex: "rate",
        key: "rate",
        align: "right",
        width: 60,
    },
]

const dataSource = [
    { name: "王老吉凉茶", count: 372, rate: "32%", rank: 1 },
    { name: "王老吉凉茶", count: 372, rate: "32%", rank: 2 },
    { name: "王老吉凉茶", count: 372, rate: "32%", rank: 3 },
    { name: "王老吉凉茶", count: 372, rate: "32%", rank: 4 },
    { name: "王老吉凉茶", count: 372, rate: "32%", rank: 5 },
    { name: "王老吉凉茶", count: 372, rate: "32%", rank: 6 },
]

openNotice()
</script>

<script></script>

<style scoped lang="less"></style>
