import { createRouter, createWebHashHistory } from "vue-router"
import Cashier from "~/pages/Cashier.vue"
import Goods from "~/pages/Goods.vue"
import Order from "~/pages/Order.vue"
import Create from "~/pages/Create.vue"
import Jumbotron from "~/pages/Jumbotron.vue"
import NotFound from "~/pages/NotFound.vue"
import Layout from "~/pages/Layout.vue"
import Home from "~/pages/Home.vue"
import useNotice from '../pages/hooks/useNotice'

export const defaultRoute = "goods"
const { openNotice } = useNotice()

const routes = [
    {
        path: "/",
        component: Layout,
        children: [
            {
                path: "/",
                component: Home,
                name: "home",
                meta: { menu: true, label: "主页" },
            },
            {
                path: "/cashier",
                component: Cashier,
                name: "cashier",
                meta: { menu: true, label: "收银" },
            },
            {
                path: "/order",
                component: Order,
                name: "order",
                meta: { menu: true, label: "账单" },
            },
            {
                path: "/create",
                component: Create,
                name: "create",
                meta: { menu: true, label: "新增" },
            },
            {
                path: "/goods",
                component: Goods,
                name: "goods",
                meta: { menu: true, label: "商品" },
            },
        ],
    },
    {
        path: "/jumbotron",
        component: Jumbotron,
        name: "jumbotron",
        menu: false,
        meta: { menu: true, label: "投屏", click: openNotice },
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
