<template>
    <div id="salesCount" ref="el"></div>
</template>

<script setup>
import { onMounted, ref } from "@vue/runtime-core"
import * as echarts from "echarts"
import { useResizeObserver } from "@vueuse/core"

async function getData() {
    return [1, 10, 23, 0, 0, 23, 12, 25, 24, 21, 63, 12, 52 ,34, 37, 22, 0, 1]
}

let el = ref(null)
let myChart = null
useResizeObserver(el, (entries) => {
    myChart.resize()
})


onMounted(async () => {
    let data = await getData()
    myChart = echarts.init(document.getElementById("salesCount"))
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
            boundaryGap: ['50%', '100%']
        },
        series: [
            {
                smooth: true,
                type: "line",
                symbol: "none",
                sampling: "lttb",
                itemStyle: {
                    color: "red",
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: "rgb(255, 158, 68)",
                        },
                        {
                            offset: 1,
                            color: "rgb(255, 70, 131)",
                        },
                    ]),
                },
                data,
            },
        ],
    })
})
</script>
