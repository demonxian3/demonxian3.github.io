<template>
    <div id="salesAmount" ref="el"></div>
</template>

<script setup>
import { onMounted, ref, watch, reactive } from "@vue/runtime-core"
import * as echarts from "echarts"
import { useResizeObserver } from "@vueuse/core"

const props = defineProps({
    dataSource: { type: Object, required: true },
    dimension: { type: String, default: "day" },
    target: { type: String, default: "salesPrice" },
})

let myChart = null
const el = ref(null)

const options = reactive({
    xAxis: {
        data: [],
        type: "category",
    },
    yAxis: {
        type: "value",
        boundaryGap: ["0%", "20%"],
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow",
        },
    },
    series: [
        {
            data: [],
            type: "bar",
        },
    ],
})

useResizeObserver(el, (entries) => {
    myChart.resize()
})

const renderChart = (dataSource, target, dimension) => {
    let xData = Object.keys(dataSource[target][dimension]).map((i) => +i + 1)
    if (dimension === "week") {
        xData = ["日", "一", "二", "三", "四", "五", "六"]
    }

    options.xAxis.data = xData
    options.series[0].data = Object.values(dataSource[target][dimension])
    myChart.setOption(options)
}

onMounted(() => {
    myChart = echarts.init(document.getElementById("salesAmount"))
    const { dataSource, target, dimension } = props
    renderChart(dataSource, target, dimension)

    watch(props, () => {
        props.dataSource &&
            renderChart(props.dataSource, props.target, props.dimension)
    })
})
</script>
