<template>
    <div id="paywayPie" ref="el"></div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "@vue/runtime-core"
import * as echarts from "echarts"
import store, { STA_THEME } from "../../config/store"
import { useResizeObserver } from "@vueuse/core"

let myChart = null 
const el = ref(null)
const getData = async () => {
    return JSON.parse(
        '[["07-24","07-23","07-22","07-21","07-20","07-19","07-18"],[3,0,1,1,0,2,1]]',
    )
}

const getTextColor = () => {
    return store.state[STA_THEME] === "dark" ? "#FFFFFFD9" : "#6B7280";
}

const options = reactive({
    title: {},
    tooltip: {
        trigger: "item",
    },
    legend: {
        orient: "vertical",
        left: "left",
        textStyle: {
            color: getTextColor(),
        },
    },
    series: [
        {
            left: "15%",
            label: {
                color: getTextColor(),
            },
            name: "支付占比",
            type: "pie",
            data: [
                { value: 1048, name: "阿里支付" },
                { value: 735, name: "微信支付" },
                { value: 580, name: "扫码支付" },
                { value: 484, name: "现金付款" },
                { value: 300, name: "银联支付" },
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                },
            },
        },
    ],
})

useResizeObserver(el, (entries) => {
    myChart.resize()
})

watch(
    () => store.state[STA_THEME],
    () => {
        options.legend.textStyle.color = getTextColor()
        options.series[0].label.color = getTextColor()
        myChart.setOption(options)
    },
)


onMounted(async () => {
    myChart = echarts.init(document.getElementById("paywayPie"))
    myChart.setOption(options)
})
</script>
