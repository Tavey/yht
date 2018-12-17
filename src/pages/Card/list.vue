<template>
    <div class="page">
        <ul
            v-if="!nolsit"
            class="list"
        >
            <li v-for="item in cardList">
                <div
                    v-if="!item.overdue && !item.effect"
                    class="card-wrap ellipse"
                >
                    <div class="img">
                        <div
                            v-if="item.staggerTime"
                            class="mban"
                        ></div>
                        <div
                            v-if="item.staggerTime"
                            class="Asof"
                        >{{item.staggerTime}}</div>
                        <div class="plate">
                            {{item.plate}}
                        </div>
                    </div>
                    <div class="info">
                        <div class="name">
                            {{item.parkingName}}-
                            <span v-if="!item.staggerTime">包月畅停卡</span>
                            <span v-else>错峰停车券</span>
                        </div>
                        <div class="time">
                            剩余{{item.remaining}}天
                            <span
                                v-if="item.staggerDate"
                                class="huis"
                            >
                                <span>&nbsp;&nbsp;|&nbsp;&nbsp;
                                    <span
                                        v-for="(item,index) in item.noweek"
                                        :key="index"
                                    >{{week[item-1]}}</span>
                                </span>不可停
                            </span>

                        </div>
                    </div>
                    <!-- <div class="btn ellipse">续费</div> -->
                </div>
            </li>
            <li v-for="item in cardList">
                <div
                    v-if="item.overdue"
                    class="card-wrap ellipse"
                >
                    <div class="overdue">
                        <div
                            v-if="item.staggerTime"
                            class="mban"
                        ></div>
                        <div
                            v-if="item.staggerTime"
                            class="Asof"
                        >{{item.staggerTime}}</div>
                    </div>
                     <div class="plate">
                            {{item.plate}}
                        </div>
                    <div class="info">
                        <div class="name">
                            {{item.parkingName}}-
                            <span v-if="!item.staggerTime">包月畅停卡</span>
                            <span v-else>错峰停车券</span>
                        </div>
                        <div
                            v-if="!item.effect"
                            class="time"
                        >已过期</div>
                        <div
                            v-else
                            class="time"
                        >未到生效时间
                            <span class="huis">&nbsp;&nbsp;|&nbsp;&nbsp;生效时间: {{item.startTime}}</span>
                        </div>
                    </div>
                    <!-- <div class="btn wid ellipse">再来一张</div> -->
                </div>
            </li>
        </ul>

        <div
            v-else
            class="nothing"
        >
            <div class="on-the-card"></div>
            <div class="notit">暂无产品内容</div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapActions, mapMutations } from "vuex";

import { WEEK, WEEKNUM } from "@/consts";
export default {
    name: "cardList",
    data() {
        return {
            page: {
                currentPage: 1,
                pageSize: 20,
                phoneNum: ''
            },
            monthlyList: [],
            peakList: [],
            cardList: [],
            nolsit: false,
            destroyed: false,
            week: WEEK,
            weekNum: WEEKNUM,
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo,
        })
    },
    created() {
        this.getList();
    },
    destroyed: function () {
        try {
            if (!this.destroyed) {
                AlipayJSBridge.call("popWindow");
            } else {
                next();
            }
        } catch (error) { }
    },
    mounted() { },
    methods: {
        getList() {
            let vm = this;
            vm.loadingOpen();
            vm.page.phoneNum = vm.userInfo.phone;
            vm.staggeringParkingRecordList(vm.page).then(res => {
                if (res.data.data.recordList.length > 0) {
                    let data = res.data.data.recordList.map(a => ({
                        ...a,
                        remaining: vm.DateDiff(vm.hm(a.startTime), a.endTime),
                        overdue: vm.DateDiff(null, a.endTime) >= 0 ? false : true,
                        effect: vm.hm(a.startTime) ? true : false,
                        noweek: a.staggerDate ? vm.getNweek(a.staggerDate) : null,
                        plate:a.lpn.substring(0,2)+'·'+a.lpn.substring(2,a.lpn.length)
                    }));
                    vm.cardList = vm.cardList.concat(data);
                }
            });
            vm.longRentRecordList(vm.page).then(res => {
                if (res.data.data.recordList.length > 0) {
                    let data = res.data.data.recordList.map(a => ({
                        ...a,
                        remaining: vm.DateDiff(vm.hm(a.startTime), a.endTime),
                        overdue: vm.DateDiff(null, a.endTime) > 0 ? false : true,
                        effect: vm.hm(a.startTime) ? true : false,
                         plate:a.lpn.substring(0,2)+'·'+a.lpn.substring(2,a.lpn.length)
                    }));
                    vm.cardList = vm.cardList.concat(data);
                }
            });
        },
        getNweek(str) {
            let vm = this;
            let weekArr = str.split(',');
            weekArr.pop();
            let newArr = [];
            for (let i in vm.weekNum) {
                if (weekArr.indexOf(vm.weekNum[i]) < 0) {
                    newArr.push(vm.weekNum[i]);
                }
            }
            return newArr
        },
        hm(st) {
            var startDate = st;
            startDate = startDate.replace(new RegExp("-", "gm"), "/");
            var startDateM = (new Date(startDate)).getTime(); //得到毫秒数
            var now = new Date().getTime();
            if (now > startDateM) {
                return null
            } else {
                return st
            }
        },
        longRentRecordList(info) {
            return this.Api.longRentRecordList(info);
        },
        staggeringParkingRecordList(info) {
            return this.Api.staggeringParkingRecordList(info);
        },
        DateDiff(stm, sDate1) {
            // sDate1和sDate2是2002-12-18格式
            let sDate2 = stm ? stm : this.format(new Date()).split(" ")[0];
            let aDate, oDate1, oDate2, iDays;
            aDate = sDate1.split("-");
            oDate1 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]); //转换为12-18-2002格式
            aDate = sDate2.split("-");
            oDate2 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]);
            iDays = (oDate1 - oDate2) / 1000 / 60 / 60 / 24; //把相差的毫秒数转换为天数
            return iDays;
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
        }
    }
};
</script>

