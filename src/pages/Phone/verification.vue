<template>
    <div class="page">
        <div class="title">
            <p>输入验证码</p>
            <div>验证码已发送至手机号
                <span>+86 {{phone}}</span>
            </div>
        </div>
        <div class="input-area">
            <div class="input-wrap" v-for="(ipt,index) in num" :class="{finish:code[index]}" @click="open()">{{code[index]}}</div>
        </div>
        <mt-popup ref="picker" :modal="false" v-model="popupVisible" position="bottom">
            <keyboard @setInfo="accept" />
        </mt-popup>
    </div>
    </div>
</template>

<script>
import { NUMBER } from "@/consts";
import keyboard from "../../components/numberKeyboard";
import * as types from "@/store/types";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    name: "verification",
    components: {
        keyboard
    },
    data() {
        return {
            phone: "",
            code: [],
            num: 4,
            number: NUMBER,
            popupVisible: true,
            Send: true
        };
    },
    watch: {
        code(val) {
            if (val.length == 4) {
                this.updata();
                if (this.Send) {
                    this.updata();
                }
            }
        }
    },
    created() {
        this.phone = this.piecewise(this.userInfo.phone);
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo
        })
    },
    mounted() {
        let vm = this;
        // vm.setUserInfo({
        //     phone: "13524530886",
        //     token:
        //         "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI4MiIsImlhdCI6MTUzNjExNTIyMCwiZXhwIjoxNjIyNTE1MjIwfQ.fATOwVTk_3QWq5WPb2iwDcA0oZPR5jhVxIMeLeSlPShRZEXm_qKQkgwAPDrgp9gI_QjO9a64DPvUrm-0DkYuXA"
        // });

        document.onkeydown = function() {
            var oEvent = window.event;
            if (oEvent.keyCode == 8) {
            }
        };
        vm.phone = vm.piecewise(vm.userInfo.phone);
    },
    methods: {
        ...mapMutations({
            setUserInfo: types.global.mutations.SET_USER_INFO
        }),
        piecewise(num) {
            if (num.length) {
                let len = num.length;
                let val1, val2, val3;
                if (num == "") {
                    return "";
                }
                val1 = num.substr(0, 3);
                val2 = val1 + " " + num.substr(3, 4);
                val3 = val2 + " " + num.substr(7, 4);
                return val3;
            }
        },
        deleteInput() {
            let vm = this;
            if (vm.code.length <= 0) {
                return;
            }
            vm.code.pop();

            let sequence = "input" + (vm.code.length - 1);
            vm.$refs[sequence][0].focus();
        },
        inputFunc(a, index) {
            let vm = this;
            if (a.data) {
                if (index + 1 >= 4) {
                    return;
                }
                console.log(vm.$refs.input);
                vm.$refs.input[index].blur();
                setTimeout(() => {
                    vm.$refs.input[index + 1].focus();
                }, 0);
            }
        },
        checkNumber(theObj) {
            var reg = /^[0-9]+.?[0-9]*$/;
            if (reg.test(theObj)) {
                return true;
            }
            return false;
        },

        updata() {
            let vm = this;
            vm.Send = false;
            let Info = {
                phone: vm.userInfo.phone,
                vcode: vm.code.join(""),
                channel:'3'
            };
            vm.loadingOpen();
            vm.login(Info).then(res => {
                vm.loadingClose();
                let data = res.data;
                vm.setUserInfo({
                    phone: Info.phone,
                    accessToken: data.data
                });
                // alert(JSON.stringify(res));
                // vm.$router.go(-2);
                vm.$router.push({
                    path: `/${vm.$route.query.routerId}`,
                    query: {
                        routerId: vm.$route.query.routerId,
                        auth_code: vm.$route.query.auth_code,
                        type: vm.$route.query.type,
                    },
                    replace: true
                });
            });
        },
        accept(data) {
            let vm = this;
            switch (data.type) {
                case 1:
                    vm.obtainD(data.str);
                    break;
                case 2:
                    vm.det(data.str);
                    break;
                default:
            }
        },
        obtainD(str) {
            if (this.code.length >= 4) {
                return;
            }
            this.code.push(str);
        },
        det() {
            this.code.pop();
        },
        open() {
            this.popupVisible = true;
        },
        login(userInfo) {
            let vm = this;
            return vm.Api.checkValidateCode(userInfo);
        }
    }
};
</script>

<style scoped lang="scss">
.page {
    padding: 0 40px;
    margin: 0 auto;
    font-size: 16px;
    padding-top: 45px;
    box-sizing: border-box;
    background: #fff;
    font-family: "微软雅黑";
}
.title {
    height: 68px;
    margin-bottom: 69px;
    p {
        font-size: 24px;
        font-weight: bold;
    }
    div {
        font-size: 15px;
        color: #9b9b9b;
        line-height: 32px;
    }
    span {
        color: #000;
        font-family: "微软雅黑";
    }
}

.input-area {
    overflow: hidden;
    .input-wrap {
        height: 60px;
        width: 60px;
        line-height: 60px;
        float: left;
        margin-right: 18px;
        font-size: 28px;
        text-align: center;
        font-weight: "微软雅黑";
        font-weight: bold;
        border-bottom: #cccccc 1px solid;
    }
    .finish {
        border-bottom: #575757 1px solid;
    }
}
.input-area > .input-wrap:nth-child(4) {
    margin-right: 0;
}
</style>
<style scoped>
.page >>> .mint-popup-bottom {
    width: 100%;
}
</style>

