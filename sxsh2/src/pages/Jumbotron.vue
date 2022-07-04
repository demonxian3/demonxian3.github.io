<template>
    <div id="jumbotron" class="h-100vh object-cover pt-1 no-repeat">
        <div
            class="border-y py-7 w-3/5 m-auto text-7xl text-white text-center mt-30"
        >
            欢迎光临盛兴商店
        </div>
        <a-result>
            <template #icon>
                <SmileTwoTone/>
            </template>
        </a-result>

        <div class="text-center text-4xl text-yellow-200 font-bold tracking-wider">
            本次消费共￥{{totalPrice.toFixed(2)}} 元
        </div>
    </div>
</template>

<script setup>
import { SmileTwoTone } from '@ant-design/icons-vue';
import { onActivated, onMounted, onUnmounted, ref } from "@vue/runtime-core"
import useNotice from './hooks/useNotice';

const onNotice = (message) => {
    totalPrice.value = message.price
}
const totalPrice = ref(0);

let {addTimer, removeTimer } = useNotice(onNotice, 2000)

onMounted(addTimer)
onUnmounted(removeTimer)
 


</script>

<script></script>

<style lang="less">
#jumbotron {
    background: url("~/assets/bg.jpg");
}
</style>
