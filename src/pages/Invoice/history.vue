<template>
    <div class="page">
        <ul class="historyList">
            <!-- <li class="wrap" @click="details()">
                <div class="title">电子发票-企业2</div>
                <div class="detailed success">
                    已申请
                    <i class="mint-cell-allow-right"></i>
                </div>
                <div class="describe">停车订单</div>
                <div class="time">2018-07-14 16:30:02</div>
                <div class="price">￥1892.2</div>
            </li> -->
            <li
                class="wrap"
                @click="details(item.id)"
                v-for="(item, index) in page.list"
                :key="index"
            >
                <div class="title">电子发票-{{type[item.type]}}</div>
                <div class="detailed completed">
                    已完成
                    <i class="mint-cell-allow-right"></i>
                </div>
                <div class="describe">停车订单</div>
                <div class="time">{{item.KPRQ}}</div>
                <div class="price">￥{{item.HJJE}}</div>
            </li>
            <!-- <li class="wrap">
                <div class="title">电子发票-企业</div>
                <div class="detailed failure">
                    开票失败
                    <i class="mint-cell-allow-right"></i>
                </div>
                <div class="describe">停车订单</div>
                <div class="time">2018-07-14 16:30:02</div>
                <div class="price">￥1892.2</div>
            </li> -->
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
import * as types from "@/store/types";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    name: "history",
    components: {},
    data() {
        return {
            page: {
                list: [],
                pageNo: 1,
                PageRowNo: 20
            },
            type: {
                "1": "个人",
                "2": "单位"
            }
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo
        })
    },
    created() {

    },
    mounted() {
        this.getData(this.userInfo)
    },
    methods: {
        details(id) {
            this.$router.push({
                path: "invoice/detailed",
                query: {
                    id: id,
                }
            });
        },
        getData(userInfo) {
            let vm = this;
            vm.loadingOpen()
            vm.voiceList(userInfo.phone).then(res => {
                vm.loadingClose();
                let data = res.data.data;
                if (data.length > 0) {
                    vm.page.list = data;
                } else {
                    vm.message('无历史订单', function () {
                        vm.$router.back(-1)
                    })
                }
            })
                .catch(err => {
                    vm.loadingClose();
                });
        },
        voiceList(phone) {
            return this.Api.voiceList(
                phone
            );
        }
    }
};
</script>

<style scoped lang="scss">
.page {
    padding: 11px 20px 0 20px;
    box-sizing: border-box;
    overflow-y: scroll;
}
.wrap {
    height: 114px;
    width: 335px;
    background: #fff;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 14px 12px 0 12px;
    position: relative;
    margin-bottom: 10px;
    .title {
        font-size: 16px;
        color: #3a4557;
    }
    .describe {
        margin-top: 4px;
        font-size: 12px;
        color: #d5d5d6;
    }
    .time {
        font-size: 14px;
        color: #3a4557;
        position: absolute;
        bottom: 11px;
        left: 12px;
    }
    .price {
        color: #3a4557;
        font-size: 20px;
        position: absolute;
        right: 12px;
        bottom: 14px;
        font-weight: 700;
    }
    .detailed {
        font-size: 13px;
        position: absolute;
        right: 12px;
        top: 14px;
        padding-right: 15px;
    }
    .mint-cell-allow-right::after {
        right: 0;
        height: 7px;
        width: 7px;
    }
    .success {
        color: #12cf85;
    }
    .failure {
        color: #ed3e35;
    }
    .completed {
        color: #9b9b9b;
    }
}
</style>