<style scoped lang="scss">
.page {
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
}
.list {
    padding: 22px 20px;
    .card-wrap {
        width: 335px;
        height: 223px;
        background: #fff;
        border-radius: 10px;
        position: relative;
        margin-bottom: 20px;
        .img {
            width: 100%;
            height: 170px;
            position: relative;
            background-position-y: -1px;
            background-size: 100%;
            background-repeat: no-repeat;
        }
        .plate{
            width: 81px;
            height: 30px;
            background: #fff;
            color: #4A4A4A;
            font-size: 13px;
            text-align: center;
            line-height: 30px;
            font-weight: bold;
            position: absolute;
            right: 16px;
            top: 0;
            border-radius: 2px;
        }
        .overdue {
            width: 100%;
            height: 170px;
            position: relative;
            background-size: 100%;
            background-repeat: no-repeat;
            background-position-y: -1px;
        }
        .Asof {
            height: 30px;
            width: 111px;
            // background: rgba(0, 0, 0, 0.5);
            text-align: center;
            line-height: 30px;
            font-size: 16px;
            color: #fff;
            position: absolute;
            left: 0;
            bottom: 0;
        }
        .info {
            padding: 12px 0 12px 12px;
            height: 55px;
            box-sizing: border-box;
            .name {
                color: #4a4a4a;
                font-size: 13px;
                line-height: 13px;
            }
            .time {
                margin-top: 5px;
                color: #79808a;
                font-size: 12px;
                line-height: 12px;
            }
            .huis {
                color: #c8cacc;
                font-family: "Microsoft YaHei";
            }
        }
        .btn {
            background: #ed3e35;
            border-radius: 4px;
            width: 76px;
            height: 32px;
            color: #fff;
            text-align: center;
            line-height: 32px;
            position: absolute;
            right: 12px;
            bottom: 14px;
        }
        .wid {
            width: 104px;
        }
    }
}

.mban {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 43px;
    width: 100%;
}
.on-the-card {
    width: 189px;
    height: 159px;
    margin: 87px auto 0 auto;
}
.notit {
    text-align: center;
    margin-top: 16px;
    color: #cccccc;
    font-size: 16px;
}
</style>
<style lang="stylus" scoped>
@import '../../assets/css/mixin.styl';

.img {
    background-position: 100%;
    background-size: 100%;
    bg-image('../../assets/img/mustang'); // 使用bg-image($url)函数 $url为变量：brand
    // background: url("../../assets/img/bindPlate-bg.png") no-repeat;
}

.mban {
    background-position: 100%;
    background-size: 100%;
    bg-image('../../assets/img/m'); // 使用bg-image($url)函数 $url为变量：brand
    // background: url("../../assets/img/bindPlate-bg.png") no-repeat;
}

.overdue {
    bg-image('../../assets/img/mustang copy 2'); // 使用bg-image($url)函数 $url为变量：brand
    // background: url("../../assets/img/bindPlate-bg.png") no-repeat;
    background-position: 100%;
    background-size: 100%;
}

.on-the-card {
    bg-image('../../assets/img/card'); // 使用bg-image($url)函数 $url为变量：brand
    // background: url("../../assets/img/bindPlate-bg.png") no-repeat;
    background-position: 100%;
    background-size: 100%;
}
</style>