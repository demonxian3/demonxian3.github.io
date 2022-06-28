<template>
    <a-card :tab-list="[{key:'frontend',tab:'收银'}, {key:'backend',tab:'挂单'}]">
        <div class="h-69vh overflow-y-scroll">
            <a-table 
                :dataSource="shopCart" 
                :columns="columns"  
                :scroll="{ x: 400, y: 420 }" 
                :pagination="false"
            >
                <template #bodyCell="{ column, text, record }">
                    <!-- TODO 数量可编辑 -->
                    <!-- <template v-if="column.key === 'iCount'">
                        <div class="editable-cell">
                            <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                                <a-input v-model:value="editableData[record.key].name" @pressEnter="save(record.key)" />
                                <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
                            </div>
                            <div v-else class="editable-cell-text-wrapper">
                                {{ text || ' ' }}
                                <edit-outlined class="editable-cell-icon" @click="edit(record.key)" />
                            </div>
                        </div>
                    </template> -->

                    <template v-if="column.key === 'dSubTotal'">
                        {{record.iCount * record.dPay}}
                    </template>

                    <template v-if="column.key === 'action'">
                        <span>
                            <PlusSquareOutlined :style="{fontSize: '16px', color: '#08c'}" @click="increseGoods(record)"/>
                            <a-divider type="vertical" />
                            <MinusSquareOutlined :style="{fontSize: '16px', color: '#00cc80'}" @click="decreseGoods(record)"/>  
                            <a-divider type="vertical" />
                            <CloseCircleOutlined :style="{fontSize: '16px', color: '#cc000c'}" @click="removeGoods(record)"/>  
                        </span>
                    </template>
                </template>
            </a-table>

        </div>
        <div class="absolute bottom-0 p-2 w-full left-0 bg-indigo-50">
            <div class="px-3">
                <div class="cashier-total w-full flex justify-between border-b ">
                    <span class="text-lime-600">共计{{shopCart.length}}种{{shopCart.reduce((s,c)=>s+=+c.iCount,0)}}件商品</span>
                    <span class="text-red-600">总价￥{{shopCart.reduce((s,c)=>s+=(c.iCount*c.dPay),0)}}元</span>
                </div>
                <div class="flex justify-between mt-2">
                     <a-space >
                        <a-button type="primary" class="bg-cyan-400 border-none" @click="goodsModalRef.showGoodsModal()">
                            <template #icon><AppstoreAddOutlined/></template>
                            新增
                        </a-button>
                        <a-button type="primary" class="bg-orange-400 border-none">
                            <template #icon><DatabaseFilled /></template>
                            选品
                        </a-button>
                    </a-space>
                    <a-space >
                        <a-button type="primary" class="bg-teal-600 border-none" @click="clearCart">
                            <template #icon><DeleteFilled /></template>
                            清空
                        </a-button>
                        <a-button type="primary" class="bg-indigo-400 border-none" v-show="shopCart.length">
                            <template #icon><CloudUploadOutlined/></template>
                            取单
                        </a-button>
                        <a-button type="primary" class=" bg-pink-600 border-none" v-show="!shopCart.length">
                            <template #icon><GatewayOutlined/></template>
                            挂单
                        </a-button>
                        <a-button type="primary" class=" bg-red-700 border-none">
                            <template #icon><DollarOutlined /></template>
                            收款
                        </a-button>
                    </a-space>
                </div>
                
            </div>
        </div>
        <GoodsModalVue ref="goodsModalRef" />
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
    PlusSquareOutlined 
} from '@ant-design/icons-vue'
import store, {STA_GOODS} from '~/config/store.js'
import { onActivated, onBeforeMount, onDeactivated, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useEvent } from '../lib/event';
import GoodsModalVue from './components/GoodsModal.vue';

const goodsModalRef = ref(null)
const shopCart = reactive([
    { sBarCode: "123", sName: "123", dPrice: "123", dPay: "123", iCount: "1", },
    { sBarCode: "123", sName: "123", dPrice: "123", dPay: "123", iCount: "123", },
    { sBarCode: "123", sName: "123", dPrice: "123", dPay: "123", iCount: "123", },
    { sBarCode: "123", sName: "123", dPrice: "123", dPay: "123", iCount: "123", },
    { sBarCode: "123", sName: "123", dPrice: "123", dPay: "123", iCount: "123", },
    { sBarCode: "123", sName: "123", dPrice: "123", dPay: "123", iCount: "123", },
    { sBarCode: "123", sName: "123", dPrice: "123", dPay: "123", iCount: "123", },
    { sBarCode: "123", sName: "123", dPrice: "123", dPay: "123", iCount: "123", },
    { sBarCode: "123", sName: "123", dPrice: "123", dPay: "123", iCount: "123", },
    { sBarCode: "123", sName: "123", dPrice: "123", dPay: "123", iCount: "123", },
    { sBarCode: "123", sName: "123", dPrice: "123", dPay: "123", iCount: "123", },
    { sBarCode: "123", sName: "123", dPrice: "123", dPay: "123", iCount: "123", },
    { sBarCode: "123", sName: "123", dPrice: "123", dPay: "123", iCount: "123", },
    { sBarCode: "123", sName: "123", dPrice: "123", dPay: "123", iCount: "123", },
    { sBarCode: "123", sName: "123", dPrice: "123", dPay: "123", iCount: "123", },
    { sBarCode: "123", sName: "123", dPrice: "123", dPay: "123", iCount: "123", },
    { sBarCode: "123", sName: "123", dPrice: "123", dPay: "123", iCount: "123", },

])
const columns = reactive([
    { title: '条码', dataIndex: 'sBarCode', key: 'sBarCode', width:110},
    { title: '名称', dataIndex: 'sName', key: 'sName', width:200, ellipsis: true},
    { title: '原价', dataIndex: 'dPrice', key: 'dPrice', width:55},
    { title: '售价', dataIndex: 'dPay', key: 'dPay', width:55},
    { title: '数量', dataIndex: 'iCount', key: 'iCount', width:55},
    { title: '小计', dataIndex: 'dSubTotal', key: 'dSubTotal', width:55},
    { title: '操作', dataIndex: 'action', key: 'action', width:110},
])

const increseGoods = (goods) => {
    goods.iCount++;
}

const decreseGoods = (goods) => {
    goods.iCount > 1 && goods.iCount--;
}

const removeGoods = (record) => {
    const idx = shopCart.findIndex(g => g === record)
    if (idx >= 0) {
        shopCart.splice(idx, 1);
    }
}

const clearCart = () => {
    shopCart.splice(0, shopCart.length);
}

const joinCart = (barcode) => {
    const goods = store.state[STA_GOODS].find(g => g.sBarCode === barcode)
    const inCartIdx = shopCart.findIndex(g => g.sBarCode === barcode)
    if (goods) {
        if (inCartIdx >= 0) {
            shopCart[inCartIdx].iCount++
        } else {
            shopCart.push( { 
                sBarCode: goods.sBarCode,
                sName: goods.sName,
                dPrice: goods.dPrice,
                dPay: goods.dPrice,
                iCount: 1,
            })
        }
    } else {
        goodsModalRef.value.showGoodsModal(barcode) 
    }

}

const eventManager = useEvent(onBeforeMount, onUnmounted, onActivated, onDeactivated)
const handle = eventManager.listenCodeScanGun(barcode => joinCart(barcode))
eventManager.addEventHandleOnce('keydown', handle, 'listen_barcode_input')

onActivated(() => {
})
</script>


<style lang="less">
.cashier-total {
    font-size: 20px;
    letter-spacing: 5px;
    font-family: cursive;
}
</style>

