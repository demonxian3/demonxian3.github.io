<template>
    <a-layout style="min-height: 100vh">
        <a-layout-header
            :style="{ position: 'fixed', zIndex: 1, width: '100%' }"
        >
            <div class="logo">盛兴商店</div>
            <a-menu
                v-model:selectedKeys="selectedKeys"
                theme="dark"
                mode="horizontal"
            >
                <template
                    v-for="route in $router.getRoutes()"
                    :key="route.name"
                >
                    <a-menu-item
                        :key="route.name"
                        v-if="route.meta.label"
                        @click="$router.push(route.path)"
                        >{{ route.meta.label }}</a-menu-item
                    >
                </template>
            </a-menu>
        </a-layout-header>
        <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
            <!-- <a-breadcrumb :style="{ margin: '16px 0' }">
                <a-breadcrumb-item>Home</a-breadcrumb-item>
                <a-breadcrumb-item>List</a-breadcrumb-item>
                <a-breadcrumb-item>App</a-breadcrumb-item>
            </a-breadcrumb> -->
            <div
                :style="{
                    background: '#fff',
                    padding: '16px',
                    height: '100%',
                    margin: '16px 0 0 0',
                }"
            >
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
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import store, { ACT_LOADGOODS } from "./config/store"



const selectedKeys = ref([location.hash.split('#/').pop()])
const router = useRouter()
store.dispatch(ACT_LOADGOODS)
</script>

<style>
.logo {
    content: "盛兴商店";
    color: white;
    line-height: 34px;
    font-size: 28px;
    font-family: cursive;
    float: left;
    width: 120px;
    height: 31px;
    margin: 16px 12px 16px -24px;
}

::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 5px;
}

::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #eee;
}

::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 0;
}
</style>
