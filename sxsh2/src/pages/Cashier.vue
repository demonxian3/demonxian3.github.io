<template>
    <a-card size="small">
        <div class="h-68vh overflow-y-scroll">
            <a-table
                :dataSource="shopCart"
                :columns="columns"
                :scroll="{ x: 400, y: 450 }"
                :pagination="false"
            >
                <template #bodyCell="{ column, record, index }">
                    <!-- TODO 数量可编辑 -->
                    <template v-if="column.key === 'iCount'">
                        <div class="editable-cell">
                            <div
                                v-if="editableData[index]"
                                class="editable-cell-input-wrapper"
                            >
                               <a-input-number
                                    class="w-70px"
                                    :step="0.5"
                                    size="small"
                                    v-model:value="editableData[index].iCount"
                                    @pressEnter="saveCount(index)"
                                />
                                <CheckOutlined
                                    class="editable-cell-icon-check"
                                    @click="saveCount(index)"
                                />
                            </div>
                            <div v-else class="editable-cell-text-wrapper">
                                {{ record.iCount || " " }}
                                <EditOutlined
                                    class="editable-cell-icon"
                                    @click="editCount(index)"
                                />
                            </div>
                        </div>
                    </template>

                    <template v-if="column.key === 'dSubTotal'">
                        {{ record.iCount * record.dPay }}
                    </template>

                    <template v-if="column.key === 'action'">
                        <span>
                            <PlusSquareOutlined
                                :style="{ fontSize: '16px', color: '#08c' }"
                                @click="increseGoods(index)"
                            />
                            <a-divider type="vertical" />
                            <MinusSquareOutlined
                                :style="{
                                    fontSize: '16px',
                                    color: '#00cc80',
                                }"
                                @click="decreseGoods(index)"
                            />
                            <a-divider type="vertical" />
                            <CloseCircleOutlined
                                :style="{
                                    fontSize: '16px',
                                    color: '#cc000c',
                                }"
                                @click="removeGoods(index)"
                            />
                        </span>
                    </template>
                </template>
            </a-table>
        </div>
        <a-card size="small">
            <template #title>
                <span class="text-3xl text-indigo-400"
                    >共计 {{ shopCart.length }} 种
                    {{ getTotalCount() }} 件商品</span
                >
            </template>

            <template #extra>
                <span class="text-3xl text-red-400"
                    >总价 ￥{{ getTotalPrice() }} 元
                </span>
            </template>
            <div class="flex justify-between select-none">
                <a-space>
                    <a-button
                        type="primary"
                        @click="goodsModalRef.showGoodsModal()"
                    >
                        <template #icon><AppstoreAddOutlined /></template>
                        新增
                    </a-button>
                    <a-button
                        type="primary"
                        class="!bg-orange-600 border-none"
                        @click="selectModalRef.showSelectModal()"
                    >
                        <template #icon><DatabaseFilled /></template>
                        选品
                    </a-button>
                    <a-button
                        type="primary"
                        class="!bg-lime-600 border-none"
                        @click="backendDrawerRef.showBackendDrawer()"
                    >
                        <template #icon><DesktopOutlined /></template>
                        后台
                    </a-button>
                </a-space>
                <a-space>
                    <a-button
                        type="primary"
                        class="!bg-teal-600 border-none"
                        @click="clearCart"
                    >
                        <template #icon><DeleteFilled /></template>
                        清空
                    </a-button>
                    <a-button
                        type="primary"
                        class="!bg-pink-600 border-none"
                        @click="detachCart"
                    >
                        <template #icon><GatewayOutlined /></template>
                        挂单
                    </a-button>
                    <a-button
                        type="primary"
                        class="!bg-red-700 border-none"
                        @click="checkoutModalRef.showCheckoutModal()"
                    >
                        <template #icon><DollarOutlined /></template>
                        收款
                    </a-button>
                </a-space>
            </div>
        </a-card>

        <div class="absolute bottom-0 p-2 w-full left-0 bg-indigo-50 hidden">
            <div class="px-3">
                <div class="cashier-total w-full flex justify-between border-b">
                    <span class="text-lime-600 font-bold"
                        >共计{{ shopCart.length }}种{{
                            getTotalCount()
                        }}件商品</span
                    >
                    <span class="text-red-600 font-bold"
                        >总价￥{{ getTotalPrice() }}元</span
                    >
                </div>
                <div class="flex justify-between mt-2">
                    <a-space>
                        <a-button
                            type="primary"
                            class="bg-cyan-400 border-none"
                            @click="goodsModalRef.showGoodsModal()"
                        >
                            <template #icon><AppstoreAddOutlined /></template>
                            新增
                        </a-button>
                        <a-button
                            type="primary"
                            class="bg-orange-600 border-none"
                            @click="selectModalRef.showSelectModal()"
                        >
                            <template #icon><DatabaseFilled /></template>
                            选品
                        </a-button>
                        <a-button
                            type="primary"
                            class="bg-lime-600 border-none"
                            @click="backendDrawerRef.showBackendDrawer()"
                        >
                            <template #icon><DesktopOutlined /></template>
                            后台
                        </a-button>
                    </a-space>
                    <a-space>
                        <a-button
                            type="primary"
                            class="bg-teal-600 border-none"
                            @click="clearCart"
                        >
                            <template #icon><DeleteFilled /></template>
                            清空
                        </a-button>
                        <a-button
                            type="primary"
                            class="bg-pink-600 border-none"
                            @click="detachCart"
                        >
                            <template #icon><GatewayOutlined /></template>
                            挂单
                        </a-button>
                        <a-button
                            type="primary"
                            class="bg-red-700 border-none"
                            @click="checkoutModalRef.showCheckoutModal()"
                        >
                            <template #icon><DollarOutlined /></template>
                            收款
                        </a-button>
                    </a-space>
                </div>
            </div>
        </div>
        <GoodsModalVue ref="goodsModalRef" />
        <SelectModalVue ref="selectModalRef" @commit="batchJoinCart" />
        <BackendDrawerVue ref="backendDrawerRef" />
        <CheckoutModalVue ref="checkoutModalRef" />
    </a-card>
