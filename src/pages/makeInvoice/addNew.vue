<template>
    <div class="page">
        <div class="info-wrap">
            <div class="title">抬头类型</div>
            <div class="tab-wrap">
                <div
                    class="tab"
                    :class="{click:company}"
                    @click="company = true"
                >企业抬头</div>
                <div
                    class="tab"
                    :class="{click:!company}"
                    @click="company = false"
                >个人抬头</div>
            </div>
            <div class="area">
                <mt-field
                    label="发票抬头"
                    placeholder="填写发票抬头"
                    v-model="taitInfo.name"
                ></mt-field>
                <mt-field
                    v-if="company"
                    label="税号"
                    placeholder="填写税号"
                    v-model="taitInfo.number"
                ></mt-field>
                <mt-field
                    label="接收邮箱"
                    placeholder="填写接收邮箱"
                    v-model="taitInfo.email"
                ></mt-field>
                <mt-field
                    label="手机号"
                    placeholder="填写接收手机号"
                    v-model="taitInfo.phone"
                ></mt-field>
            </div>
        </div>
        <div
            class="but bor2"
            @click="complete()"
        >保存</div>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    name: "open",
    components: {},
    data() {
        return {
            company: true,
            taitInfo: {
                name: "",
                number: "",
                email: '',
                phone: ''
            }
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo
        })
    },
    created() {

    },
    mounted() {

    },
    methods: {
        change() { },
        complete() {
            let vm = this;
            vm.add();
            // this.$router.push({ path: 'end' })
        },
        add() {
            let vm = this;
            let info = {
                userId: vm.userInfo.phone,
                type: vm.company ? 2 : 1,
                name: vm.taitInfo.name,
                eMail: vm.taitInfo.email,
                phone: vm.taitInfo.phone,
                businessTax: vm.taitInfo.number
            }
            // Object.keys(info).forEach(function (key) {

            //     if (info[key] || info[key] == '') {
            //         vm.toasts('请填写完整')
            //         return
            //     } else {

            //     }

            // });
            if(info.name == ''){
                 vm.toasts('请填写发票抬头')
                 return
            }
            if(info.businessTax == ''&&info.type == 2){
                 vm.toasts('请填写手税号')
                 return
            }
            if(info.eMail == ''){
                 vm.toasts('请填写邮箱')
                 return
            }
            if(info.phone == ''){
                 vm.toasts('请填写手机号')
                 return
            }
            vm.Api.addHeader(info).then(res => {
                if (res.data.code = 1000) {
                    vm.toasts('添加成功')
                    setTimeout(() => {
                        vm.$router.go(-1);
                    }, 1000);

                } else {
                    vm.toasts(res.data.msg)
                }
            })

        }
    }
};
</script>

<style scoped lang="scss">
.page {
    box-sizing: border-box;
}
.title {
    color: #2f2f33;
    font-size: 18px;
    line-height: 25px;
    margin-bottom: 18px;
}
.tab-wrap {
    margin-bottom: 12px;
}
.use-wrap {
    background: #fff;
    padding: 12px 20px 0 20px;
    margin-top: 7px;
}
.info-wrap {
    background: #fff;
    padding: 12px 20px 0 20px;
    .tab {
        height: 40px;
        width: 100px;
        border-top-left-radius: 9999px;
        border-top-right-radius: 9999px;
        border-bottom-left-radius: 9999px;
        border-bottom-right-radius: 9999px;
        border: 1px solid #bec2cc;
        font-size: 16px;
        color: #bec2cc;
        line-height: 40px;
        text-align: center;
        display: inline-block;
        margin-right: 16px;
    }
    .click {
        background: #2657eb;
        color: #fff;
    }
}
.but {
    // position: absolute;
    // bottom: 48px;
    // left: 33px;
        margin-top: 50px;
}
</style>
<style scoped>
.page >>> .mint-cell-text,
input {
    font-size: 16px !important;
}
.page >>> .mint-field-core {
    font-size: 16px !important;
}
.page >>> .red .mint-field-core {
    color: #ed3e35 !important;
}
.page >>> .mint-cell-wrapper {
    padding: 0;
}

.page >>> .mint-field-core::-webkit-input-placeholder {
    color: #cccccc;
}
.page >>> .mint-field-core:-moz-placeholder {
    color: #cccccc;
}
.page >>> .mint-field-core::-moz-placeholder {
    color: #cccccc;
}
.page >>> .mint-field-coret:-ms-input-placeholder {
    color: #cccccc;
}
</style>



