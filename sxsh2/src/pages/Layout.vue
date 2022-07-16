<template>
    <a-config-provider :locale="locale === 'en' ? enUS : zhCN">
        <a-layout style="min-height: 100vh">
            <a-layout-header class="fixed z-1 w-full">
                <div class="logo">{{ setting.storeName }}</div>
                <a-menu
                    v-model:selectedKeys="selectedKeys"
                    theme="dark"
                    mode="horizontal"
                    class="select-none !shadow-none"
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
                    <a-switch
                        v-model:checked="darkTheme"
                        class="absolute right-23 top-5"
                        @change="changeTheme()"
                    />
                    <FullscreenOutlined
                        class="fullscreen"
                        @click="toggle"
                        v-show="!isFullscreen"
                    />
                    <FullscreenExitOutlined
                        class="fullscreen"
                        @click="toggle"
                        v-show="isFullscreen"
                    />
                    <GlobalOutlined @click="toggleLang" class="fullscreen !right-43 top-5"/>
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
    </a-config-provider>
</template>

<script setup>

import {
    FullscreenExitOutlined,
    FullscreenOutlined,
    GlobalOutlined,
} from "@ant-design/icons-vue"
import { ref } from "@vue/reactivity"
import { useRoute, useRouter } from "vue-router"
import { useFullscreen } from "@vueuse/core"
import { onBeforeMount } from "@vue/runtime-core"
import store, { ACT_LOADTHEME, STA_THEME, SET_THEME } from "../config/store"
import setting from "../config/setting"
import useMultiLang from "~/hooks/useMultiLang.js"

const { isFullscreen, toggle } = useFullscreen()
const router = useRouter()
const currentHash = ref(location.hash.split("#/").pop())
const selectedKeys = ref([currentHash.value || "home"])
const darkTheme = ref(store.state[STA_THEME] === "dark")
const changeTheme = () => {
    store.commit(SET_THEME, darkTheme.value ? "dark" : "light")
}
const { zhCN, enUS, locale, toggleLang } = useMultiLang()
const getPopupContainer = (el, dialogContext) => {
    if (dialogContext) {
        return dialogContext.getDialogWrap()
    } else {
        return document.body
    }
}
</script>
