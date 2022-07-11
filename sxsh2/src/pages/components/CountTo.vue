<template>
    {{ data.num.toFixed(fixed) }}
</template>

<script setup>
import { reactive, watch } from 'vue'
import gsap from 'gsap'

const data = reactive({
    num: 0,
})

const props = defineProps({
    value: {
        type: Number,
        default: 0,
    },
    fixed: {
        type: Number,
        default: 0,
    }
})

function AnimateCountTo() {
    gsap.to(data, {
        duration: 1.5,
        num: props.value,
    })
}

watch(() => props.value, AnimateCountTo, {immediate: true})

</script>

<style lang="less">

</style>
