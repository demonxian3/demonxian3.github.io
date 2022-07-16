<template>
    <a-drawer
        width="450"
        v-model:visible="backendVisible"
        class="custom-class"
        title="后台挂单"
        placement="right"
    >
        <a-list item-layout="horizontal" :data-source="backCarts" class="-mt-5">
            <template #renderItem="{ item, index }">
                <a-list-item key="item.title" class="">
                    <template #actions>
                        <a
                            key="list-loadmore-edit"
                            @click="attachCart(index), (backendVisible = false)"
                            >取单</a
                        >
                        <a key="list-loadmore-more" @click="deleteCart(index)"
                            >废弃</a
                        >
                    </template>
                    <a-list-item-meta :description="`挂单时间：${item.time}`">
                        <template #title>
                            {{ `${item.count} 件商品，共 ${item.price}元` }}
                        </template>
                        <template #avatar><a-avatar :src="orderSvg" /></template>
                    </a-list-item-meta>
                </a-list-item>
            </template>
        </a-list>
    </a-drawer>
</template>

<script setup>
import { ref, reactive } from "@vue/reactivity"
import orderSvg from "~/assets/order.svg"
import useCart from "~/hooks/useCart.js"
const backendVisible = ref(false)
const {
    backCarts,
    attachCart,
    detachCart,
    deleteCart
} = useCart()

function showBackendDrawer(){
    backendVisible.value = true;
}

defineExpose({showBackendDrawer})
</script>

<style lang="less"></style>
