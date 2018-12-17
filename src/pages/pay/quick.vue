<template>
    <div class="page">
        <div v-if="showType == 0">

        </div>
        <div
            v-else
            class="bord"
        >
            <div v-if="orderInfo">
                <div class="top-banner"></div>
                <div class="order-info">
                    <div class="plate-wrap bor-b1">
                        <span
                            v-if="showName||orderInfo.plateId"
                            class="plate"
                        >{{showName||orderInfo.showName}}</span>
                    </div>
                    <div class="address-wrap bor-b1">
                        <span>停车点</span>
                        <div class="place">{{orderInfo.parkName}}</div>
                    </div>
                    <div
                        v-if="orderInfo.inTime != orderInfo.lastPayTime"
                        class="address-wrap bor-b1"
                    >
                        <span>上次结算时间</span>
                        <div class="place">{{orderInfo.lastPayTime}}</div>
                    </div>
                    <div class="address-wrap bor-b1">
                        <span>入场时间</span>
                        <div class="place">{{orderInfo.inTime}}</div>
                    </div>
                    <div class="address-wrap">
                        <span>停车时长</span>
                        <div
                            v-if="orderInfo.payTime"
                            class="place"
                        >{{DateDiff(orderInfo.payTime,orderInfo.lastPayTime)}}</div>
                    </div>
                </div>
                <div class="payment-info">
                    <div class="wrap bor-b1">
                        <span class="mark">总计费用</span>
                        <span class="annotation">
                            ￥{{orderInfo.charge/100}}
                        </span>
                    </div>
                    <div class="wrap">
                        <span></span>
                        <div class="actual">
                            小计
                            <span>￥{{orderInfo.charge/100}}</span>
                        </div>
                    </div>
                </div>
                <div
                    class="settlement"
                    :class="{iosx:iosX}"
                >
                    <div class="according">
                        <span class="s-jg"> ￥{{orderInfo.charge/100}}</span>
                    </div>
                    <div
                        class="pay-but"
                        :class="{nopay:nopay}"
                        @click="toPay()"
                    >支付</div>
                </div>
            </div>
            <div
                class="warpa"
                v-if="showind==1"
            >
                <div class="noOne">
                    <div class="notrip"></div>
                    <div
                        v-if="showName"
                        class="notit"
                    >当前车牌 {{showName}}
                        <br />暂无缴费订单
                    </div>
                </div>
                <!-- <div class="but">选择其他车牌</div> -->
            </div>
        </div>

    </div>
</template>

