<template>
    <a-modal
        v-model:visible="goodsVisible"
        :title="currentBarcode ? '商品编辑' : '商品新增'"
        @ok="saveGoods"
        okText="保存"
        cancelText="取消"
        destroyOnClose
    >
        <GoodsFormVue
            ref="goodsFormRef"
            :barcode="currentBarcode"
            :showSubmit="false"
        />
    </a-modal>
</template>

<script setup>
import { ref } from "@vue/reactivity"
import GoodsFormVue from "./GoodsForm.vue"
import useGoods from "../hooks/useGoods"
const emit = defineEmits(['save'])
const { searchGoods } = useGoods()

const goodsVisible = ref(false)
const currentBarcode = ref("")
const goodsFormRef = ref(null)

const showGoodsModal = (barcode = "") => {
    currentBarcode.value = barcode
    goodsVisible.value = true
}

const saveGoods = () => {
    goodsFormRef.value.saveGoods()
    if (currentBarcode.value) {
        goodsVisible.value = false
    }
    emit('save')
}

const closeGoodsModal = () => {
    goodsVisible.value = false
}

defineExpose({
    showGoodsModal,
    saveGoods,
    closeGoodsModal,
})
</script>
