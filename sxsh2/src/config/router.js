import { createRouter, createWebHashHistory } from "vue-router"
import Cashier from "~/pages/Cashier.vue"
import Goods from "~/pages/Goods.vue"
import Order from "~/pages/Order.vue"
import Create from "~/pages/Create.vue"
import Jumbotron from "~/pages/Jumbotron.vue"
import NotFound from "~/pages/NotFound.vue"
import Layout from "~/pages/Layout.vue"
import Home from "~/pages/Home.vue"

export const defaultRoute = "goods"

const routes = [
    {
        path: "/",
        component: Layout,
        children: [
            {
                path: "/",
                component: Home,
                name: "home",
                menu: true,
                meta: { label: "主页" },
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
        ],
    },
    {
        path: "/jumbotron",
        component: Jumbotron,
        name: "jumbotron",
        menu: true,
        meta: { label: "巨幕" },
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound,
        meta: { title: "找不到页面" },
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
