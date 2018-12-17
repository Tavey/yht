<template>
    <!-- <div class="page">
        <div class="search-wrap" @click="toSearch()">
            <div class="hui">
                <div class="mintui-ic"></div>
                <div class="par">你想停在哪里？</div>
            </div>
        </div>
        <div class="scroll-wrap">
            <ul class="list">
                <li v-for="(item, index) in list" :key="index" class="bor10">
                    <div class="name">{{item.park_name}}</div>
                    <div class="address">{{item.addr}}</div>
                    <div class="price">
                        <span class="tag">￥</span>
                        <span v-if="item.rule.rule_type == 0" class="money">{{item.rule
                            .unit_smallcharge_rate}}</span>
                        <span v-else-if="item.rule.rule_type == 1" class="money">{{item.rule
                            .onetime_smallcharge_rate}}</span>
                        <span v-if="item.rule.rule_type == 0" class="unit">/小时</span>
                        <span v-else-if="item.rule.rule_type == 1" class="unit">/次</span>
                    </div>
                    <div class="distance">{{item.distanceStr}}</div>
                    <div class="btn ellipse" @click="toMap(item)">查看</div>
                </li>
            </ul>
        </div>
    </div> -->
    <div class="page">
        <div class="search-wrap" @click="toSearch()">
            <div class="hui">
                <div class="mintui-ic"></div>
                <div class="par">你想停在哪里？</div>
            </div>
        </div>
        <div class="scroll-wrap">
            <ul class="list">
                <li v-for="(item, index) in list" :key="index" class="bor10">
                    <div class="name">{{item.name}}</div>
                    <div class="address">{{item.address}}</div>
                    <div class="price">
                        <!-- <span class="tag">￥</span> -->
                        <!-- <span v-if="item.rule.rule_type == 0" class="money">{{item.rule
                            .unit_smallcharge_rate}}</span>
                        <span v-else-if="item.rule.rule_type == 1" class="money">{{item.rule
                            .onetime_smallcharge_rate}}</span>
                        <span v-if="item.rule.rule_type == 0" class="unit">/小时</span>
                        <span v-else-if="item.rule.rule_type == 1" class="unit">/次</span> -->
                    </div>
                    <div class="distance">{{ Math.floor(item.distance * 100) / 100 }} km</div>
                    <div class="btn ellipse" @click="toMap(item)">查看</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import qs from "qs";
export default {
    name: "near",
    components: {},
    data() {
        return {
            value: "",
            list: [],
            cityAdcode: null,
            page: {
                // latlng: {
                //     longitude: "121.43246",
                //     latitude: "31.18543",
                //     radius: 1000000
                // },
                pageNo: 1,
                pageRowNo: 20
            }
        };
    },
    created() {
        // this.nearPark();
        this.getCurrentLocation();
    },
    computed: {
        //...mapState(['s'])
    },
    mounted() {},
    methods: {
        getCurrentLocation() {
            let vm = this;
            try {
                AlipayJSBridge.call(
                    "getCurrentLocation",
                    {
                        requestType: 1,
                        bizType: "didi"
                    },
                    function(result) {
                        if (result.error) {
                            return;
                        } else {
                            vm.nearPark(result);
                        }
                    }
                );
            } catch (error) {}
        },
        toSearch() {
            this.$router.push({ path: "search/search" });
        },
        toMap(item) {
            let vm = this;
            this.$router.push({
                path: "search/map",
                query: {
                    name: item.name,
                    location: item.longitude+','+item.latitude,
                    addr: item.address,
                    cityAdcode: vm.cityAdcode
                }
            });
        },
        nearPark(obj) {
            let vm = this;
            // alert(JSON.stringify(obj))
            vm.loadingOpen();
            vm.cityAdcode = obj.cityAdcode;
            let latLng = {
                // longitude:  "121.428382",
                // latitude:  "31.184103",
                longitude: obj.longitude,
                latitude: obj.latitude,
                currentPage:vm.page.pageNo,
                pageSize:vm.page.pageRowNo,
                distance:10000

            };

            vm.parkList(latLng).then(res => {
                vm.loadingClose();
                if (res.status == 200) {
                    if (res.data.data.datas.length == 0) {
                        vm.toasts("附近无可用停车场");
                        return;
                    }
                    let data = res.data.data.datas;
                    if (data.length > 0) {
                        vm.list = data;
                    }
                } else {
                }
            });
        },
        parkList(info) {
            return this.Api.parkList(info);
        }
    }
};
</script>

<style scoped lang="scss">
.list {
    padding: 12px 20px 0 20px;
    li {
        height: 114px;
        width: 335px;
        background: #fff;
        margin-bottom: 8px;
        padding: 14px 14px 0 14px;
        box-sizing: border-box;
        position: relative;
    }
    .btn {
        color: #fff;
        background: #2657eb;
        font-weight: bold;
        height: 36px;
        width: 88px;
        font-size: 16px;
        line-height: 36px;
        text-align: center;
        position: absolute;
        right: 14px;
        bottom: 14px;
    }
    .distance {
        color: #12cf85;
        font-size: 14px;
        line-height: 14px;
        position: absolute;
        right: 14px;
        top: 14px;
        font-family: "微软雅黑";
    }

    .name {
        font-size: 16px;
        color: #3a4557;
        line-height: 17px;
        font-weight: bold;
    }
    .address {
        color: #d5d5d6;
        font-size: 13px;
        line-height: 14px;
        margin-top: 6px;
    }
    .price {
        width: 200px;
        font-size: 24px;
        color: #d5d5ef;
        margin-top: 30px;
        line-height: 24px;
        // position: absolute;
        bottom: 0;
        span {
            float: left;
        }
    }
    .money {
        color: #000;
        margin-right: 4px;
        font-family: "微软雅黑";
    }
    .unit {
        font-size: 13px;
        line-height: 27px;
    }
}
.scroll-wrap {
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
}
.page {
    padding-top: 49px;
    box-sizing: border-box;
}
.search-wrap {
    height: 49px;
    position: absolute;
    width: 100%;
    top: 0;
    padding: 8px 18px 7px 18px;
    background: #fff;
    box-sizing: border-box;
}
.hui {
    height: 100%;
    width: 100%;
    background: #f1f3f7;
    position: relative;
    line-height: 34px;
}
.par {
    display: inline-block;
    font-size: 15px;
    color: #cccccc;
    margin-left: 36px;
}
.mintui-ic {
    // color: #79808a;
    margin: 3px 0 0 3px;
    height: 30px;
    width: 30px;
    position: absolute;
    background: url("../../assets/img/icon-search.png");
    background-size: 100%;
}
.bor10 {
    box-shadow: 0px 10px 15px rgba($color: #000000, $alpha: 0.03);
}
</style>


