import { createRouter, createWebHashHistory } from "vue-router"
import Cashier from '~/pages/Cashier.vue'
import Goods from "~/pages/Goods.vue"

const routes = [
    {
        path: "/",
        redirect: '/cashier',
    },
    {
        path: "/cashier",
        component: Cashier,
        name: "cashier",
        meta: { label: "收银台" },
    },
    {
        path: "/goods",
        component: Goods,
        name: "goods",
        meta: { label: "商品管理" },
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export const defaultRoute = 'cashier'

export default router