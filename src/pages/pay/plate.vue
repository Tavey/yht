<template>
    <div class="page">
        <div class="plate-wraper">
            <div class="tiele">输入车牌</div>
            <div class="annotation">新能源车辆请输入7位数字或字母</div>
            <div class="float">
                <div class="regional blue">
                    <div class="img-border blue" :class="{green:plate.distinguish.length>=7}" @click="openKeyboard(1)">
                        {{plate.regional}}
                    </div>
                </div>
                <div class="point">·</div>
                <ul>
                    <li @click="openKeyboard(2)" v-for="(li,index) in plate.listNum" :key="index">
                        {{plate.distinguish[index]}}
                    </li>
                </ul>
                <div @click="openKeyboard(2)" v-if="plate.distinguish[6]" class="green-wrap energy">
                    {{plate.distinguish[6]}}
                </div>
                <div @click="openKeyboard(2)" v-else class="green-wrap">
                    <div>新能源</div>
                </div>
            </div>
        </div>
        <!-- <div class="curtain"></div> -->
        <div class="complete but" @click="upData()">完成</div>
        <mt-popup ref="picker" v-model="popupVisible" position="bottom">
            <rkey v-if="showKeyboard" @setInfo="accept" />
            <ckey v-else @setInfo="accept" />
            <!-- <keyboard :show="showKeyboard" @setInfo="accept" /> -->
        </mt-popup>
    </div>
</template>

<script>
import qs from "qs";
import { PUBLIC } from "@/consts";
import rkey from "../../components/regionalKeyboard";
import ckey from "../../components/charactersKeyboard";
import * as types from "@/store/types";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
    name: "bindPlate",
    components: {
        rkey,
        ckey
    },
    data() {
        return {
            showKeyboard: true,
            plate: {
                listNum: 6,
                regional: "沪",
                distinguish: ""
            },
            popupVisible: true
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo
        })
    },
    mounted() {},
    methods: {
        openKeyboard(n) {
            if (n == 1) {
                this.showKeyboard = true;
            } else {
                this.showKeyboard = false;
            }
            this.popupVisible = true;
        },
        accept(data) {
            let vm = this;
            switch (data.type) {
                case 1:
                    vm.obtainD(data.str);
                    break;
                case 2:
                    vm.obtainS(data.str);
                    break;
                case 3:
                    vm.fallBack();
                    break;
                case 4:
                    vm.$refs.picker.close();
                    break;
                default:
            }
        },
        obtainD(str) {
            let vm = this;
            vm.$refs.picker.close();
            vm.plate.regional = str;
            setTimeout(() => {
                vm.showKeyboard = false;
                vm.$refs.picker.open();
            }, 0);
        },
        fallBack() {
            if (this.plate.distinguish == "" || !this.plate.distinguish) {
                return;
            }
            let arr = this.plate.distinguish;
            this.plate.distinguish = arr.slice(0, arr.length - 1);
        },
        obtainS(str) {
            // console.log(str)
            let vm = this;
            if (vm.plate.distinguish.length >= 7) {
                return;
            }
            vm.plate.distinguish += str;
        },
        upData() {
            let vm = this;

            if (!vm.plateNum(vm.plate.regional + vm.plate.distinguish)) {
                return;
            }
            let info = vm.plate.regional + vm.plate.distinguish;
            // {
            //     datas: [
            //         {
            //             plateId: vm.plate.regional + vm.plate.distinguish,
            //             isBind: 1,
            //             vehicleType: vm.plate.distinguish.length > 6 ? "1" : "0"
            //         }
            //     ],
               
            // };

             vm.$router.push({
                path: "quick",
                query: {
                    regional:vm.plate.regional,
                    distinguish:vm.plate.distinguish,
                    auth_code: vm.$route.query.auth_code,
                    buyer:vm.$route.query.buyer
                }
            });
            
        },
        plateNum(str) {
            let reg = /^([\u4e00-\u9fa5][a-zA-Z](([DF](?![a-zA-Z0-9]*[IO])[0-9]{4,5})|([0-9]{5}[DF])))|([冀豫云辽黑湘皖鲁苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼渝京津沪新京军空海北沈兰济南广成使领A-Z]{1}[a-zA-Z0-9]{5,6}[a-zA-Z0-9挂学警港澳]{1})$/;
            if (!reg.test(str)) {
                this.toasts("请输正确的车牌号");
                return false;
            } else {
                return true;
            }
        }
    }
};
</script>

<style scoped lang="scss">
.page {
    width: 100%;
    font-family: "微软雅黑";
}
.plate-wraper {
    font-family: Arial;
    width: 100%;
    height: 262px;
    box-sizing: border-box;
    padding: 24px 20px 0 20px;
    color: #fff;
    .tiele {
        font-size: 24px;
        line-height: 33px;
        font-weight: bold;
    }
    .annotation {
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 40px;
        opacity: 0.6;
    }
}
.complete {
    margin: 72px auto 0 auto;
}
.float {
    overflow: hidden;
    width: 100%;
    div {
        float: left;
    }
    .regional {
        height: 50px;
        width: 37px;
        border-radius: 4px;
        text-align: center;
        line-height: 50px;
        font-size: 24px;
        overflow: hidden;
    }
    .img-border {
        height: 99%;
        width: 99%;
        border-radius: 4px;
        box-sizing: border-box;
        border-color: #a5a3a3;
    }
    .blue {
        background: url("../../assets/img/plate-blue.png") no-repeat;
        color: #0da5ea;
        background-size: 100% 101%;
    }
    .green {
        background: url("../../assets/img/plate-green.png") no-repeat;
        color: #12cf85;
        background-size: 100% 101%;
    }
    .point {
        width: 31px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 40px;
        font-family: "Microsoft YaHei";
    }
    .green-wrap {
        color: #12cf85;
        border: 2px dashed #12cf85;
        height: 50px;
        width: 37px;
        box-sizing: border-box;
        border-radius: 4px;
        text-align: center;
        line-height: 50px;
        font-size: 24px;
        font-size: 11px;
        position: relative;
        overflow: hidden;
        div {
            height: 100%;
            width: 60px;
            transform: scale(0.8);
            position: absolute;
            left: -14px;
        }
    }
    .energy {
        color: #fff;
        font-size: 24px;
        border: 2px solid #12cf85;
    }
}
ul {
    float: left;
    width: 220px;
    height: 50px;
    box-sizing: border-box;
    border: 2px solid #fff;
    border-radius: 4px;
    // display: flex;
    // justify-content: space-between;
    margin-right: 9px;
    li {
        float: left;
        height: 100%;
        flex-grow: 1;
        border-right: 2px #fff solid;
        text-align: center;
        line-height: 50px;
        color: #fff;
        font-size: 24px;
        width: 36px;
        box-sizing: border-box;
    }
}
ul > li:nth-child(6) {
    border: 0px;
}
</style>
<style  scoped>
.page >>> .v-modal {
    opacity: 0 !important;
    /* display: none !important; */
}
.mint-popup {
    width: 100%;
}
</style>

<style lang="stylus" scoped>
@import '../../assets/css/mixin.styl';

.plate-wraper {
    bg-image('../../assets/img/bindPlate'); // 使用bg-image($url)函数 $url为变量：brand
    // background: url("../../assets/img/bindPlate-bg.png") no-repeat;
    background-position: 100%;
    background-size: 100%;
}
</style>
