const html = `
    <div id="guider-menu">
    <v-quick-menu :menu-list="menuList" background-color="#17c4c5" color="#fff" position="bottom-right">
    </v-quick-menu>
    </div>
`;


$(html).appendTo('#app')

Vue.use({
    install(Vue, options) {
        Vue.mixin({
            data: () => {
                return {
                    menuList: [
                        {
                            icon: 'fa fa-plus-square-o',
                            clickHandle: (menu, idx) => {
                                location.href = 'create.html'
                            },
                            title: '添加商品',
                            tip: '添加',
                        },
                        {
                            icon: 'fa fa-search',
                            clickHandle: (menu, idx) => {
                                location.href = 'index.html'
                            },
                            title: '查询商品',
                            tip: '查询',
                        },
                        {
                            icon: 'fa fa-question-circle',
                            clickHandle: (menu, idx) => {
                            },
                            title: '预留',
                            tip: 'Q&A',
                        },
                    ],
                }
            }
        })
    }
})

