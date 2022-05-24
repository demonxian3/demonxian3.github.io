// 潘多拉指引菜单， 依赖样式：pandora_devwebadmin/public/static/css/game/quick-menu.css
Vue.component('v-quick-menu', {
    template: `
        <div class="quick-menu" ref="quickMenu" :style="quickMenuStyle"> 
            <div v-for="(menu,idx) in menuList" class="sub-menu" :style="getSubMenu(idx)" :title="menu.title" :data-title="menu.title"> 
                <a 
                    :data-tip="menu.tip"
                    :style="subMenuStyle" 
                    @mouseover.stop="mouseEnterSubMenu"
                    @mouseout.stop="mouseOutSubMenu" 
                    @click="menu.clickHandle(menu,idx)"> 
                    <i :class="menu.icon" ref="icon" ></i> 
                </a> 
            </div>
            <div class="menu" :style="menuStyle"> 
                <div class="core-menu" @click="toggleMenu"> 
                    <div class="bar"></div> 
                </div> 
            </div> 
        </div>
    `,
    props: {
        menuList:{
            type:Array,
            required: true,
        },
        backgroundColor:{
            type:String,
            default:'#20babb'
        },
        color:{
            type:String,
            default:'#fff'
        },
        position:{
            type:String,
            default:'top-left'
        }
    },
    computed:{
        quickMenuStyle(){
            const topPosition = {top:'30px'},
                bottomPosition={bottom:'30px'},
                leftPosition = {left:'30px'},
                rightPosition = {right:'30px'};

            let style = this.isTop?topPosition:bottomPosition;
            Object.assign(style, this.isLeft?leftPosition:rightPosition);
            Object.assign(style,{transform: this.isLeft?"rotate(-180deg)":"rotate(180deg)"});
            return style
        },
        menuStyle(){
            return {
                backgroundColor: this.backgroundColor,
                color: this.color
            }
        },
        subMenuStyle(){
            const style = {
                backgroundColor: this.backgroundColor,
                color: this.color
            };
            return style
        },

        isTop(){
            return !!~this.position.toLowerCase().indexOf('top');
        },
        isLeft(){
            return !!~this.position.toLowerCase().indexOf('left');
        }
    },
    data(){
        return{
            menuSize:60,
            subMenu4:[[["0","-160"],["-80","-138.6"],["-138.6","-80"],["-160","0"]],[["0","-160"],["80", "-138.6"],["138.6","-80"],["160","0"]],[["0","160"],["138.6","80"],["80","138.6"],["160","0"]],[["-160","0"],["-138.6","80"],["-80","138.6"],["0","160"]]],
            subMenu3:[[["-160","0"],["-113","-113"],["0","-160"]],[["0","-160"],["113","-113"],["160","0"]],[["0","160"],["113","113"],["160","0"]],[["-160","0"],["-113","113"],["0","160"]]],
            subMenu2:[[["-160","0"],["0","-160"]],[["0","-160"],["160","0"]],[["0","160"],["160","0"]],[["-160","0"],["0","160"]]]
        }
    },
    methods:{
        getSubMenu(n){
            let menuPosition = this.menuList.length===4?this.subMenu4:this.menuList.length===3?this.subMenu3:this.subMenu2;
            menuPosition = this.isTop&&this.isLeft?menuPosition[2]:this.isTop&&!this.isLeft?menuPosition[1]:!this.isTop&&this.isLeft?menuPosition[3]:menuPosition[0]
            return {top:menuPosition[n][0]+'px',left:menuPosition[n][1]+'px'}
        },
        toggleMenu(e){
            let menuEl = this.$refs.quickMenu;
            let menuIconEl = this.$refs.icon;
            if(!~menuEl.className.indexOf(' active')){
                menuEl.className += ' active';
                menuIconEl.forEach( function(element, index) {
                    element.className += ' menu-animate';
                });
            } else {
                menuEl.className = menuEl.className.replace(' active','');
                menuIconEl.forEach( function(element, index) {
                    element.className = element.className.replace(' menu-animate','');
                });
            }

        },
        processCallback(key){
            this.$emit('process',key);
        },
        mouseEnterSubMenu(e){
            if(e.target.tagName==='A'){
                e.target.style.backgroundColor = this.lightenColor(this.backgroundColor, 20);
                // e.target.firstElementChild.style.backgroundColor = this.lightenColor(this.backgroundColor, 20)
            } else if(e.target.tagName==='I'){
                e.target.parentElement.style.backgroundColor = this.lightenColor(this.backgroundColor, 20);
                // e.target.style.backgroundColor = this.lightenColor(this.backgroundColor, 20)
            }

        },
        mouseOutSubMenu(e){
            if(e.target.tagName==='A'){
                e.target.style.backgroundColor = this.backgroundColor;
                // e.target.firstElementChild.style.backgroundColor = this.backgroundColor
            }else if(e.target.tagName==='I'){
                e.target.parentElement.style.backgroundColor = this.backgroundColor;
                // e.target.style.backgroundColor = this.backgroundColor
            }

        },
        lightenColor (hex, amt) {
            var usePound = false;
            if (hex[0] === '#') {
                hex = hex.slice(1);
                usePound = true;
            }

            var num = parseInt(hex, 16);
            var r = (num >> 16) + amt;

            if (r > 255) r = 255;
            else if (r < 0) r = 0;

            var b = ((num >> 8) & 0x00FF) + amt;

            if (b > 255) b = 255;
            else if (b < 0) b = 0;

            var g = (num & 0x0000FF) + amt;

            if (g > 255) g = 255;
            else if (g < 0) g = 0;
            return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
        }
    }
});
