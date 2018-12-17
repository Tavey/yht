<template>
    <div class='page'>

        <mt-cell-swipe
            v-for="(item,index) in list"
            :key="index"
            :right="[
                            {
                            content: '删除',
                            style: { background: 'red', color: '#fff' },
                            handler:() =>  deleteHeard(item)
                            }
                        ]"
        >
            <div
                class="company module"
                @click="updata(item)"
            >
                <div class="wid100">
                    <div class="left">发票类型</div>
                    <div class="right">{{type[item.type]}}</div>
                </div>
                <div class="wid100">
                    <div class="left">发票抬头</div>
                    <div class="right">{{item.name}}</div>
                </div>
                <div
                    v-if="item.businessTax"
                    class="wid100"
                >
                    <div class="left">企业税号</div>
                    <div class="right">{{item.businessTax}}</div>
                </div>
                <div class="wid100">
                    <div class="left">手机号</div>
                    <div class="right">{{item.phone}}</div>
                </div>
                <div class="wid100">
                    <div class="left">接收邮箱</div>
                    <div class="right">{{item.email}}</div>
                </div>

            </div>
        </mt-cell-swipe>
        <div
            class="but bor2"
            @click="complete()"
        >新增发票抬头</div>
    </div>
</template>

<script>
import * as types from "@/store/types";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    data() {
        return {
            list: [],
            type: {
                "1": '个人发票',
                "2": "企业发票"
            },
            invoiceInfo: null

        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo,
            invoice: single => single.invoice
        })
    },
    created() {

    },
    mounted() {
        this.getList()
    },
    methods: {
        ...mapMutations({
            setInvoice: types.global.mutations.SET_INVOICE,
            // setCouponsChoose: types.global.mutations.SET_COUPONS_CHOOSE
        }),
        complete() {
            this.$router.push({ path: "/makeInvoice/add" });
        },
        getList() {
            let vm = this;
            vm.loadingOpen();
            vm.Api.invoiceHeaderList(vm.userInfo.phone).then((res) => {
                console.log(res)
                if (res.data.data.length == 0) {
                    vm.toasts("暂无抬头");

                } else {
                    vm.list = res.data.data;
                }
            })
        },
        deleteHeard(item) {
            let vm = this;
            vm.Api.deleteHeader(item.id).then(res => {
                console.log(res)
                if (res.data.code == 1000) {
                    vm.toasts("删除成功");
                    if(item.id == vm.invoice.id){
                         vm.setInvoice(null)
                    }   
                    vm.getList()
                }
            })
        },
        updata(obj) {
            let vm = this;
            vm.setInvoice(obj)
            setTimeout(() => {
                vm.$router.go(-1);
            }, 0);

        }
    },
}
</script>

<style scoped lang="scss">
.page {
    padding-top: 12px;
    padding-bottom: 100px;
    overflow-y: scroll;
    box-sizing: border-box;
}
.module {
    background: #fff;
    padding: 10px 20px 10px 20px;
    // div {
    //     height: 48px;
    //     line-height: 48px;
    //     display: inline-block;
    // }
    .left {
        height: 40px;
        line-height: 40px;
        display: inline-block;
        font-size: 16px;
        color: #bec2cc;
        width: 64px;
        overflow: hidden;
    }
    .right {
        height: 48px;
        line-height: 48px;
        display: inline-block;
        color: #3a4557;
        font-size: 15px;
        margin-left: 23px;
        width: 230px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
.but {
    position: fixed;
    bottom: 49px;
    left: 33px;
}
.wid100 {
    width: 100% !important;
    height: 40px;
}
</style>

<style scoped>
.page >>> .mint-cell {
    margin-bottom: 12px;
}
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
    writing-mode: tb-rl;
    padding: 30% 20% 0 0;
    box-sizing: border-box;
    font-size: 16px;
}
.page >>> .mint-cell {
    background-image: none;
}
</style>
