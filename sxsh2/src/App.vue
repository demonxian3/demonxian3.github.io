<template>
    <router-view></router-view>
</template>

<script setup>
import store, { ACT_LOADGOODS, ACT_LOADORDER } from "./config/store"
store.dispatch(ACT_LOADGOODS)
store.dispatch(ACT_LOADORDER)
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
