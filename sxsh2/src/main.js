import { createApp } from 'vue'
import App from './App.vue'
import router from "~/config/router"
import store from "~/config/store"
import Antd from "ant-design-vue"
import "ant-design-vue/dist/antd.less"
import "virtual:windi.css"

const app = createApp(App)
app.use(store)
app.use(router)
app.use(Antd)
app.mount('#app')
