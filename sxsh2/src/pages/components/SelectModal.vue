<template>
    <a-modal
        v-model:visible="selectVisible"
        :title="'选择商品'"
        @ok="commitSelected"
        okText="确定"
        cancelText="取消"
    >
        <a-input-search
            v-model:value="filter.keyword"
            placeholder="商品名称/拼音/条码"
            enter-button
            @search="searchGoods"
            @change="searchGoods"
            @click="filter.keyword=''"
            class="w-full"
        />

        <a-tabs v-model:activeKey="filter.type" @change="searchGoods">
            <a-tab-pane key="">
                <template #tab>
                    <span>
                        所有商品
                    </span>
                </template>
            </a-tab-pane>
            <a-tab-pane :key="type" v-for="(type,idx) in getGoodsType()">
                <template #tab>
                    <span>
                        {{type}}
                    </span>
                </template>
            </a-tab-pane>
        </a-tabs>

        <a-table 
            size="small" 
            class="min-h-310px" 
            rowKey="sBarCode"
            :dataSource="goodsList.slice(0, 8)" 
            :columns="columns" 
            :scroll="{ x: 720, y: 270 }" 
            :pagination="false"
            :custom-row="customRow"
            :row-selection="rowSelection"
        >
        </a-table>

        <span class="float-right mt-0.5 text-teal-600">当前已选中 {{state.selectList.length}} 件商品</span>
    </a-modal>
</template>

<script setup>
import { QrcodeOutlined, ScanOutlined } from '@ant-design/icons-vue'
import { reactive, ref } from "@vue/reactivity"
import { computed } from '@vue/runtime-core'
import useGoods from "~/hooks/useGoods.js"
let { filter, goodsList, dropGoods, searchGoods, getGoodsType } = useGoods()

const selectVisible = ref(false)
const emit = defineEmits("commit")

const state = reactive({
    selectList: [],
});
const selectRow = (record) => {
    const selectList = [...state.selectList];
    if (selectList.indexOf(record.sBarCode) >= 0) {
        selectList.splice(selectList.indexOf(record.sBarCode), 1);
    } else {
        selectList.push(record.sBarCode);
    }
    state.selectList = selectList;
}

const rowSelection = computed(() => {
    return {
        selectedRowKeys: state.selectList,
        onChange: (selectList) => {
            state.selectList = selectList;
        },
    };
});

const customRow = (record) => {
    return {
        onClick: () => {
            selectRow(record);
        },
    };
};
const columns = [ 
    { title: "条码", dataIndex: "sBarCode", key: "sBarCode",width:140,  fixed: 'left'},
    { title: "名称", dataIndex: "sName", key: "sName", width:200,  ellipsis: true,},
    { title: "售价", dataIndex: "dPrice", key: "dPrice", width:60},
    { title: "会员", dataIndex: "dVip", key: "dVip", width:60},
    { title: "类型", dataIndex: "sType", key: "sType", width:100,  ellipsis: true},
    { title: "规格", dataIndex: "sSpec", key: "sSpec",  ellipsis: true},

]

const showSelectModal = (barcode = "") => {
    selectVisible.value = true
}

const commitSelected = () => {
    selectVisible.value = false;
    emit('commit', state.selectList)
    state.selectList = []
}

defineExpose({ showSelectModal })
</script>
