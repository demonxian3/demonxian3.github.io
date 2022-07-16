<template>
  <a-result status="404" title="404" sub-title="找不到页面">
    <template #extra>
      <a-button type="primary" @click="back">返回</a-button>
    </template>
  </a-result>
</template>

<script setup>
const back = () => location.href='/'
</script>