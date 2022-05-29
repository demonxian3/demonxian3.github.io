Vue.component('v-input-select', {
    template: `
        <div class="inpselect" ref="inpSelect">
            <ul class="list-group border d-none" ref="ul">
                <li
                    :key="type"
                    v-for="type in showTypeList"
                    class="list-group-item-info list-group-item list-group-item-action"
                    @click="clickSelection($event.target.innerText)"
                >
                    {{type}}
                </li>
            </ul>
            <input
                @focus="showSelection"
                @input="handleInput($event.target.value)"
                class="form-control"
                :value="value"
                
            />
        </div>
    `,
    props: {
        typelist: {
            type: Array,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            showTypeList: this.typelist.slice(),
        }
    },
    mounted() {
        // 点击外面隐藏下拉框
        document.addEventListener('click', (e) => {
            if (!e.path.includes(this.$refs['inpSelect'])) {
                $(this.$refs['ul']).addClass('d-none')
            }
        })
    },
    methods: {
        showSelection() {
            $(this.$refs['ul'])
                .removeClass('d-none')
                .animate(
                    {
                        scrollTop: $(this.$refs['ul']).prop('scrollHeight'),
                    },
                    1,
                )
        },

        handleInput(value) {
            if (value.length) {
                this.showTypeList = this.typelist.filter(
                    (i) => i.indexOf(value) >= 0,
                )
            } else {
                this.showTypeList = this.typelist
            }

            this.$emit('input', value)
        },
        clickSelection(value) {
            $(this.$refs['ul']).addClass('d-none')
            this.$emit('input', value)
        },
    },
})
