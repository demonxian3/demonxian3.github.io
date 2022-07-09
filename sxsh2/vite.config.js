import { defineConfig } from "vite"
import Components from "unplugin-vue-components/vite"
import vue from "@vitejs/plugin-vue"
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers"
import WindiCSS from "vite-plugin-windicss"
import { getThemeVariables } from "ant-design-vue/dist/theme"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "src"),
        },
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                modifyVars: {
                    ...getThemeVariables({
                        compact: true,
                    }),
                },
            },
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
