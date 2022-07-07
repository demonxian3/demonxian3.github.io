<template>
    <div id="jumbotron" class="h-100vh object-cover pt-1 no-repeat">
        <FullscreenOutlined
            class="text-white text-3xl absolute right-5 top-4 cursor-pointer"
            @click="toggle"
            v-show="!isFullscreen"
        />
        <FullscreenExitOutlined
            class="text-white text-3xl absolute right-5 top-4 cursor-pointer"
            @click="toggle"
            v-show="isFullscreen"
        />
        <HomeOutlined
            class="text-white text-3xl absolute left-5 top-4 cursor-pointer"
            @click="$router.push('/')"
        />
        <div
            class="border-y py-7 w-3/5 m-auto text-7xl text-white text-center mt-30"
        >
            欢迎光临盛兴商店
        </div>

        <div class="flex justify-center items-center my-7">
            <component :is="getIcon" class="text-6xl " :class="getColor"></component>
        </div>



        <div class="text-center text-4xl text-white font-bold tracking-wider">
            {{ showContent }} <span v-show="showCursor" class="cursor">|</span>
        </div>

        <div class="mt-5 flex justify-center items-center" v-show="showImage">
            <img :src="showImage" width="230">
        </div>
    </div>
</template>

<script setup>
import {
    CheckCircleOutlined,
    FullscreenExitOutlined,
    FullscreenOutlined,
    HomeOutlined,
    PayCircleFilled,
    SmileTwoTone,
} from "@ant-design/icons-vue"
import {
    computed,
    onActivated,
    onMounted,
    onUnmounted,
    ref,
} from "@vue/runtime-core"
import useNotice, {
    STATUS_PENDING,
    STATUS_PAYING,
    STATUS_FINISH,
} from "./hooks/useNotice"

import { useFullscreen } from "@vueuse/core"
const { isFullscreen, toggle } = useFullscreen()

let timer = 0
const showStatus = ref(STATUS_PENDING)
const showContent = ref("")
const showCursor = ref(false)
const showImage = ref('')

const getIcon = computed(() => {
    const iconMap = {
        [STATUS_PAYING]: PayCircleFilled,
        [STATUS_FINISH]: CheckCircleOutlined,
        [STATUS_PENDING]: SmileTwoTone,
    }
    return iconMap[showStatus.value]
})
const getColor = computed(() => {
    const colorMap = {
        [STATUS_PAYING]: 'text-yellow-400',
        [STATUS_FINISH]:'text-teal-300',
        [STATUS_PENDING]: 'text-blue-600',
    }
    return colorMap[showStatus.value]
})
const onNotice = (message) => {
    const { status } = message
    showStatus.value = status
     showImage.value = ''
    if (status === STATUS_FINISH) {
        typeContent(`支付成功，欢迎下次光临本店`)
    } else if (status === STATUS_PAYING) {
        if (paywayMap[message.payway].image) {
            showImage.value = paywayMap[message.payway].image
        } 
        typeContent(`本次消费共计 ￥${message.price} 元， 使用【${paywayMap[message.payway].label}】支付`)
    } else {
        typeContent(`欢迎光临，盛兴商店`)
    }
}

const typeContent = (text) => {
    clearInterval(timer)
    let idx = 0
    let ms = 50

    showContent.value = ""
    showCursor.value = true

    const func = () => {
        clearInterval(timer)

        if (idx < text.length) {
            showContent.value += text[idx]
            idx++
            
            timer = setInterval(func, ms)
        } else {
            showCursor.value = false
        }
    }

    timer = setInterval(func, ms)
}

let { addTimer, removeTimer, paywayMap } = useNotice(onNotice, 1000)

onMounted(addTimer)
onUnmounted(removeTimer)
</script>
<style lang="less">
#jumbotron {
    .cursor {
        animation: Blink 1s ease-in 0s infinite;
    }

    @keyframes Blink {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    background: url("~/assets/bg.jpg") no-repeat;
    background-size: 100% 180%;
}
</style>
