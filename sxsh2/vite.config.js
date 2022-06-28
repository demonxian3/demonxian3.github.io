import { defineConfig } from 'vite'
import Components from "unplugin-vue-components/vite"
import vue from '@vitejs/plugin-vue'
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers"
import WindiCSS from "vite-plugin-windicss"
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
        WindiCSS(),
        Components({
            resolvers: [AntDesignVueResolver()],
        }),
    ],
})
