<template>
    <div id="payCount" ref="el"></div>
</template>

<script setup>
import { onMounted, ref } from "@vue/runtime-core"
import * as echarts from "echarts"
import { useResizeObserver } from "@vueuse/core"
let el = ref(null)
let myChart = null;
async function getData() {
    return [1, 10, 23, 0, 0, 23, 12, 25, 24, 21, 63, 12, 52, 34, 37, 22, 0, 1]
}

useResizeObserver(el, (entries) => {
    myChart.resize()
})

onMounted(async () => {
    let data = await getData()
    myChart = echarts.init(document.getElementById("payCount"))
    myChart.setOption({
        // tooltip: {
        //     trigger: "axis",
        //     position: function (pt) {
        //         return [pt[0], "10%"]
        //     },
        // },
        // toolbox: {
        //     feature: {
        //         dataZoom: {
        //             yAxisIndex: "none",
        //         },
        //         restore: {},
        //         saveAsImage: {},
        //     },
        // },

        xAxis: {
            show: false,
            type: "category",
        },
        yAxis: {
            show: false,
            type: "value",
            boundaryGap: ["20%", "80%"],
        },
        series: [
            {
                smooth: true,
                type: "bar",
                symbol: "none",
                sampling: "lttb",
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "#83bff6" },
                        { offset: 0.5, color: "#188df0" },
                        { offset: 1, color: "#188df0" },
                    ]),
                },
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: "#2378f7" },
                            { offset: 0.7, color: "#2378f7" },
                            { offset: 1, color: "#83bff6" },
                        ]),
                    },
                },
                data,
            },
        ],
    })
})
</script>
