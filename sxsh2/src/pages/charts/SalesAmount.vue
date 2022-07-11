<template>
    <div id="salesAmount" ref="el"></div>
</template>

<script setup>
import { onMounted, ref } from "@vue/runtime-core"
import * as echarts from "echarts"
import { useResizeObserver } from "@vueuse/core"
let myChart = null
const el = ref(null)
const getData = async () => {
    return JSON.parse('[["07-24","07-23","07-22","07-21","07-20","07-19","07-18"],[3,0,1,1,0,2,1]]')
}

useResizeObserver(el, (entries) => {
    myChart.resize()
})

onMounted(async () => {
    let [date, data] = await getData()
    myChart = echarts.init(document.getElementById("salesAmount"))
    myChart.setOption({
        xAxis: {
            data: date,
            type: "category",
        },
        yAxis: {
            type: "value",
            boundaryGap: ['0%', '20%']
        },
        series: [
            {
                data,
                type: "bar",
                // symbol: "none",
                // sampling: "lttb",
                // itemStyle: {
                //     color: "red",
                // },
                // areaStyle: {
                //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                //         {
                //             offset: 0,
                //             color: "rgb(255, 158, 68)",
                //         },
                //         {
                //             offset: 1,
                //             color: "rgb(255, 70, 131)",
                //         },
                //     ]),
                // },
            },
        ],
    })
})
</script>
