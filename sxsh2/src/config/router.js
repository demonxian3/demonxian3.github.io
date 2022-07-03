import { createRouter, createWebHashHistory } from "vue-router"
import Cashier from '~/pages/Cashier.vue'
import Goods from "~/pages/Goods.vue"
import Order from "~/pages/Order.vue"
import Create from "~/pages/Create.vue"
export const defaultRoute = "goods"

const routes = [
    {
        path: "/",
        redirect: "/" + defaultRoute,
    },
    {
        path: "/cashier",
        component: Cashier,
        name: "cashier",
        menu: true,
        meta: { label: "收银" },
    },
    {
        path: "/order",
        component: Order,
        name: "order",
        menu: true,
        meta: { label: "账单" },
    },
    {
        path: "/create",
        component: Create,
        name: "create",
        menu: false,
        meta: { label: "新增" },
    },
    {
        path: "/goods",
        component: Goods,
        name: "goods",
        menu: true,
        meta: { label: "商品" },
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})



export default router