<script>
import qs from "qs";
import { RESULTCode } from "@/consts";
import * as types from "@/store/types";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    name: "pay",
    components: {},
    data() {
        return {
            iosX: window.isIOS,
            showName: null,
            orderInfo: null,
            showType: 0,
            showind: 0,
            nopay: false,
            parkId: null,
        };
    },
    created() {
        let vm = this;
        window.auth_code = vm.$route.query.auth_code;
        if (vm.$route.query.parkId) {
            let a = {
                parkId: vm.$route.query.parkId,
                channelId: vm.$route.query.channelId
            }
            vm.getOrderInfo(a);
        } else {
            vm.showName = vm.$route.query.regional + (vm.$route.query.distinguish.substring(0, 1) + "·" + vm.$route.query.distinguish.substring(1, vm.$route.query.distinguish.length));
        }

    },
    computed: {
    },
    mounted() {
    },
    watch: {
        showName(str) {
            if (str) {
                this.getOrderInfo();
            }
        },
    },
    methods: {
        toPay() {
            let vm = this;
            let info;
            if (vm.nopay) {
                return;
            }
            // 2088202600545505 ||
            info = {
                buyer: vm.$route.query.buyer || window.buyerId,
                orderId: vm.orderInfo.orderId,
                code: vm.$route.query.auth_code || window.auth_code,
                type: 3,
                orderType: 1,
                endTime: vm.orderInfo.payTime,
                couponId: vm.useCoupons ? vm.useCoupons.id : ''
            };
            vm.loadingOpen();
            vm.aliPay(info).then(res => {
                if (res.data.code == 1000) {
                    let data = res.data.data.paymentInf;
                    if (!window.buyerId) {
                        window.buyerId = data.buyer;
                    }



                    // let info = {
                    //     id: 'ID181212120022001077',
                    //     payTime: '2018-12-12 12:00:20'
                    // }
                    //  alert(qs.stringify(info))
                    // vm.loadingOpen();
                    // vm.Api.callNotify(qs.stringify(info)).then(res => {
                    //     if (res.data.code == 1000) {
                    //         vm.$router.push({
                    //             path: "success",
                    //             query: {
                    //                 name: vm.orderInfo.parkName,
                    //                 palte: vm.showName,
                    //                 time: vm.orderInfo.payTime,
                    //                 freeMinute:
                    //                     vm.orderInfo.freeTime
                    //             }
                    //         });
                    //     } else {
                    //         vm.toasts(res.data.msg);
                    //     }
                    // })
                    // return



                    try {
                        AlipayJSBridge.call(
                            "tradePay",
                            {
                                tradeNO: data.tradeNo // 必传，此使用方式下该字段必传
                            },
                            function (result) {
                                switch (result.resultCode) {
                                    case "9000":
                                        let info = {
                                            id: data.id,
                                            payTime: data.payTime
                                        }
                                        // vm.loadingOpen();
                                        // vm.Api.callNotify(qs.stringify(info)).then(res => {
                                        vm.$router.push({
                                            path: "success",
                                            query: {
                                                name: vm.orderInfo.parkName,
                                                palte: vm.showName,
                                                time: vm.orderInfo.payTime,
                                                freeMinute:
                                                    vm.orderInfo.freeTime
                                            }
                                        });
                                        // })

                                        break;
                                    default:
                                        // vm.toasts(
                                        //     RESULTCode[result.resultCode]
                                        // );
                                        // let infos = {
                                        //     id: data.id,
                                        //     payTime: data.payTime
                                        // }
                                        // vm.loadingOpen();
                                        // vm.Api.callNotify(qs.stringify(infos)).then(res => {
                                        //     vm.loadingClose();
                                        //     if (res.data.code != 1000) {
                                        //         vm.confirm("", "", function () {
                                        //             window.location.href =
                                        //                 "tel://4001115559";
                                        //         });
                                        //     }
                                        //     //  alert('12'+JSON.stringify(res.data));
                                        // });
                                        vm.confirm("", "", function () {
                                            window.location.href =
                                                "tel://4001115559";
                                        });
                                        break;
                                }
                            }
                        );
                    } catch (error) { }
                } else {
                    vm.message(res.data.msg);
                }
            });
        },
        aliPay(info) {
            return this.Api.aliPayNOuse(
                qs.stringify(info)
            );
        },
        getOrderInfo(obj) {
            let vm = this;

            vm.loadingOpen();
            if (obj) {
                vm.Api.getOrderByChannel(qs.stringify(obj)).then(res => {
                    if (res.data.code == 1000) {
                        vm.showind = 0;
                        vm.showType = 1;
                        let data = res.data.data;
                        vm.orderInfo = data;
                        vm.orderInfo.showName = vm.orderInfo.plateId.substring(0, 2) + '·' + vm.orderInfo.plateId.substring(2, vm.orderInfo.plateId.length)
                        console.log(vm.orderInfo.showName)
                        if (vm.orderInfo.charge == 0) {
                            vm.nopay = true;
                        }
                    } else {
                        vm.showind = 1;
                        vm.showType = 1;
                    }
                })
                return
            }


            let info = {
                plateId: vm.showName.replace("·", "")
            }
            vm.getOrderCost(info).then(res => {
                if (res.data.code == 1000) {
                    vm.showind = 0;
                    vm.showType = 1;
                    let data = res.data.data;
                    vm.orderInfo = data;
                    if (data.networkStatus != 1 && data.isNetPay != 1) {
                        vm.nopay = true;
                        vm.message("停车场未开通支付宝电子支付", function () { });
                    }
                    if (vm.orderInfo.charge <= 0) {
                        vm.nopay = true;
                    }
                } else {
                    vm.showind = 1;
                    vm.showType = 1;
                }
            });
        },
        getOrderCost(info) {
            return this.Api.getOrderByLpn(qs.stringify(info));
        },
        //小时
        toHourMinute(minutes) {
            let hour =
                Math.floor(minutes / 60) < 10
                    ? "0" + Math.floor(minutes / 60)
                    : Math.floor(minutes / 60);
            let min = minutes % 60 < 10 ? "0" + (minutes % 60) : minutes % 60;
            return hour + ":" + min;
        },
        DateDiff(s1, s2) {
            s1 = new Date(s1.replace(/-/g, "/"));
            s2 = new Date(s2.replace(/-/g, "/"));
            var ms = Math.abs(s1.getTime() - s2.getTime());
            return this.toHourMinute(Math.floor(ms / 1000 / 60));
        },
    }
};
</script>

