<template>
    <a-layout style="min-height: 100vh">
        <a-layout-header
            :style="{ position: 'fixed', zIndex: 1, width: '100%' }"
        >
            <div class="logo" />
            <a-menu
                v-model:selectedKeys="selectedKeys"
                theme="dark"
                mode="horizontal"
            >
                <template v-for="(route) in $router.getRoutes()" :key="route.name">
                    <a-menu-item 
                        :key="route.name"  
                        v-if="route.meta.label"
                        @click="$router.push(route.path)"
                    >{{route.meta.label}}</a-menu-item
                >
                </template>
                
            </a-menu>
        </a-layout-header>
        <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
            <a-breadcrumb :style="{ margin: '16px 0' }">
                <a-breadcrumb-item>Home</a-breadcrumb-item>
                <a-breadcrumb-item>List</a-breadcrumb-item>
                <a-breadcrumb-item>App</a-breadcrumb-item>
            </a-breadcrumb>
            <div
                :style="{ background: '#fff', padding: '24px', height: '100%' }"
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
import { defaultRoute } from '~/config/router'
const selectedKeys = ref([defaultRoute])
const router = useRouter()
console.log(router.getRoutes())
</script>

<style>
.logo {
    float: left;
    width: 120px;
    height: 31px;
    margin: 16px 24px 16px 0;
    background: url("./assets/favicon.ico") no-repeat;
}
</style>
