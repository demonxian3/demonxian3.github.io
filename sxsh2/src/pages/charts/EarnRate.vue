<template>
    <a-progress
        :stroke-color="{
            '0%': '#108ee9',
            '100%': '#87d068',
        }"
        :percent="+earnRate.num.toFixed(0)"
    />
</template>

<script setup>
import { onMounted, reactive } from "@vue/runtime-core"
import gsap from "gsap"
const props = defineProps({
    value: {
        type: Number,
        default: 0,
    },
})

const earnRate = reactive({
    num: 0,
})

onMounted(() => {
    gsap.to(earnRate, { num: props.value, duration: 1.5 })
})

</script>
