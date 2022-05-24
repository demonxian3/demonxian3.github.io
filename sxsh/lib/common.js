Vue.use({
    install(Vue, options) {
        Vue.mixin({
            data: {
                goods: []
            },
            methods: {
                loadGoods() {
                    try {
                        this.goods = JSON.parse(localStorage.getItem('goods')) || []
                    } catch (e) {
                        this.goods = []
                    }

                    if (!this.goods.length) {
                        this.goods = window.goods;
                        localStorage.setItem('goods', JSON.stringify(this.goods))
                    }
                    console.log(this.goods);
                },
                debounce(exec, timer, ms=600){
                    clearTimeout(timer)
                    return setTimeout(exec, ms)
                }
            }            
        })
    }
})


$nav = $(`<nav class="navbar navbar-expand-lg navbar-dark bg-info">
<a class="navbar-brand" href="#">盛兴商店</a>
<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"
    aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
</button>
<div class="collapse navbar-collapse" id="navbarText">
    <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
            <a class="nav-link" href="index.html">查询 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="create.html">添加</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="import.html">导入</a>
        </li>
    </ul>
</div>
</nav>`)
$('body').prepend($nav);
