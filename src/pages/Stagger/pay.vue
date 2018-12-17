<template>
    <div class="page">
        <div class="top-banner"></div>
        <div class="scroll-wrap">
            <div class="order-info">
                <div
                    class="plate-wrap bor-b1"
                    @click="choosePlate()"
                >
                    <span
                        v-if="showName"
                        class="plate"
                    >{{showName}}</span>
                    <i class="mint-cell-allow-right"></i>
                </div>
                <div class="address-wrap bor-b1">
                    <span>停车点</span>
                    <div class="place">{{details.parkingName}}</div>
                </div>
                <div
                    v-if="details.parkingPosition"
                    class="address-wrap bor-b1"
                >
                    <span>停放位置</span>
                    <div class="place">{{details.parkingPosition}}</div>
                </div>
                <div
                    v-if="details.staggeringTime"
                    class="address-wrap bor-b1"
                >
                    <span>错峰时段</span>
                    <div class="place">{{details.staggeringTime}}</div>
                </div>
                <div
                    v-if="details.staggeringWeek"
                    class="address-wrap bor-b1"
                >
                    <span>可停日</span>
                    <div class="place">
                        <span v-if="details.weekArr.length>=7">周一到周日全可停</span>
                        <span v-else>
                            <span
                                v-for="(item,index) in details.weekArr"
                                :key="index"
                            >{{week[item-1]}}</span>不可停
                        </span>

                    </div>
                </div>
                <div
                    class=" address-wrap bor-b1"
                    @click="openPicker(1)"
                >
                    <span>开始日期</span>
                    <div class="place stcolor">{{time.startTime.date}}
                        <i class="mint-cell-allow-right"></i>
                    </div>

                </div>
                <div class="address-wrap bor-b1">
                    <span>结束时间</span>
                    <div class="place">{{time.endTime.date}}
                    </div>
                </div>
            </div>
            <div class="xing">* <span>车位号：请听从停车场管理人员现场指挥</span></div>
            <div class="payment-info">
                <div class="wrap bor-b1">
                    <span class="mark">价格</span>
                    <span
                        v-if="type == 1"
                        class="annotation"
                    >
                        ￥{{details.price/100}}/{{details.activeDays}}天
                    </span>
                    <span
                        v-else
                        class="annotation"
                    >
                        ￥{{details.price/100}}/{{details.activeDays}}月
                    </span>
                </div>
                <div
                    v-if="!nopay"
                    class="wrap bor-b1"
                    @click="chooseCoupons()"
                >
                    <span class="mark">优惠券</span>
                    <span class="annotation red">
                        <span
                            class="n-amount"
                            v-if="!discount"
                        >暂无可用优惠券</span>
                        <span v-else>
                            <span
                                class="x-amount"
                                v-if="!canCoupons"
                            >选择优惠券</span>
                            <span
                                v-else
                                class="d-amount"
                            >- {{useCoupons.cashDiscount/100}}</span>
                            <i class="mint-cell-allow-right"></i>
                        </span>
                    </span>
                </div>
                <!-- <div
                    class="wrap bor-b1"
                    @click="chooseCoupons()"
                >
                    <span class="mark">优惠券</span>
                    <span class="annotation red">
                        <span class="d-amount"></span> <i class="mint-cell-allow-right"></i>
                    </span>
                </div> -->
                <div class="wrap">
                    <span></span>
                    <div class="actual">
                        小计
                        <span>￥{{details.price/100}}</span>
                    </div>
                </div>

            </div>
            <div class="xing">* <span>收费提示：超时则按照临停计费</span></div>
            <div class="ruler-wrap">
                <div class="rul-tit">{{tit[type]}}停车产品购买协议</div>
                <ul>
                    <li
                        class="rul-con"
                        v-for="(item,index) in ruler"
                        :key="index"
                    >
                        <div class="dian"></div>
                        {{item}}
                    </li>
                </ul>
            </div>
        </div>

        <div class="settlement">

            <div class="according">
                <span
                    v-if="!canCoupons"
                    class="s-jg"
                > ￥{{details.price/100}}</span>
                <span
                    v-else
                    class="s-jg"
                > ￥{{ (details.price - useCoupons.cashDiscount>0?details.price - useCoupons.cashDiscount:0)/100 }}</span>
                <span
                    v-if="canCoupons&&!nopay"
                    class="y-jg"
                > | 已优惠￥{{useCoupons.cashDiscount/100}}</span>
            </div>
            <div
                class="pay-but"
                :class="{nopay:nopay}"
                @click="toPay()"
            >支付</div>
        </div>
        <mt-datetime-picker
            ref="picker"
            type="date"
            :start-date="startDate"
            v-model="pickerValue"
            year-format="{value}年"
            month-format="{value}月"
            date-format="{value}日"
            @confirm="setTime"
        >
        </mt-datetime-picker>
    </div>
