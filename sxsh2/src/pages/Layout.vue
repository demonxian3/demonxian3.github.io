<template>
    <a-layout style="min-height: 100vh">
        <a-layout-header class="fixed z-1 w-full" >
            <div class="logo">盛兴商店</div>
            <a-menu
                v-model:selectedKeys="selectedKeys"
                theme="dark"
                mode="horizontal"
                class="select-none"
            >
                <template
                    v-for="route in $router.getRoutes()"
                    :key="route.name"
                >
                    <a-menu-item
                        :key="route.name"
                        v-if="route.meta.menu"
                        @click="
                            typeof route.meta.click === 'function'
                                ? route.meta.click()
                                : $router.push(route.path)
                        "
                        >{{ route.meta.label }}</a-menu-item
                    >
                </template>
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
            </a-menu>
        </a-layout-header>
        <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
            <div class="p-15px h-full m-0 mt-16px">
                <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component :is="Component"></component>
                    </keep-alive>
                </router-view>
            </div>
        </a-layout-content>
    </a-layout>
</template>

<script setup>
import {
    FullscreenExitOutlined,
    FullscreenOutlined,
} from "@ant-design/icons-vue"
import { ref } from "@vue/reactivity"
import { useRoute, useRouter } from "vue-router"
import { useFullscreen } from "@vueuse/core"

const { isFullscreen, toggle } = useFullscreen()
const router = useRouter()
const currentHash = ref(location.hash.split("#/").pop())
const selectedKeys = ref([currentHash.value])
</script>
