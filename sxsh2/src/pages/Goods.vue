<template>
    <div>
        <a-select
            ref="select"
            v-model:value="filter.type"
            style="width: 120px"
            @change="searchGoods"
        >
            <a-select-option value="" key="all">所有</a-select-option>
            <a-select-option
                :key="idx"
                v-for="(type, idx) in getGoodsType()"
                :value="type"
                >{{ type }}</a-select-option
            >
        </a-select>
        <a-input-search
            v-model:value="filter.keyword"
            placeholder="商品名称/拼音/条码"
            enter-button
            @search="searchGoods"
            @change="searchGoods"
            @click="filter.keyword = ''"
            class="w-100 ml-2"
        />

        <a-space class="float-right">
            <a-button type="primary" @click="exportGoodsJson()">导出</a-button>
            <a-button type="primary" @click="goodsModalRef.showGoodsModal()"
                >新增</a-button
            >
        </a-space>
        <a-table
            :dataSource="goodsList"
            :columns="columns"
            class="mt-3"
            :scroll="{ x: 1200, y: 470 }"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.key === 'action'">
                    <span>
                        <EditOutlined
                            :style="{ fontSize: '16px', color: '#08c' }"
                            @click="
                                goodsModalRef.showGoodsModal(record.sBarCode)
                            "
                        />
                        <a-divider type="vertical" />
                        <a-popconfirm
                            title="确认删除该商品吗"
                            ok-text="确认"
                            cancel-text="取消"
                            @confirm="dropGoods(record)"
                        >
                            <DeleteOutlined
                                :style="{ fontSize: '16px', color: 'red' }"
                            />
                        </a-popconfirm>
                    </span>
                </template>
            </template>
        </a-table>
        <GoodsModalVue ref="goodsModalRef" @save="searchGoods" />
    </div>
</template>

<script setup>
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue"
import store, {
    STA_GOODS,
    GET_GOODSTYPE,
    DEL_GOODSITEM,
} from "~/config/store.js"
import {
    onActivated,
    onBeforeMount,
    onDeactivated,
    onUnmounted,
    onMounted,
    reactive,
    ref,
} from "vue"
import GoodsModalVue from "./components/GoodsModal.vue"
import create from "@ant-design/icons-vue/lib/components/IconFont"
import useGoods from "~/hooks/useGoods.js"
import useEvent from "~/hooks/useEvent.js"
let {
    filter,
    goodsList,
    dropGoods,
    searchGoods,
    getGoodsType,
    exportGoodsJson,
} = useGoods()

const goodsModalRef = ref(null)
const columns = [
    {
        title: "条码",
        dataIndex: "sBarCode",
        key: "sBarCode",
        width: 110,
        fixed: "left",
    },
    {
        title: "名称",
        dataIndex: "sName",
        key: "sName",
        width: 150,
        ellipsis: true,
    },
    { title: "类型", dataIndex: "sType", key: "sType", width: 100 },
    {
        title: "规格",
        dataIndex: "sSpec",
        key: "sSpec",
        width: 120,
        ellipsis: true,
    },
    {
        title: "售价",
        dataIndex: "dPrice",
        key: "dPrice",
        width: 60,
        sorter: (a, b) => a.dPrice - b.dPrice,
    },
    {
        title: "惠价",
        dataIndex: "dVip",
        key: "dVip",
        width: 60,
        sorter: (a, b) => a.dVip - b.dVip,
    },
    {
        title: "成本",
        dataIndex: "dCost",
        key: "dCost",
        width: 60,
        sorter: (a, b) => a.dCost - b.dCost,
    },
    { title: "标价", dataIndex: "iPricing", key: "iPricing", width: 100 },
    {
        title: "拼音",
        dataIndex: "sPinyin",
        key: "sPinyin",
        width: 100,
        ellipsis: true,
    },
    { title: "操作", key: "action", width: 80, fixed: "right" },
]

const eventManager = useEvent(
    onBeforeMount,
    onUnmounted,
    onActivated,
    onDeactivated,
)
const handle = eventManager.listenCodeScanGun((barcode) =>{
    filter.keyword = barcode
    searchGoods()
})
eventManager.addEventHandleOnce("keydown", handle, "listen_barcode_search")
</script>
