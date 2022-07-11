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
                        @blur="searchBarcode(goodsForm.sBarCode)"
                        @pressEnter="(e)=>pd(e, ()=>{searchBarcode(goodsForm.sBarCode)})"
                           
                    />
                    <a-tooltip title="无码商品生成条码">
                        <a-button :disabled="!!props.barcode.length" >
                            <template #icon><CodeSandboxOutlined @click="makeCode"/></template>
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
                        @click="goodsForm.dPrice=''"
                        @change="goodsForm.dVip=goodsForm.dPrice"
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
                    @focus="goodsForm.sType = []"
                    @select="handleSelect"
                    mode="tags"
                ></a-select>
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 8, span: 16 }" v-if="props.showSubmit" >
                <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
        </a-form>
    </a-spin>
</template>

<script setup>
import { message } from "ant-design-vue"
import { reactive, ref } from "@vue/reactivity"
import { CodeSandboxOutlined } from "@ant-design/icons-vue"
import store, { GET_GOODSTYPE, STA_GOODS, SET_GOODSITEM } from "~/config/store.js"
import { computed, onActivated, onBeforeMount, onDeactivated, onUnmounted, watch } from "@vue/runtime-core"
import { queryBarcode } from "~/lib/api.js"
import { debounce } from "~/lib/utils.js"
import pyutils from "~/lib/pinyin.js"
import moment from "moment";  
import useEvent  from '~/pages/hooks/useEvent.js';

let hasListener = false;

const goodsForm = reactive({
    sBarCode: "",
    sName: "",
    sPinyin: "",
    sType: [],
    sSpec: "",
    dPrice: 0.0,
    dVip: 0.0,
    dCost: 0.0,
    sPinyin: "",
})

const loading = ref(false)

const barcodeDisabled = ref(false)

const isStorage = () => {
    return !!store.state[STA_GOODS].find(g => g.sBarCode === goodsForm.sBarCode)
}

const saveGoods = () => {
    const saveData = JSON.parse(JSON.stringify(goodsForm))

    if (!saveData.sName || !saveData.sName) {
        message.error('商品条码或商品名称不能为空')
        return
    }

    saveData.sType = saveData.sType.join('')
    saveData.dPrice = (+saveData.dPrice).toFixed(2)
    saveData.dCost = (+saveData.dCost).toFixed(2)
    saveData.dVip = (+saveData.dVip).toFixed(2)
    saveData.dVip = (+saveData.dVip).toFixed(2)

    saveData.dtCreateTime = moment().format("YYYY-MM-DD hh:mm:ss")
    saveData.dtUpdateTime = moment().format("YYYY-MM-DD hh:mm:ss")
    saveData.iStatus = 1

    store.commit(SET_GOODSITEM, saveData);
    message.success('保存成功')
}

const handleSelect = (value) => {
    goodsForm.sType = [value]
}

const typeOptions = ref(
    store.getters[GET_GOODSTYPE].map((g) => ({ value: g, label: g })),
)

const searchBarcode = async (barcode) => {
    debugger;

    if (!barcode) {
        return
    }

    loading.value = true;
    // 如果在 localStorage,优先返回
    const fetchGoods = store.state[STA_GOODS].find(
        (g) => g.sBarCode === barcode,
    )
    if (fetchGoods) {
        goodsForm.sBarCode = fetchGoods.sBarCode
        goodsForm.sName = fetchGoods.sName
        goodsForm.sPinyin = fetchGoods.sPinyin
        goodsForm.sType = fetchGoods.sType.split(',')
        goodsForm.sSpec = fetchGoods.sSpec
        goodsForm.dPrice = fetchGoods.dPrice
        goodsForm.dVip = fetchGoods.dVip
        goodsForm.dCost = fetchGoods.dCost
        goodsForm.iPricing = fetchGoods.iPricing
        goodsForm.sPinyin = fetchGoods.sPinyin
        goodsForm.action = fetchGoods.action
        loading.value = false;
        return
    }

    try {
        const reply = await queryBarcode(barcode)
        if (reply.data.code === 1) {
            goodsForm.sType = []
            goodsForm.sBarCode = reply.data.data.barcode
            goodsForm.dPrice = reply.data.data.price
            goodsForm.sSpec = reply.data.data.standard
            goodsForm.sName = reply.data.data.goodsName
        }
    } finally {
        loading.value = false;
    }
    
}

const listenBarcode = () => {
    let timer = 0
    let barcode = ""
    return (e) => {
        if (document.activeElement.tagName !== "INPUT") {
            if (!timer) {
                barcode = ""
            }

            if (e.key.length === 1) {
                barcode += e.key
            }

            timer = debounce(() => {
                timer = 0
                if (e.key === "Enter") {
                    searchBarcode(barcode)
                }
            }, timer)
        }
    }
}

const makeCode = () => {
    goodsForm.sBarCode = (new Date()).getTime() + 2e12
    goodsForm.sType = ['无条码']
    goodsForm.sName = goodsForm.sPinyin = goodsForm.sSpec = '';
}

//fuck 表单回车自动提交
const pd = (e, fn) => {
    e.preventDefault();
    if (typeof fn === 'function') {
        fn();
    }
}

const props = defineProps({
    barcode: {
        type: String,
        default: '',
    },
    showSubmit: {
        type: Boolean,
        default: true,
    }
})

defineExpose({saveGoods})

watch(
    () => goodsForm.sName,
    (cur, prev) => {
        goodsForm.sPinyin = pyutils.chineseToFirstLetter(cur)
    },
)

if (!props.barcode) {
    const eventManager = useEvent(onBeforeMount, onUnmounted, onActivated, onDeactivated)
    const handle = eventManager.listenCodeScanGun(barcode => searchBarcode(barcode))
    eventManager.addEventHandleOnce('keydown', handle, 'listen_barcode_input')
} else {
    onBeforeMount(() => {
        goodsForm.sBarCode = props.barcode
        searchBarcode(goodsForm.sBarCode)
        barcodeDisabled.value = true;
    })
}

</script>

<style lang="less"></style>
