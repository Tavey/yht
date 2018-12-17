<template>
    <div class="page">
        <div class="title">{{displayType.title[displayType.type]}}</div>
        <div class="scroll-wrap">
            <ul
                class="list"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="20"
            >
                <li
                    v-for="(item,index) in list"
                    @click="toPay(item)"
                    class="wrap bor10"
                    :key="index"
                >
                    <div class="place-name">{{item.parkingName}}</div>
                    <div
                        v-if="item.address"
                        class="address"
                    >{{item.address}}</div>
                    <div
                        v-else
                        class="address"
                    >{{item.parkAddress||'暂无地址'}}</div>
                    <div
                        v-if="displayType.type == 1"
                        class="time"
                    >
                        {{item.staggeringTime}}
                        <span>丨{{item.parkingPosition}}</span>
                    </div>
                    <div
                        v-if="displayType.type == 1"
                        class="price"
                    >￥
                        <span class="money">{{item.price/100}}</span>
                        <span class="day">/{{item.activeDays}}天</span>
                    </div>
                    <div
                        v-else
                        class="price"
                    >￥
                        <span class="money">{{item.price/100}}</span>
                        <span class="day">/月</span>
                    </div>
                    <ring :percen=" (item.totalCount-item.salesCount)/item.totalCount*100" />
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
import qs from "qs";
import { STAGGER_TYPE } from "@/consts";
import ring from "@/components/ring";
import {
    BASE_API_HOST
} from "@/env";
export default {
    name: "list",
    components: {
        ring
    },
    data() {
        return {
            displayType: {
                title: STAGGER_TYPE,
                type: 1
            },
            loading: false,
            classN: ["green", "yellow", "red", ""],
            list: [],
            page: {
                latlng: {
                    longitude: "121.43246",
                    latitude: "31.18543",
                    radius: 1000000
                },
                pageNo: 1,
                pageRowNo: 20
            }
        };
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
    created() {
        let vm = this;
        this.displayType.type = this.$route.query.type;
    },
    computed: {
        //...mapState(['s'])
    },
    mounted() { },
    methods: {
        getCurrentLocation() {
            let vm = this;
            try {
                AlipayJSBridge.call(
                    "getCurrentLocation",
                    { bizType: "didi" },
                    function (result) {
                        if (result.error) {
                            // alert(result.errorMessage);
                            return;
                        }
                        alert(JSON.stringify(result));
                    }
                );
            } catch (error) { }
        },
        toPay(item) {
            this.destroyed = true;
            let url = `http%3a%2f%2f116.62.190.147%3a9001%2f%23%2fstagger%2fbuy%3ftype%3d${
                this.$route.query.type
                }%26productId%3d${item.productId}`;
            try {
                AlipayJSBridge.call("pushWindow", {
                    url: `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2018090361250268&scope=%20auth_user&redirect_uri=${url}`,
                    param: {
                        readTitle: true,
                        showOptionMenu: false
                    }
                });
            } catch (error) {
                this.$router.push({
                    path: "stagger/buy",
                    query: {
                        type: this.$route.query.type,
                        productId: item.productId,
                        auth_code: this.$route.query.auth_code
                    }
                });
            }
        },
        loadMore() {
            let vm = this;
            vm.getList();
            //  try {
            //     AlipayJSBridge.call(
            //         "getCurrentLocation",
            //         {
            //             requestType: 1,
            //             bizType: "didi"
            //         },
            //         function(result) {
            //             if (result.error) {
            //                 return;
            //             } else {
            //                 vm.getList(result);
            //             }
            //         }
            //     );
            // } catch (error) {}

        },
        getList(obj) {
            this.loadingOpen();
            let vm = this;
            if (vm.loading) {
                return;
            }
            vm.loading = true;
            let info = {
                // longitude: obj.longitude,
                // latitude: obj.latitude,
                longitude: vm.page.latlng.longitude,
                latitude: vm.page.latlng.latitude,
                // radius: 20000,
                pageNo: vm.page.pageNo,
                pageSize: vm.page.pageRowNo
            };
            vm.choose(info).then(res => {
                let data = res.data.data.datas;
                if (data.length > 0) {
                    let newlist = data.map(a => ({
                        ...a,
                        dateDiff: vm.DateDiff(a.endTime, a.startTime)
                    }));
                    vm.list =
                        vm.list.length > 0 ? vm.list.concat(newlist) : newlist;
                }
                if (res.data.total > vm.list.length) {
                    vm.loading = false;
                    vm.page.pageNo += 1;
                } else {
                    vm.loading = true;
                }
            });
        },
        choose(info) {
            let vm = this;
            if (vm.displayType.type == 1) {
                return vm.rangeStagList(info);
            } else {
                return vm.ranglrList(info);
            }
        },
        //错峰
        rangeStagList(latLng, pageNO, pageRowNo) {
            return this.Api.rangeStagList(latLng, pageNO, pageRowNo);
        },
        //包月
        ranglrList(latLng, pageNO, pageRowNo) {
            return this.Api.ranglrList(latLng, pageNO, pageRowNo);
        },
        DateDiff(sDate1, sDate2) {
            //sDate1和sDate2是2002-12-18格式
            let aDate, oDate1, oDate2, iDays;
            aDate = sDate1.split("-");
            oDate1 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]); //转换为12-18-2002格式
            aDate = sDate2.split("-");
            oDate2 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]);
            iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
            return iDays;
        }
    }
};
</script>

<style scoped lang="scss">
.page {
    padding: 73px 0px 0 0px;
    box-sizing: border-box;
}
.title {
    padding: 0 20px;
    position: absolute;
    top: 30px;
    font-size: 24px;
    color: #2f2f33;
    line-height: 33px;
    margin-bottom: 10px;
}
.scroll-wrap {
    padding: 0 20px;
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
}
.wrap {
    height: 114px;
    background: #fff;
    padding: 14px 12px 0 12px;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 8px;
    .place-name {
        font-size: 16px;
        color: #3a4557;
    }
    .address {
        font-size: 13px;
        color: #d5d5d6;
    }
    .time {
        color: #3a4557;
        font-size: 14px;
        margin-top: 25px;
    }
    .price {
        font-size: 16px;
        color: #3a4557;
        position: absolute;
        bottom: 14px;
        right: 12px;
        .money {
            color: #3a4557;
            font-weight: 500;
            font-size: 22px;
            font-weight: bold;
        }
        .day {
            font-size: 13px;
        }
    }
}
.none {
    color: #d5d5d6 !important;
}

.progress {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 12px;
    top: 14px;
}
</style>

<style scoped>
.progress >>> .el-progress-circle {
    width: 30px !important;
    height: 30px !important;
}

.abd >>> .el-progress-circle__track {
    stroke: rgb(250, 145, 172) !important;
    opacity: 0.2;
}
.progress >>> .el-progress-circle__path {
    stroke-width: 7.5px !important;
}
</style>