<style scoped lang="scss">
.page {
    font-family: "微软雅黑";
}
.bord {
    font-weight: bold;
    border-bottom: 1px solid #ececec;
    height: 100%;
}
.top-banner {
    height: 66px;
    background: url("../../assets/img/bindPlate.png") no-repeat;
    background-size: 100%;
    background-position: 0px -196px;
}
.order-info {
    font-family: Arial;
    padding: 0 20px 0 20px;
    background: #fff;
    margin-bottom: 7px;
    .mint-cell {
        height: 68px;
    }
    .plate-wrap {
        position: relative;
        height: 68px;
        line-height: 68px;
    }
    .plate {
        color: #2f2f33;
        font-size: 22px;
        font-weight: 700;
    }
    .mint-cell-allow-right::after {
        right: 0px;
        height: 7px;
        width: 7px;
    }
    .address-wrap {
        height: 48px;
        line-height: 48px;
        font-size: 16px;
        color: #79808a;
        .place {
            float: right;
            display: block;
            color: #9dadbd;
            font-size: 15px;
            text-align: right;
            // width: 260px;
        }
    }
}
.payment-info {
    padding: 0 20px 0 20px;
    background: #fff;
    .wrap {
        height: 48px;
        line-height: 48px;
        display: flex;
        justify-content: space-between;
    }
    .mark {
        color: #79808a;
        font-size: 16px;
    }
    .annotation {
        text-align: right;
        position: relative;
        font-size: 15px;
        color: #2f2f33;
    }
    .red {
        color: #ed3e35;
    }
    .n-amount {
        color: #bec2cc;
    }
    .x-amount {
        color: #bec2cc;
        padding-right: 20px;
    }
    .d-amount {
        padding-right: 15px;
    }
    .mint-cell-allow-right::after {
        right: 0px;
        height: 7px;
        width: 7px;
    }
    .actual {
        font-size: 16px;
        span {
            font-size: 22px;
        }
    }
}
.settlement {
    height: 50px;
    width: 100%;
    line-height: 50px;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
    padding-left: 20px;
    box-sizing: border-box;
    .pay-but {
        height: 100%;
        background: #ed3e35;
        width: 140px;
        color: #fff;
        font-size: 18px;
        position: absolute;
        right: 0px;
        bottom: 0;
        text-align: center;
    }
    .nopay {
        background: #ccc;
    }
    .according {
        // div{
        //     display: inline-block
        // }
    }
    .s-jg {
        font-size: 24px;
        color: #ef5655;
    }
    .y-jg {
        font-size: 14px;
        color: #bec2cc;
    }
}
.nopate {
    text-align: center;
}
.iosx {
    padding-bottom: 34px;
}
.noOne {
    height: 338px;
    padding-top: 87px;
    box-sizing: border-box;
}
.notrip {
    width: 189px;
    height: 159px;
    margin: 0 auto;
}
.notit {
    text-align: center;
    margin-top: 16px;
    color: #cccccc;
    font-size: 16px;
    line-height: 26px;
}

.warpa {
}
</style>


<style lang="stylus" scoped>
@import '../../assets/css/mixin.styl';

.notrip {
    bg-image('../../assets/img/trip'); // 使用bg-image($url)函数 $url为变量：brand
    // background: url("../../assets/img/bindPlate-bg.png") no-repeat;
    background-position: 100%;
    background-size: 100%;
}
</style>