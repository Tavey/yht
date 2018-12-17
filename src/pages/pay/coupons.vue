<template>
    <div class="page">
        <div class="scroll-wrap">
            <div class="noCoup" @click="noCoup">
                不使用优惠券
            </div>
            <ul
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="20"
            >
                <li
                    v-for="(item,index) in list"
                    @click="backUp(item,index)"
                    :key="index"
                    v-if="item.noUse"
                >
                    <div
                        v-if="item.discountType == 0"
                        class="money"
                    >
                        <div class="small">￥</div>
                        <div class="big">{{item.cashDiscount/100}}</div>
                    </div>
                    <div
                        v-else
                        class="money"
                    >
                        <div class="big1">{{item.hoursDiscount}}</div>
                        <div class="small1">小时</div>
                    </div>
                    <div class="info">
                        <div class="name">{{item.discountName}}</div>
                        <div class="time">{{item.sTime}}至{{item.eTime}}</div>
                    </div>
                    <div
                        :class="{selected:current==index}"
                        class="tick "
                    ></div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import * as types from "@/store/types";
import { mapState, mapActions, mapMutations } from "vuex";
import timedeal from "@/mixins/time.js";
export default {
    name: "index",
    components: {},
    data() {
        return {
            list: [],
            current: null,
            loading: false,
        };
    },
    mixins: [timedeal],
    computed: {
        ...mapState({
            userInfo: state => state.userInfo
        })
    },
    mounted() { },
    created() {
        this.park = this.$route.query.park;
    },
    methods: {
        ...mapMutations({
            setCouponsChoose: types.global.mutations.SET_COUPONS_CHOOSE
        }),
        backUp(item, index) {
            this.current = index;
            // sessionStorage.setItem('coupons',JSON.stringify(item)); 
            // this.setCouponsChoose(item);
            window.couponsChoose =  item;
            setTimeout(() => {
                this.$router.back(-1);
            }, 100);
        },
        noCoup(){
            window.couponsChoose =  null;
             setTimeout(() => {
                this.$router.back(-1);
            }, 100);
        },
        loadMore() {
            this.getList();
        },
        getList() {
            let vm = this;
            vm.loadingOpen();
            if (vm.loading) {
                return
            }
            let info = {
                category:vm.$route.query.category,
                productType: 0, //优惠券使用的产品类型
                parkCode: vm.$route.query.park,
                phone: vm.$route.query.phone || vm.userInfo.phone,
            }
            vm.getUserUsabledDiscounts(info).then(res => {
                vm.loadingClose();
                let data = res.data.data.datas;
                if (data && data.length > 0) {
                    let newlist = res.data.data.datas.map(a => ({
                        ...a,
                        sTime:  a.startTime.split(' ')[0],
                        eTime: a.endTime.split(' ')[0],
                        noUse: vm.DateDiff(a.endTime,vm.format(new Date())) >= 0?false:true
                    }));
                    // alert(new Date(newlist[0].startTime).toLocaleString())
                    // alert(vm.format(newlist[0].startTime))
                    vm.list =newlist;
                        // vm.list.length > 0 ? vm.list.concat(newlist) : newlist;
                    // if (res.data.data.totalCount > vm.list.length) {
                    //     vm.loading = false;
                    //     vm.currentPage += 1;
                    // } else {
                    //     vm.loading = true;;
                    // }
                } else {
                    vm.toasts('暂无优惠券');
                }
            })
        },
        format(time, mat) {
            var t = new Date(time);
            var tf = function (i) { return (i < 10 ? '0' : '') + i };
            return tf(t.getFullYear())+'-'+tf(t.getMonth() + 1)+'-'+tf(t.getDate())
        },
        getUserUsabledDiscounts(userInfo) {
            return this.Api.getUserUsabledDiscounts(userInfo);
        },
    }
};
</script>

<style scoped lang="scss">
.page {
    padding-top: 9px;
    // height: 100%;
    box-sizing: border-box;
    // overflow-y: scroll;
    // -webkit-overflow-scrolling: touch;
}
.scroll-wrap {
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    background: #f4f6fa;
}
.noCoup{
    height: 44px;
    width: 100%;
    text-align: center;
    line-height: 44px;
    color: #2F2F33;
    background: #fff;
    margin-bottom: 9px;
}
ul {
    li {
        position: relative;
        background: #fff;
        margin-bottom: 8px;
        height: 60px;
        font-size: 16px;
        box-sizing: border-box;
        .money {
            float: left;
            color: #ff0024;
            width: 122px;
            height: 60px;
            text-align: center;
            line-height: 60px;
            div {
                display: inline-block;
            }
        }
        .small {
            font-size: 15px;
            position: relative;
            right: -5px;
            top: -2px;
        }
        .small1 {
            font-size: 12px;
            position: relative;
            top: 0px;
        }
        .big {
            font-size: 30px;
        }
        .big1 {
            font-size: 30px;
            margin-left: 10px;
        }
        .info {
            height: 100%;
            width: 195px;
            float: left;
            .name {
                font-size: 15px;
                color: #2f2f33;
                line-height: 15px;
                width: 195px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 15px;
                margin-top: 13px;
            }
            .time {
                color: #9dadbd;
                font-size: 11px;
                margin-top: 8px;
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
    }
}
</style>
