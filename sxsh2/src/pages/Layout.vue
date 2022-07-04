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
import { ref } from '@vue/reactivity'
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const currentHash = ref(location.hash.split("#/").pop())
const selectedKeys = ref([currentHash.value])
</script>
