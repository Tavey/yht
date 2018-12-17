<template>
    <div v-if="show" class="page">
        <div class="title">
            <p>为了更流畅地使用停车服务</p>
            <div>请绑定手机号</div>
        </div>
        <div class="input-area" @click="aler()">
            <span>+86</span>
            <input ref="input" type="tel" maxlength="13" placeholder="请输入手机号" v-on:input="inputFunc($refs.input)" v-model="phone" />
            <!-- <input label="手机号" placeholder="请输入手机号" type="tel"  maxlength="11" v-model="phone"> -->
        </div>
        <div class="get" @click="getVerification()">获取短信验证码</div>
    </div>
</template>

<script>
import keyboard from "../../components/numberKeyboard";
import * as types from "@/store/types";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    name: "bindPhone",
    data() {
        return {
            phone: "",
            oldPhone: "",
            stop: false,
            show: false
        };
    },
    created() {
        let vm = this;
        // let state = {
        //     hisRecord: [],
        //     userInfo: {
        //         phone: "13524530886",
        //         accessToken: "1714f8c6-5607-45e6-9b16-a81327e83642"
        //     }
        // };
        // localStorage.setItem("store", JSON.stringify(state));
        // return
        // debugger
        if (vm.userInfo.accessToken) {
            vm.$router.push({
                path: `/${vm.$route.query.routerId}`,
                query: {
                    routerId: vm.$route.query.routerId,
                    auth_code: vm.$route.query.auth_code,
                    type: vm.$route.query.type,
                },
                replace: true
            });
            return;
        } else {
            vm.show = true;
        }

        // }
        return;
    },
    mounted() {
        this.$nextTick(function() {
            if (this.show == true) {
                this.$refs["input"].focus();
            }
        });
    },
    // activated: function() {
    //     this.$setgoindex();
    // },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo
        })
    },
    methods: {
        ...mapMutations({
            setUserInfo: types.global.mutations.SET_USER_INFO
        }),
        aler() {
            this.$refs["input"].focus();
        },
        getVerification() {
            let vm = this;
            let phone = vm.phone.replace(/\s+/g, "");
            vm.loadingOpen();
            vm.sendValidateCode(phone).then(res => {
                vm.loadingClose();
                let data = res.data;
                vm.setUserInfo({ phone: phone });
                vm.$router.push({
                    path: "phone/verification",
                    query: {
                        routerId: vm.$route.query.routerId,
                        auth_code: vm.$route.query.auth_code
                    },
                    replace: true
                });
            });
        },
        inputFunc(a) {
            let news = this.phone.length;
            let old = this.oldPhone.length;
            if (old < news) {
                if (a.value.length == 3 || a.value.length == 8) {
                    this.phone += " ";
                }
            } else {
                if (this.phone.length == 3 || this.phone.length == 8) {
                    this.phone = this.phone.slice(0, this.phone.length - 1);
                }
            }
            this.oldPhone = this.phone;
        },
        sendValidateCode(phone) {
            let vm = this;
            return vm.Api.sendValidateCode( phone);
        }
    }
};
</script>

<style scoped lang="scss">
.page {
    padding: 0 33px;
    margin: 0 auto;
    font-size: 16px;
    padding-top: 45px;
    box-sizing: border-box;
    background: #fff;
    font-family: "微软雅黑";
}
.get {
    width: 100%;
    height: 48px;
    background: #ed3e35;
    border-radius: 2px;
    color: #fff;
    line-height: 48px;
    text-align: center;
}
.title {
    height: 68px;
    margin-bottom: 53px;

    p {
        color: #9b9b9b;
        line-height: 32px;
    }
    div {
        font-size: 24px;
        font-weight: bold;
    }
}
.input-area {
    border-bottom: 1px solid #575757;
    padding-bottom: 6px;
    margin-bottom: 97px;
    span {
        color: #9dadbd;
        margin-right: 17px;
        font-family: "微软雅黑";
    }
    input {
        height: 28px;
        border: 0px;
        width: 200px;
        font-size: 16px;
        caret-color: #ed3e35;
    }
}
input::-webkit-input-placeholder {
    /* WebKit browsers */

    color: #cccccc;
    font-size: 16px;
    width: 2px;
}

input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */

    color: #cccccc;
    font-size: 16px;
    width: 2px;
}

input::-moz-placeholder {
    /* Mozilla Firefox 19+ */

    color: #cccccc;
    font-size: 16px;
    width: 2px;
}

input:-ms-input-placeholder {
    /* Internet Explorer 10+ */

    color: #cccccc;
    font-size: 16px;
    width: 2px;
}
</style>