</template>

<script>
import * as types from "@/store/types";
import { mapState, mapActions, mapMutations } from "vuex";
import { WEEK, WEEKNUM, RULLIST } from "@/consts";
export default {
    name: "pay",
    components: {},
    data() {
        return {
            details: {},
            tit: {
                "1": "错峰",
                "2": "包月"
            },
            showName: null,
            type: 1,
            page: {
                list: [],
                pageNo1: 1,
                pageRowNo: 20
            },
            nopay: false,
            startDate: new Date(),
            pickerValue: "",
            time: {
                startTime: {
                    time: "",
                    date: ""
                },
                endTime: {
                    time: "",
                    date: ""
                }
            },
            week: WEEK,
            weekNum: WEEKNUM,
            ruler: RULLIST,
            discount: false,
            canCoupons: false
        };
    },
    created() {
        // this.format();
        let vm = this;
        this.type = this.$route.query.type;
        // this.getDetails();
        if (window.plateChoose) {
            vm.showName = window.plateChoose.showName;
        } else if (vm.plateChoose) {
            vm.showName = vm.plateChoose.showName;
        } else {
            vm.getList();
        }
    },
    watch: {
        showName(str) {
            if (str) {
                this.getDetails();
                if (this.useCoupons) {
                    this.discountDetail();
                }

            }
        },
    },

    computed: {
        ...mapState({
            plateChoose: single => single.plate,
            userInfo: state => state.userInfo
        })
    },
    mounted() {
        let vm = this;
        vm.useCoupons = window.couponsChoose;
        vm.nowTime();
    },
    methods: {
        //获取详情
        getDetails() {
            let vm = this;
            vm.choose(vm.$route.query.productId).then(res => {
                console.log(res);
                if (res.data.data) {
                    vm.details = res.data.data;
                    if (vm.details.staggeringWeek) {
                        vm.details.weekArr = vm.details.staggeringWeek.split(',');
                        vm.details.weekArr.pop();
                        let newArr = [];
                        for (let i in vm.weekNum) {
                            if (vm.details.weekArr.indexOf(vm.weekNum[i]) < 0) {
                                newArr.push(vm.weekNum[i]);
                            }
                        }
                        vm.details.weekArr = newArr;
                    }

                    if (
                        vm.DateDiff(vm.details.endTime, vm.time.endTime.date) <
                        0
                    ) {
                        vm.nopay = true;
                        vm.toasts(`产品截止日期${vm.details.endTime}`);
                    } else {
                        vm.getDiscount();
                    }
                }
            });
        },
        getList() {
            let vm = this;
            vm.loadingOpen();
            vm.carPlate(vm.userInfo.phone).then(res => {
                vm.loadingClose();
                if (res.status == 200) {
                    if (!res.data.data) {
                        vm.destroyed = true;
                        vm.$router.push({
                            path: "/plate",
                            query: {
                                routerId: vm.$route.query.routerId
                            }
                        });
                        return;
                    }
                    vm.page.list = res.data.data.map(a => ({
                        ...a,
                        showName:
                            a.lpn.substr(0, 2) +
                            "·" +
                            a.lpn.substr(2, a.lpn.length)
                    }));
                    vm.showName = vm.page.list[0].showName;
                    // if (vm.page.list.length > 0) {

                    // }
                }
            });
        },
        carPlate(Info) {
            return this.Api.carList(Info);
        },
        //切换
        choose(id) {
            let vm = this;
            if (vm.$route.query.type == 1) {
                return vm.getStaProDetail(id);
            } else {
                return vm.getProductDetail(id);
            }
        },
        //错峰详情
        getStaProDetail(id) {
            return this.Api.getStaProDetail(id);
        },
        //包月详情
        getProductDetail(id) {
            return this.Api.getProductDetail(id);
        },
        openPicker() {
            this.$refs.picker.open();
        },
        setTime() {
            let vm = this;
            let timestamp = new Date(vm.pickerValue).getTime();
            if (!timestamp) {
                return;
            }
            let stTime = vm.format(timestamp);
            vm.time.startTime.time = vm.format(timestamp).split(" ")[1];
            vm.time.startTime.date = vm.format(timestamp).split(" ")[0];
            if (vm.type == 1) {
                var endTime = vm.addDate(stTime, vm.details.activeDays);
            } else {
                var endTime = vm.addDate(stTime, 30);
            }

            vm.time.endTime.time = vm.format(timestamp).split(" ")[1];
            vm.time.endTime.date = endTime;
            if (vm.DateDiff(vm.details.endTime, endTime) < 0) {
                vm.nopay = true;
                vm.toasts(`产品截止日期${vm.details.endTime}`);
            } else {
                vm.nopay = false;
            }
        },
        nowTime() {
            let vm = this;
            let a = vm.format(vm.startDate);
            vm.time = {
                startTime: {
                    date: a.split(" ")[0],
                    time: a.split(" ")[1]
                },
                endTime: {
                    date:
                        vm.type == 1
                            ? vm.addDate(a, vm.details.activeDays)
                            : vm.addDate(a, 30),
                    time: a.split(" ")[1]
                }
            };
        },
        duan(str) {
            if (str.split(":")[0] > 12) {
                return "PM";
            } else {
                return "AM  ";
            }
        },
        format(a) {
            let add0 = this.add0;
            //shijianchuo是整数，否则要parseInt转换
            var time = new Date(a);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            return (
                y +
                "-" +
                add0(m) +
                "-" +
                add0(d) +
                " " +
                add0(h) +
                ":" +
                add0(mm)
            );
        },
        add0(m) {
            return m < 10 ? "0" + m : m;
        },
        // 日期，在原有日期基础上，增加days天数，默认增加1天
        addDate(date, days) {
            let vm = this;
            if (days == undefined || days == "") {
                days = 1;
            }
            var date = new Date(date);
            date.setDate(date.getDate() + days);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return (
                date.getFullYear() +
                "-" +
                vm.getFormatDate(month) +
                "-" +
                vm.getFormatDate(day)
            );
        },
        // 日期月份/天的显示，如果是1位数，则在前面加上'0'
        getFormatDate(arg) {
            if (arg == undefined || arg == "") {
                return "";
            }

            var re = arg + "";
            if (re.length < 2) {
                re = "0" + re;
            }

            return re;
        },
        choosePlate() {
            this.$router.push({ path: "plate" });
        },
        chooseCoupons() {
            this.$router.push({
                path: "/pay/coupons",
                query: {
                    phone: this.userInfo.phone,
                    category: 1,
                    park: this.details.parkingCode,
                    productType: this.$route.query.type,
                }
            });
        },
        discountDetail() {
            let vm = this;
            let info = {
                disUserReleaseRecId: window.couponsChoose.id,
                plateId: vm.plateChoose ? vm.plateChoose.lpn : vm.showName.replace('·', ''),
            }
            vm.Api.getDiscountCash(info).then(res => {
                console.log(res)
                if (res.data.code = 1000) {
                    if (vm.useCoupons.cashDiscount == 0) {
                        vm.useCoupons.cashDiscount = res.data.data.cashDiscount;
                    }
                    // alert(vm.useCoupons.cashDiscount)
                    vm.canCoupons = true;
                }

            })
        },
        getDiscount() {
            let vm = this;
            let info = {
                category: 1, //优惠券种类
                productType: vm.$route.query.type, //优惠券使用的产品类型
                parkCode: vm.details.parkingCode,
                phone: vm.userInfo.phone
            }
            vm.loadingOpen();
            vm.Api.getUserUsabledDiscounts(info).then(res => {
                console.log(res)
                if (res.data.data && res.data.data.datas.length > 0) {
                    vm.discount = true;
                }
            })
        },
        toPay() {
            let vm = this;
            let info;
            if (vm.nopay) {
                return;
            }
            // 2088202600545505 ||
            info = {
                buyer:  window.buyerId,
                orderId: vm.details.productId,
                code: vm.$route.query.auth_code || window.auth_code,
                type: 3,
                orderType: vm.type == 1 ? 3 : 2,
                startTime: vm.time.startTime.date,
                endTime: vm.time.endTime.date,
                lpn: vm.showName.replace("·", ""),
                couponId: vm.useCoupons ? vm.useCoupons.id : ''
            };
            // vm.$router.push({
            //                 path: "finish",
            //                 query: {
            //                     name: vm.details.parkingName,
            //                     palte: vm.showName,
            //                     startTime: info.startTime,
            //                     endTime: info.endTime,
            //                     type: vm.$route.query.type,
            //                     staggeringTime:vm.details.staggeringTime
            //                 }
            //             });
            //             return
            vm.loadingOpen();
            vm.aliPay(info).then(res => {
                if (res.data.code == 1000) {
                    let data = res.data.data.paymentInf;
                    if (!window.buyerId) {
                        window.buyerId = data.buyer;
                    }
                    if (res.data.data.couponBuy) {
                        vm.destroyed = true;
                        window.couponsChoose = null;
                        // vm.setCouponsChoose(null);
                        vm.useCoupons = {};
                        vm.$router.push({
                            path: "finish",
                            query: {
                                name: vm.details.parkingName,
                                palte: vm.showName,
                                startTime: info.startTime,
                                endTime: info.endTime,
                                type: vm.$route.query.type,
                                staggeringTime:vm.details.staggeringTime
                            }
                        });
                        return
                    }
                    try {
                        AlipayJSBridge.call(
                            "tradePay",
                            {
                                tradeNO: data.tradeNo // 必传，此使用方式下该字段必传
                            },
                            function (result) {
                                switch (result.resultCode) {
                                    case "9000":
                                        vm.destroyed == true;
                                        // alert(
                                        //     'name='
                                        //     vm.details.parkingName+
                                        //         "palte:="vm.showName+
                                        //         "startTime:="info.startTime,
                                        //         "endTime=" info.endTime,
                                        //        " type="vm.$route.query.type
                                        // )
                                        vm.$router.push({
                                            path: "finish",
                                            query: {
                                                name: vm.details.parkingName,
                                                palte: vm.showName,
                                                startTime: info.startTime,
                                                endTime: info.endTime,
                                                type: vm.$route.query.type
                                            }
                                        });
                                        break;
                                    default:
                                        // vm.toasts(
                                        //     RESULTCode[result.resultCode]
                                        // );
                                        let payInfo = {
                                            id: vm.orderPay.id
                                        };
                                        vm.loadingOpen();
                                        vm.getorderPay(payInfo).then(res => {
                                            vm.loadingClose();
                                            console.log(res);
                                            if (res.data.data.status != 1) {
                                                vm.confirm("", "", function () {
                                                    window.location.href =
                                                        "tel://4001115559";
                                                });
                                            }
                                            //  alert('12'+JSON.stringify(res.data));
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
            return this.Api.aliPay(info);
        },
        DateDiff(sDate1, sDate2) {
            //sDate1和sDate2是2002-12-18格式
            let aDate, oDate1, oDate2, iDays;
            aDate = sDate1.split("-");
            oDate1 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]); //转换为12-18-2002格式
            aDate = sDate2.split("-");
            oDate2 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]);
            iDays = (oDate1 - oDate2) / 1000 / 60 / 60 / 24; //把相差的毫秒数转换为天数
            return iDays;
        },
        //求自然月日期
        getMonthBeforeFormatAndDay(date) {
            let mo = date.split("-")[1];
            let day = date.split("-")[2];
            //小月
            if (mo == 4 || mo == 6 || mo == 9 || mo == 11) {
                if (day > 30) {
                    day = 30;
                }
            }
            //2月
            else if (mo == 2) {
                if (this.isLeapYear(date.split("-")[0])) {
                    if (day > 29) {
                        day = 29;
                    } else {
                        day = 28;
                    }
                } else {
                    day = 28;
                }
            }
            //大月
            else {
                if (day > 31) {
                    day = 31;
                }
            }
            return date.split("-")[0] + "-" + mo + "-" + day;
        },
        //判断闰年代码
        isLeapYear(Year) {
            if ((Year % 4 == 0 && Year % 100 != 0) || Year % 400 == 0) {
                return true;
            } else {
                return false;
            }
        }
    }
};
</script>

<style scoped lang="scss">
.page {
    overflow: hidden;
}
.top-banner {
    height: 66px;
    background: url("../../assets/img/bindPlate.png") no-repeat;
    background-size: 100%;
    background-position: 0px -196px;
}
.xing {
    height: 37px;
    box-sizing: border-box;
    color: #ed3e35;
    padding: 8px 20px 0 20px;
    line-height: 12px;
    span {
        color: #bec2cc;
        font-size: 12px;
    }
}
.scroll-wrap {
    height: calc(100% - 113px);
    overflow-y: scroll;
}
.order-info {
    padding: 0 20px 0px 20px;
    background: #fff;
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
            display: inline-block;
            color: #9dadbd;
            font-size: 15px;
            text-align: right;
            width: 250px;
            float: right;
        }
    }
    .text {
        color: #79808a;
        font-size: 16px;
        line-height: 48px;
    }
    .time-wrap {
        color: #2f2f33;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        .left {
        }
        .right {
            text-align: right;
        }
        .time {
            font-size: 24px;
            margin: 6px 0;
            line-height: 29px;
        }
        .date {
            line-height: 20px;
        }
        .tag {
            color: #bec2cc;
            line-height: 20px;
        }
    }
}
.address-wrap {
    position: relative;
    .stcolor {
        margin-right: 19px;
        color: #3a4557 !important;
    }
    .mint-cell-allow-right::after {
        right: 2px;
        top: 24px;
        height: 7px;
        width: 7px;
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
    .pay-but {
        background: #ed3e35;
        width: 140px;
        height: 100%;
        color: #fff;
        font-size: 18px;
        position: absolute;
        right: 0;
        top: 0;
        text-align: center;
    }
    .nopay {
        background: #ccc;
    }
    .according {
        position: relative;
        div {
            float: left;
        }
    }
    .s-jg {
        font-size: 24px;
        color: #ef5655;
    }
    .g-jg {
        font-size: 14px;
        color: #bec2cc;
        padding: 0 5px;
        line-height: 54px;
    }
    .y-jg {
        font-size: 14px;
        color: #bec2cc;
        line-height: 55px;
    }
}
.ruler-wrap {
    color: #bec2cc;
    position: relative;
    font-size: 12px;
    padding: 0 20px 30px 32px;
    margin-top: 40px;
    .rul-tit {
        font-size: 14px;
        text-align: center;
        margin-bottom: 16px;
    }
    .rul-con {
        line-height: 23px;
        position: relative;
        // list-style-position:outside !important;
        // list-style-position:initial;
    }
    .dian {
        height: 5px;
        width: 5px;
        position: absolute;
        top: 8px;
        left: -10px;
        border-radius: 50%;
        background: #bec2cc;
    }
}
.rul-tit::before {
    content: " ";
    border-bottom: 1.5px solid #bec2cc;
    position: absolute;
    width: 70px;
    left: 20px;
    top: 9px;
    opacity: 0.7;
}
.rul-tit::after {
    content: " ";
    border-bottom: 1.5px solid #bec2cc;
    position: absolute;
    width: 70px;
    right: 20px;
    top: 9px;
    opacity: 0.7;
}
</style>
