<template>
    <div id="home">
        <a-row :gutter="16">



            <a-col class="gutter-row" :span="6" v-for="item in summaryData">
                <a-badge-ribbon :text="item.dimension">
                    <a-card
                        :title="item.label"
                        size="small"
                        class="hover:shadow cursor-pointer text-3xl font-bold text-gray-500"
                    >
                        <div class="py-2"><CountTo :value="item.value" /></div>

                        <template #actions>
                            <div class="text-left pl-3">2222</div>
                        </template>
                    </a-card>
                </a-badge-ribbon>
            </a-col>
            <a-col class="gutter-row" :span="6">
                <a-badge-ribbon text="日" color="pink">
                    <a-card
                        title="销售额"
                        size="small"
                        class="hover:shadow cursor-pointer text-3xl font-bold text-gray-500"
                    >
                        <div class="py-2"><CountTo :value="1111" /></div>

                        <template #actions>
                            <div class="text-left pl-3">2222</div>
                        </template>
                    </a-card>
                </a-badge-ribbon>
            </a-col>
            <a-col class="gutter-row" :span="6">
                <a-badge-ribbon text="月" color="cyan">
                    <a-card
                        title="销售额"
                        size="small"
                        class="hover:shadow cursor-pointer text-3xl font-bold text-gray-500"
                    >
                        <div class="py-2"><CountTo :value="1111" /></div>

                        <template #actions>
                            <div class="text-left pl-3">2222</div>
                        </template>
                    </a-card>
                </a-badge-ribbon>
            </a-col>
            <a-col class="gutter-row" :span="6">
                <a-badge-ribbon text="月" color="orange">
                    <a-card
                        title="销售额"
                        size="small"
                        class="hover:shadow cursor-pointer text-3xl font-bold text-gray-500"
                    >
                        <div class="py-2"><CountTo :value="1111" /></div>

                        <template #actions>
                            <div class="text-left pl-3">2222</div>
                        </template>
                    </a-card>
                </a-badge-ribbon>
            </a-col>
        </a-row>

        <a-row :gutter="16" class="mt-4 ">
            <a-col class="gutter-row" :span="12">
                <a-card
                    title="销售额"
                    size="small"
                    class="hover:shadow relative"
                >
                    <template #extra>
                        <a-radio-group v-model:value="timeDimension">
                            <a-radio-button value="d">日</a-radio-button>
                            <a-radio-button value="w">周</a-radio-button>
                            <a-radio-button value="m">月</a-radio-button>
                        </a-radio-group>
                    </template>

                    <div
                        ref="el"
                        id="chart"
                        style="width: 100%; height: 300px"
                    ></div>
                    111
                </a-card>
            </a-col>
            <a-col class="gutter-row" :span="12"></a-col>
        </a-row>
    </div>
</template>

<script setup>
import { onActivated, onMounted, reactive, ref } from "@vue/runtime-core"
import CountTo from "./components/CountTo.vue"
import * as echarts from "echarts"
import useOrder from './hooks/useOrder'

const { orderList } = useOrder()

const summaryData = reactive([
    {
        label: '销售额',
        dimension: '总',
        value: orderList.value.reduce((s,c)=>s+=c.dRealPay, 0),
    }
])

let myChart = null
onMounted(() => {
    let dom = document.getElementById("chart")
    if (dom) {
        myChart = echarts.init(dom)
        getData()
    }
})
function getData() {
    const getStatistics3 = async () => {
        const jsonData = JSON.parse(`{"msg":"ok","data":{"x":["07-24","07-23","07-22","07-21","07-20","07-19","07-18"],"y":[51,0,1,1,0,2,1]}}`)
        return jsonData
    }

    let option = {
        xAxis: {
            type: "category",
            data: [],
        },
        yAxis: {
            type: "value",
        },
        series: [
            {
                data: [],
                type: "bar",
                showBackground: true,
                backgroundStyle: {
                    color: "rgba(180, 180, 180, 0.2)",
                },
            },
        ],
    }
    myChart.showLoading()
    getStatistics3(timeDimension)
        .then((res) => {
            option.xAxis.data = res.data.x
            option.series[0].data = res.data.y
            option && myChart.setOption(option)
        })
        .finally(() => {
            myChart.hideLoading()
        })
}
const timeDimension = ref("d")
</script>

<script></script>

<style></style>
