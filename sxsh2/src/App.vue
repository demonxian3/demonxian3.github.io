<template>
    <router-view></router-view>
</template>

<script setup>
import store, {
    ACT_LOADGOODS,
    ACT_LOADORDER,
    ACT_LOADTHEME,
    STA_THEME,
} from "./config/store"

store.dispatch(ACT_LOADGOODS)
store.dispatch(ACT_LOADORDER)
store.dispatch(ACT_LOADTHEME)
</script>

<style lang="less">
@import "./theme/common.less";
</style>
