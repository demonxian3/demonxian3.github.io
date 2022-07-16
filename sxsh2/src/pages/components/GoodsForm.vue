<template>
    <a-spin tip="加载中" :spinning="loading">
        <a-form
            id="goodsForm"
            :model="goodsForm"
            name="goodsForm"
            autocomplete="off"
            @finish="saveGoods"
            class="w-100% mx-auto p-5 relative"
        >
            <a-tag
                :color="isStorage() ? 'success' : 'blue'"
                class="absolute -right-2 top-0"
                >{{ isStorage() ? "已存储" : "未存储" }}</a-tag
            >

            <a-form-item class="mt-3" label="条码" name="sBarCode">
                <a-input-group compact>
                    <a-input
                        :disabled="barcodeDisabled"
                        v-model:value="goodsForm.sBarCode"
                        style="width: calc(100% - 32px)"
                        placeholder="商品条码"
                        @focus="goodsForm.sBarCode = ''"
                        @blur="queryBarcode(goodsForm.sBarCode)"
                        @pressEnter="
                            (e) =>
                                pd(e, () => {
                                    queryBarcode(goodsForm.sBarCode)
                                })
                        "
                    />
                    <a-tooltip title="无码商品生成条码">
                        <a-button :disabled="!!props.barcode.length">
                            <template #icon
                                ><CodeSandboxOutlined @click="makeCode"
                            /></template>
                        </a-button>
                    </a-tooltip>
                </a-input-group>
            </a-form-item>

            <a-form-item label="品名" name="sName">
                <a-input
                    v-model:value="goodsForm.sName"
                    placeholder="商品名称"
                />
            </a-form-item>

            <a-form-item label="拼音" name="sPinyin">
                <a-input
                    v-model:value="goodsForm.sPinyin"
                    placeholder="输入品名自动生成拼音"
                    @pressEnter="pd"
                />
            </a-form-item>

            <a-form-item label="规格" name="sSpec">
                <a-input
                    v-model:value="goodsForm.sSpec"
                    placeholder="商品规格"
                    @pressEnter="pd"
                />
            </a-form-item>

            <a-space :size="10">
                <a-form-item label="售价" name="dPrice">
                    <a-input-number
                        v-model:value="goodsForm.dPrice"
                        :keyboard="true"
                        :min="0"
                        :step="0.5"
                        style="
                             {
                                width: '100%';
                            }
                        "
                        placeholder="商品售价"
                        @click="goodsForm.dPrice = ''"
                        @change="goodsForm.dVip = goodsForm.dPrice"
                    />
                </a-form-item>
                <a-form-item label="VIP" name="dVip">
                    <a-input-number
                        v-model:value="goodsForm.dVip"
                        :keyboard="true"
                        :min="0"
                        :step="0.5"
                        style="
                             {
                                width: '100%';
                            }
                        "
                        placeholder="商品会员价"
                    />
                </a-form-item>
                <a-form-item label="成本" name="dCost">
                    <a-input-number
                        v-model:value="goodsForm.dCost"
                        :keyboard="true"
                        :min="0"
                        :step="0.5"
                        style="
                             {
                                width: '100%';
                            }
                        "
                        placeholder="商品成本"
                    />
                </a-form-item>
            </a-space>

            <a-form-item label="类型" name="dPrice">
                <a-select
                    v-model:value="goodsForm.sType"
                    show-search
                    placeholder="商品规格"
                    :options="typeOptions"
                    @select="handleSelect"
                    mode="tags"
                    ref="typeSelectRef"
                ></a-select>
            </a-form-item>

            <a-form-item
                :wrapper-col="{ offset: 8, span: 16 }"
                v-if="props.showSubmit"
            >
                <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
        </a-form>
    </a-spin>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity"
import { CodeSandboxOutlined } from "@ant-design/icons-vue"
import useEvent from "~/hooks/useEvent.js"
import useGoods from "~/hooks/useGoods.js"
import {
    computed,
    onActivated,
    onBeforeMount,
    onDeactivated,
    onUnmounted,
    watch,
} from "@vue/runtime-core"

const {
    goodsForm,
    loading,
    queryBarcode,
    makeCode,
    saveGoods,
    isStorage,
    makePinyin,
    getGoodsType,
} = useGoods()

const typeSelectRef = ref(null)
const typeWeight = reactive({
    无条码: 0,
    零食: 0,
    啤酒: 0,
    国内烟草: 0,
    果汁: 0,
    奶茶: 0,
    牛奶: 0,
    方便面: 0,
    茶饮料: 0,
    白酒: 0,
    汽水: 0,
    矿泉水: 0,
    功能饮料: 0,
    雪糕: 0,
    日用品: 0,
    鸡尾酒: 0,
    出口烟草: 0,
    进口烟草: 0,
    洋酒: 0,
    红酒: 0,
    无分类: 0,
    医疗用品: 0,
})
const barcodeDisabled = ref(false)
const currentWeight = ref(0)

// 根据点击次数增加权重，提高排名而置顶
const handleSelect = (value) => {
    currentWeight.value += 1
    typeWeight[value] = currentWeight.value
    typeSelectRef.value.blur()
    goodsForm.sType = [value]
}

const typeOptions = computed(() => {
    return getGoodsType(typeWeight).map((g) => ({ value: g, label: g }))
})

//fuck 表单回车自动提交
const pd = (e, fn) => {
    e.preventDefault()
    if (typeof fn === "function") {
        fn()
    }
}

const props = defineProps({
    barcode: {
        type: String,
        default: "",
    },
    showSubmit: {
        type: Boolean,
        default: true,
    },
})

defineExpose({ saveGoods })

watch( () => goodsForm.sName, makePinyin )

if (!props.barcode) {
    const eventManager = useEvent(
        onBeforeMount,
        onUnmounted,
        onActivated,
        onDeactivated,
    )
    const handle = eventManager.listenCodeScanGun((barcode) =>
        queryBarcode(barcode),
    )
    eventManager.addEventHandleOnce("keydown", handle, "listen_barcode_input")
} else {
    onBeforeMount(() => {
        goodsForm.sBarCode = props.barcode
        queryBarcode(goodsForm.sBarCode)
        barcodeDisabled.value = true
    })
}
</script>

<style lang="less"></style>
