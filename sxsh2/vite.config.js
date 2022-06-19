import { defineConfig } from 'vite'
import Components from "unplugin-vue-components/vite"
import vue from '@vitejs/plugin-vue'
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "src"),
        },
    },
    plugins: [
        vue(),
        Components({
            resolvers: [AntDesignVueResolver()],
        }),
    ],
})
