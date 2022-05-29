Vue.use({
    install(Vue, options) {
        Vue.mixin({
            data: {
                goods: [],
                toast: null,
            },
            methods: {
                loadGoods() {
                    try {
                        this.goods =
                            JSON.parse(localStorage.getItem('goods')) || []
                    } catch (e) {
                        this.goods = []
                    }

                    if (!this.goods.length) {
                        this.goods = window.goods
                        localStorage.setItem(
                            'goods',
                            JSON.stringify(this.goods),
                        )
                    }

                    this.goods.forEach((good) => {
                        if (!good.sType) {
                            good.sType = '无分类'
                        }
                    })

                    console.log(this.goods)
                },

                getTypeList(goods = null) {
                    if (!goods) {
                        goods = this.goods
                    }

                    const typeMap = {}
                    this.goods.forEach((good) => {
                        if (good.sType) {
                            typeMap[good.sType] = 1
                        } else {
                            good.sType = '无分类'
                        }
                    })

                    const typeList = Object.keys(typeMap)
                    return typeList
                },

                debounce(exec, timer, ms = 600) {
                    clearTimeout(timer)
                    return setTimeout(exec, ms)
                },
            },
            mounted() {
                if (typeof Swal !== 'undefined') {
                    const swalInstance = Swal.mixin({
                        toast: true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: 1200,
                        timerProgressBar: false,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener(
                                'mouseleave',
                                Swal.resumeTimer,
                            )
                        },
                    })

                    this.toast = {
                        success: (title) => {
                            swalInstance.fire({ title, icon: 'success' })
                        },
                        error: (title) => {
                            swalInstance.fire({ title, icon: 'error' })
                        },
                        warning: (title) => {
                            swalInstance.fire({ title, icon: 'warning' })
                        },
                        info: (title) => {
                            swalInstance.fire({ title, icon: 'info' })
                        },
                        question: (title) => {
                            swalInstance.fire({ title, icon: 'question' })
                        },
                        confirm: async (title) => {
                            return swalInstance.fire({
                                title,
                                timer: 3500,
                                showCancelButton: true,
                                showConfirmButton: true,
                                confirmButtonText: '恢复',
                                cancelButtonText: '取消',
                                icon: 'question',
                            })
                        },
                    }
                }
            },
        })
    },
})

$nav = $(`<nav class="navbar navbar-dark bg-info">
<a class="navbar-brand" href="index.html">盛兴商店</a>
<ul class="navbar-nav mr-auto d-flex" style="flex-direction: row">
    <li class="nav-item mr-3" >
        <a class="nav-link pb-1" href="index.html">查询</a>
    </li>
    <li class="nav-item mr-3">
        <a class="nav-link pb-1" href="create.html">添加</a>
    </li>
    <li class="nav-item mr-3">
        <a class="nav-link pb-1" href="import.html">导入</a>
    </li>
</ul>
</nav>`)

const baseName = location.pathname.split('/').pop()
if (baseName) {
    $nav.find(`a[href="${baseName}"]`).closest('li').addClass('active')
}
$('body').prepend($nav)