</template>

<script setup>
import {
    MinusSquareOutlined,
    AppstoreAddOutlined,
    CloseCircleOutlined,
    CloudUploadOutlined,
    DatabaseFilled,
    DeleteFilled,
    DollarOutlined,
    GatewayOutlined,
    PlusSquareOutlined,
    DesktopOutlined,
    EditOutlined,
    CheckOutlined,
} from "@ant-design/icons-vue"
import GoodsModalVue from "./components/GoodsModal.vue"
import SelectModalVue from "./components/SelectModal.vue"
import BackendDrawerVue from "./components/BackendDrawer.vue"
import CheckoutModalVue from "./components/CheckoutModal.vue"

import {
    onActivated,
    onBeforeMount,
    onDeactivated,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    watch,
} from "vue"
import useCart from "~/hooks/useCart.js"
import useEvent from "~/hooks/useEvent.js"
import orderSvg from "~/assets/order.svg"

const goodsModalRef = ref(null)
const selectModalRef = ref(null)
const backendDrawerRef = ref(null)
const checkoutModalRef = ref(null)
const editableData = reactive({})
const columns = [
    { title: "条码", dataIndex: "sBarCode", key: "sBarCode", width: 110 },
    {
        title: "名称",
        dataIndex: "sName",
        key: "sName",
        width: 200,
        ellipsis: true,
    },
    { title: "原价", dataIndex: "dPrice", key: "dPrice", width: 55 },
    { title: "售价", dataIndex: "dPay", key: "dPay", width: 55 },
    { title: "数量", dataIndex: "iCount", key: "iCount", width: 78 },
    { title: "小计", dataIndex: "dSubTotal", key: "dSubTotal", width: 55 },
    { title: "操作", dataIndex: "action", key: "action", width: 110 },
]

const {
    getTotalCount,
    getTotalPrice,
    shopCart,
    backCarts,
    increseGoods,
    decreseGoods,
    joinCart,
    clearCart,
    removeGoods,
    batchJoinCart,
    attachCart,
    detachCart,
    deleteCart,
} = useCart()

const eventManager = useEvent(
    onBeforeMount,
    onUnmounted,
    onActivated,
    onDeactivated,
)

const editCount = (index) => {
    editableData[index] = JSON.parse(JSON.stringify(shopCart[index]))
}

const saveCount = (index) => {
    Object.assign(shopCart[index], editableData[index])
    delete editableData[index]
}

const handle = eventManager.listenCodeScanGun((barcode) => {
    joinCart(barcode) || goodsModalRef.value.showGoodsModal(barcode)
})
eventManager.addEventHandleOnce("keydown", handle, "listen_barcode_input")
</script>

<style lang="less">
.cashier-total {
    font-size: 20px;
    letter-spacing: 5px;
    font-family: cursive;
}
</style>
