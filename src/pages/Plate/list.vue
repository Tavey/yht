<template>
    <div class="page">
        <div v-if="showType == 0">

        </div>
        <div v-else>
            <div v-if="page.list.length>0" class="white">
                <div class="superscript-wrap">
                    <div class="lef">车牌号</div>
                    <div class="rig">默认车牌</div>
                </div>
                <ul class="list">

                    <li v-for="(item,index) in page.list" :key="index">
                        <mt-cell-swipe :right="[
                            {
                            content: '删除',
                            style: { background: 'red', color: '#fff' },
                            handler:() =>  deleteCar(index)
                            }
                        ]">
                            <div class="deltie bor-b1">{{item.showName}}</div>
                            <div :class="{selected:current==index}" @click="backUp(item,index)" class="tick "></div>
                        </mt-cell-swipe>
                    </li>

                </ul>
            </div>
            <div v-else class="noOne">
                <div class="noOneimg"></div>
                <div class="notit">暂无绑定车牌</div>
            </div>
            <div class="but" :class="{dont:page.list.length==3}" @click="gotoBind">添加新车牌</div>
        </div>

    </div>
</template>
<script>
import qs from "qs";
import { PUBLIC } from "@/consts";
import * as types from "@/store/types";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    name: "plate",
    components: {},
    data() {
        return {
            page: {
                list: [],
                pageNo: 1,
                pageRowNo: 20
            },
            showType: 0,
            type: null,
            current: 0,
            destroyed: false
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo,
            getPlate: single => single.plate
        })
    },
    destroyed: function() {
        if (this.$route.query.routerId == "pay") {
            this.destroyed = true;
        }
        try {
            if (!this.destroyed) {
                AlipayJSBridge.call("popWindow");
            } else {
                next();
            }
        } catch (error) {}
    },
    created() {
        let vm = this;
        // if (!vm.userInfo.token) {
        //     // vm.message("请先登录手机号！", function() {
        //         vm.$router.push({ path: "/phone" });
        //     // });
        //     return;
        // }
        this.type = this.$route.query.type;
    },

    mounted() {
        this.getList();
    },
    methods: {
        ...mapMutations({
            setPlateChoose: types.global.mutations.SET_PLATE_CHOOSE
        }),
        setDefault(item, def) {
            let vm = this;
            vm.loadingOpen();
            let info = {
                carNo: item.lpn
            };
            vm.Api.default(info).then(res => {
                vm.loadingClose();
                if (res.status == 200 ) {
                    vm.setPlateChoose(item);
                    if (!def) {
                        vm.toasts("设置成功");
                    }
                } else {
                    if (!def) {
                        vm.toasts("设置失败");
                    }
                }
            });
        },
        backUp(item, index) {
            this.current = index;
            this.setDefault(item);
        },
        gotoBind() {
            if (this.page.list.length == 3) {
                return;
            }
            this.destroyed = true;
            this.$router.push({ path: "plate/bind" });
        },
        getList() {
            let vm = this;
            vm.loadingOpen();
            vm.carPlate(vm.userInfo.phone).then(res => {
                vm.loadingClose();
                vm.showType = 1;
                // console.log(res);
                if (res.status == 200 && res.data.data!=null ) {
                    vm.page.list = res.data.data.map(a => ({
                        ...a,
                        showName:
                            a.lpn.substr(0, 2) +
                            "·" +
                            a.lpn.substr(2, a.lpn.length)
                    }));
                    if (
                        vm.page.list.length > 0 &&
                        vm.page.list[0].isDefault == 0
                    ) {
                        vm.setDefault(vm.page.list[0], 1);
                    } else {
                        vm.setPlateChoose(vm.page.list[0]);
                    }
                }else{
                    vm.page.list = [];
                }
            });
        },
        carPlate(info) {
            return this.Api.carList(info);
        },
        deleteCar(index) {
            let vm = this;
            vm.loadingOpen();
            
            let info = {
                carNo: vm.page.list[index].lpn,
            };
            vm.loadingOpen();
            vm.Api.unbindCar(info).then(res => {
                let data = res.data;
                vm.toasts("删除成功");

                if (vm.getPlate.lpn == vm.page.list[index].lpn) {
                    vm.setPlateChoose(null);
                }
                vm.getList();
               
            });
            // vm.Api.deleteCar(qs.stringify(info)).then(res => {
            //     vm.loadingClose();
            //     if (res.status == 200) {
            //         let data = res.data;
            //         console.log(data);
            //         if (data.code == 0) {
            //             vm.toasts("删除成功");

            //             if (vm.getPlate.lpn == vm.page.list[index].lpn) {
            //                 vm.setPlateChoose(null);
            //             }
            //             vm.getList();
            //         } else {
            //             vm.toasts(PUBLIC[data.code]);
            //         }
            //     } else {
            //     }
            // });
        },
        append(info) {
            let vm = this;
            return vm.Api.append(info);
        }
    }
};
</script>

<style scoped lang="scss">
.page {
    padding-top: 9px;
    box-sizing: border-box;
    font-family: "微软雅黑";
}
.white {
    height: 329px;
    background: #fff;
}
.dont {
    background: #cccccc;
}
.noOne {
    height: 329px;
    padding-top: 87px;
    box-sizing: border-box;
}
.noOneimg {
    width: 189px;
    height: 159px;
    margin: 0 auto;
}
.notit {
    text-align: center;
    margin-top: 16px;
    color: #cccccc;
    font-size: 16px;
}
.superscript-wrap {
    height: 48px;
    box-sizing: border-box;
    border-bottom: 1px solid #eeeeee;
    line-height: 48px;
    padding: 0 20px;
    .rig {
        float: right;
        font-size: 15px;
        font-family: Arial;
        color: #3a4557;
    }
    .lef {
        float: left;
        font-size: 16px;
        font-family: Arial;
        font-weight: 700;
        color: #3a4557;
    }
}
ul {
    li {
        position: relative;
        height: 48px;
        // width: calc(100% - 40px);
        line-height: 48px;
        font-size: 16px;
        // margin:  0  auto;
    }
    .padd {
        padding: 0 20px;
    }
    .deltie {
        left: 20px;
        position: absolute;
        color: #2f2f33;
        font-size: 16px;
        height: 100%;
        width: calc(100% - 40px);
        line-height: 48px;
        box-sizing: border-box;
    }
}
.tick {
    height: 24px;
    width: 24px;
    border-radius: 9999px;
    border: 2px #eeeeee solid;
    position: absolute;
    top: 15px;
    right: 20px;
    box-sizing: border-box;
    display: inline-block;
}
.selected {
    border: none;
    background: url("../../assets/img/dagou.png") no-repeat;
    background-size: 100%;
    overflow: hidden;
}
</style>
<style scoped>
.page >>> .mint-cell-title .mint-cell-text {
    margin-left: 0px;
}
.page >>> .mint-cell-text {
    font-family: Arial;
}
.page >>> .mint-cell-wrapper {
    padding: 0;
}
.page >>> .mint-cell-right {
    width: 80px;
    background: #ed3e35;
}
.page >>> .mint-cell-swipe-button {
    background: #ed3e35 !important;
    width: 80px;
    padding: 0;
    text-align: center;
}
.page >>> .mint-cell {
    background-image: none;
}
</style>


<style lang="stylus" scoped>
@import '../../assets/css/mixin.styl';

.noOneimg {
    bg-image('../../assets/img/Group 4'); // 使用bg-image($url)函数 $url为变量：brand
    // background: url("../../assets/img/bindPlate-bg.png") no-repeat;
    background-position: 100%;
    background-size: 100%;
}
</style>