<template>
    <div class="page">
        <div class="module">
            <div
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="20"
            >
                <div
                    v-for="(item,index) in allArr"
                    :key="index"
                    v-if="item.length>0"
                >
                    <div class="month">{{add0(12-index)}}月</div>
                    <ul class="list">
                        <li
                            v-for="(sle,ind) in item"
                            class="sele"
                            @click="handSelected(sle,ind,index)"
                            :key="ind"
                        >
                            <div
                                class="tick"
                                :class="{selected:sle.selected}"
                            ></div>
                            <div class="order-info">
                                <div class="time">{{sle.payTime}}</div>
                                <div class="address">{{sle.parkName}}</div>
                                <div class="plate">{{sle.lpn}}</div>
                                <div class="money">￥{{sle.actualCharge/100}}</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
        <div class="next-wrap">
            <div
                class="tick"
                :class="{selected:all}"
                @click="allSelected()"
            ></div>
            <span class="all-selected">全选</span>
            <div
                class="to-next can-go"
                @click="goMakeInvoice()"
                :class="{nopay:nopay}"
            >下一步</div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    name: "list",
    components: {},
    data() {
        return {
            all: false,
            data: [

            ],
            nopay: true,
            allArr: [[],[],[],[],[],[],[],[],[],[],[],[]],
            page: {
                page: 1,
                pageSize: 20,

            },
            loading: false,
            listArr: [],
        };
    },
    watch: {
        listArr(str) {
            if (str.length > 0) {
                this.nopay = false;
            } else {
                this.nopay = true;
            }
        },
    },
    created() {

    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo,
        })
    },
    mounted() {
        //  this.getChargeList();
    },
    methods: {
        goMakeInvoice() {
            if (this.nopay) {
                return
            }
            window.listArr = this.listArr;
            this.$router.push({
                path: "open",
                query: {
                    parkCode: this.$route.query.parkCode,
                    invoiceType:this.$route.query.invoiceType,
                }
            });
        },
        handSelected(item, num, index) {
            let vm = this;
            vm.allArr[index][num].selected = !vm.allArr[index][num].selected;
            if (vm.allArr[index][num].selected == false) {
                vm.all = false;
            }
            let arr = [];
            vm.data.map(a => {
                if (a.selected == true) {
                    arr.push(a)
                }

            });
            vm.listArr = arr;
            if (arr.length > 0) {
                vm.nopay = false;
            } else {
                vm.nopay = true;
            }
            if (arr.length == vm.data.length) {
                vm.all = true;
            }
        },
        allSelected() {
            let vm = this;
            vm.all = !this.all;
            vm.data.map(a => {
                a.selected = vm.all;
            });
            if (vm.all) {
                vm.listArr = vm.data;
            } else {
                vm.listArr = [];
            }
        },
        add0(str) {
            return str < 10 ? '0' + str : str;
        },
        loadMore() {
            this.getChargeList();
        },
        getChargeList() {
            let vm = this;
            let info = {
                userid: vm.userInfo.phone,
                parkCode: vm.$route.query.parkCode,
                page: vm.page.page,
                pageSize: vm.page.pageSize,
                billSign: false
            }
            vm.loadingOpen();
            vm.Api.getChargeList(info).then((res) => {
                if (res.data.data.datas.length == 0) {
                    vm.toasts('暂无可开票订单');
                    return
                }
                let newList = res.data.data.datas.map(a => ({
                    ...a,
                    selected: false,
                    year: a.payTime.split('-')[0],
                    month: a.payTime.split('-')[1]
                }));
                vm.data = vm.data.concat(newList);
                let temp = [];
                for (var i = 0; i < newList.length; i++) {
                    if (temp.indexOf(newList[i].month) == -1) {
                        temp.push(newList[i].month);
                    }
                }
                for (const y in temp) {
                    for (let i = 0; i < newList.length; i++) {
                        if (newList[i].month == temp[y]) {
                            vm.allArr[11 - (temp[y] - 1)].push(newList[i])
                        }

                    }
                }
                if (res.data.data.totalRowsAmount > vm.data.length) {
                    vm.loading = false;
                    vm.page.pageNo += 1;
                } else {
                    vm.loading = true;
                }
            })
        }
    }
};
</script>

<style scoped lang="scss">
.month {
    padding: 0 20px;
    height: 34px;
    line-height: 34px;
    font-size: 12px;
    color: #3a4557;
}
.page {
    overflow: hidden;
}
.module {
    height: calc(100% - 50px);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
}
.list {
    padding: 0 20px;
    background: #fff;
    li {
        height: 88px;
        padding-left: 38px;
        box-sizing: border-box;
        position: relative;
        border-bottom: 1px solid #f4f6fa;
        .order-info {
            display: inline-block;
            width: 100%;
            height: 100%;
            font-size: 12px;
            position: relative;
        }
        .time {
            color: #3a4557;
            margin: 14px 0 10px 0;
            line-height: 14px;
        }
        .address {
            color: #3a4557;
            font-size: 16px;
            margin-bottom: 10px;
            line-height: 14px;
        }
        .plate {
            color: #d5d5d6;
            line-height: 10px;
        }
        .money {
            font-size: 22px;
            color: #3a4557;
            font-weight: 500;
            position: absolute;
            right: 20px;
            bottom: 15px;
            line-height: 14px;
        }
    }
}
.list > .sele:last-child {
    border-bottom: none;
}
.tick {
    height: 24px;
    width: 24px;
    border-radius: 9999px;
    border: 2px #eeeeee solid;
    position: absolute;
    top: 32px;
    left: 0;
    box-sizing: border-box;
    display: inline-block;
}
.selected {
    border: none;
    background: url("../../assets/img/dagou.png") no-repeat;
    background-size: 100%;
    overflow: hidden;
}

.next-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    padding: 0 0 0 58px;
    box-sizing: border-box;
    z-index: 100;
    background: #fff;
    line-height: 50px;
    .tick {
        top: 13px;
        left: 20px;
    }
    .all-selected {
        color: #3a4557;
        font-size: 16px;
    }
    .to-next {
        display: inline-block;
        background: #cccccc;
        color: #fff;
        font-size: 18px;
        height: 100%;
        width: 140px;
        text-align: center;
        position: absolute;
        right: 0;
    }
    .can-go {
        background: #ed3e35;
    }
    .nopay {
        background: #ccc;
    }
}
</style>
