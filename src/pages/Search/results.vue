<template>
    <!-- <div class="page">
        <div class="scroll-wrap">
            <ul class="list">
                <li v-for="(item, index) in list" :key="index" class="bor10">
                    <div class="name">{{item.park_name}}</div>
                    <div class="address">{{item.addr}}</div>
                    <div class="price">
                        <span class="tag">￥</span>
                        <span v-if="item.rule.rule_type == 0"  class="money">{{item.rule
.unit_smallcharge_rate}}</span>
                        <span v-else-if="item.rule.rule_type == 1" class="money" >{{item.rule
.onetime_smallcharge_rate}}</span>
                        <span v-if="item.rule.rule_type == 0" class="unit">/小时</span>
                        <span v-else-if="item.rule.rule_type == 1" class="unit">/次</span>
                    </div>
                    <div   class="distance">{{item.distance}}</div>
                    <div class="btn ellipse" @click="toMap(item)">查看</div>
                </li>
            </ul>
        </div>
    </div> -->
    <div class="page">
        <div class="scroll-wrap">
            <ul class="list">
                <li v-for="(item, index) in list" :key="index" class="bor10">
                    <div class="name">{{item.name}}</div>
                    <div class="address">{{item.address}}</div>
                    <div class="price">
                        <!-- <span class="tag">￥</span>
                        <span v-if="item.rule.rule_type == 0"  class="money">{{item.rule
.unit_smallcharge_rate}}</span>
                        <span v-else-if="item.rule.rule_type == 1" class="money" >{{item.rule
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
    name: "index",
    components: {},
    data() {
        return {
            queryInfo: null,
            list: [],
            page: {
                pageNo: 1,
                pageRowNo: 20
            }
        };
    },
    computed: {
        //...mapState(['s'])
    },
    created() {
        let vm = this;
        vm.queryInfo = vm.$route.query;
        vm.nearPark();
    },
    mounted() {
        // this.title();
    },
    methods: {
        title() {
            let title = this.$route.query.name;
            document.title = title;
        },
        nearPark() {
            let vm = this;
            vm.loadingOpen();
            let info = {
                longitude: vm.$route.query.location.split(",")[0],
                latitude: vm.$route.query.location.split(",")[1],
                currentPage: vm.page.pageNo,
                pageSize: vm.page.pageRowNo
            };
            vm.parkList(info)
                .then(res => {
                    vm.loadingClose();
                    if (res.status == 200) {
                        let data = res.data.data.datas;
                        if (data.length > 0) {
                            vm.list = data;
                        } else {
                            this.message("附近无停车场", function() {
                                vm.$router.back(-1);
                            });
                        }
                    } else {
                    }
                })
                .catch(err => {
                    vm.loadingClose();
                });
        },
        parkList(latLng) {
            return this.Api.parkList(latLng);
        },
        toMap(item) {
            console.log(item);
            this.$router.push({
                path: "map",
                query: {
                    name: item.name,
                    location: item.longitude+','+item.latitude,
                    addr: item.address,
                    cityAdcode: this.$route.query.cityAdcode
                }
            });
        }
    }
};
</script>

<style scoped lang="scss">
.page {
    box-sizing: border-box;
    padding: 12px 20px 0 20px;
    overflow-y: scroll;
}
.list {
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
        span {
            float: left;
        }
    }
    .money {
        color: #000;
    }
    .unit {
        font-size: 13px;
    }
}
</style>
