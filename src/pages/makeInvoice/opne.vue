<template>
    <div class="page">
        <div class="info-wrap">
            <div class="area">
                <mt-field
                    label="发票内容"
                    v-model="taitouInfo.cont"
                    :disabled="true"
                ></mt-field>
                <mt-field
                    class="red"
                    label="发票金额"
                    v-model="taitouInfo.amount"
                ></mt-field>
            </div>
        </div>
        <div class="use-wrap">
            <div
                class="choose"
                @click="choose"
            >
                发票抬头
                <i class="mint-cell-allow-right"></i>
            </div>
            <div
                class="info"
                v-if="invoiceInfo"
            >
                <div class="hang">
                    <span class="left">抬头类型</span>
                    <span class="right">{{type[invoiceInfo.type]}}</span>
                </div>
                <div class="hang">
                    <span class="left">发票抬头</span>
                    <span class="right">{{invoiceInfo.name}}</span>
                </div>
                <div class="hang">
                    <span class="left">手机号</span>
                    <span class="right">{{invoiceInfo.phone}}</span>
                </div>
                <div class="hang">
                    <span class="left">接受邮箱</span>
                    <span class="right">{{invoiceInfo.email}}</span>
                </div>
            </div>
        </div>
        <div
            class="but bor2"
            @click="complete()"
        >提交申请</div>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    name: "open",
    components: {},
    data() {
        return {
            taitouInfo: {
                name: "",
                number: "",
                amount: "",
                cont: "运输服务 客运服务",
                email: '',
                phone: '',
                datas: []
            },
            invoiceInfo: null,
            type: {
                "1": '个人发票',
                "2": "企业发票"
            },
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo,
            invoice: single => single.invoice
        })
    },
    created() {
        let num = 0;
        if (!window.listArr) {
            this.$router.go(-1);
        }
        for (let i in window.listArr) {
            let a = {
                parkid: window.listArr[i].parkCode,
                id: window.listArr[i].id,
                price: window.listArr[i].charge,
                parkName: window.listArr[i].parkName
            }
            this.taitouInfo.datas.push(a)
            num += window.listArr[i].charge
        }
        this.taitouInfo.amount = num / 100;
    },
    mounted() {
        if (this.invoice) {
            this.invoiceInfo = this.invoice
        }
    },
    methods: {
        change() { },
        complete() {
            let vm = this;
            if (!vm.invoiceInfo) {
                vm.toasts('请选择抬头');
                return;
            }
            if (vm.$route.query.invoiceType == 1) {
                let orderIds = '';
                let price = 0;
                for (let i = 0; i < window.listArr.length; i++) {
                    orderIds += window.listArr[i].orderId + ';'
                    price += window.listArr[i].charge;
                }
                let info = {
                    parkId: vm.$route.query.parkCode,
                    price: price,
                    orderIds: orderIds,
                    userId: vm.userInfo.phone,
                }

                vm.loadingOpen();
                vm.Api.getInvoiceUrl(info).then(res => {
                    if (res.data.code = 1000) {
                        try {
                            AlipayJSBridge.call("pushWindow", {
                                url: res.data.data.RedirectUrl,
                                param: {
                                    readTitle: true,
                                    showOptionMenu: false
                                }
                            });
                        } catch (error) {
                            window.open(res.data.data.RedirectUrl, '')
                        }
                    }
                })
            } else {
                let info = {
                    userId: vm.userInfo.phone,
                    datas: vm.taitouInfo.datas,
                    parkCode: vm.$route.query.parkCode,
                    headId: vm.invoice.id
                }

                vm.loadingOpen();
                vm.Api.createInvoice(info).then(res => {
                    console.log(res)
                    if (res.data.code = 1000) {

                        vm.$router.push({
                            path: "end",
                            query: {
                                email: vm.invoiceInfo.email,
                            }
                        });
                    }
                })
            }

        },
        choose() {
            this.$router.push({ path: '/invoice/list' })
        }
    }
};
</script>

<style scoped lang="scss">
.pop-up {
    height: 100%;
    width: 100%;
    background: #fff;
}
.page {
    box-sizing: border-box;
    padding-top: 13px;
}
.info-wrap {
    background: #fff;
    padding: 12px 20px 0 20px;
}
.but {
    position: fixed;
    bottom: 96px;
    left: 33px;
}
.use-wrap {
    margin-top: 11px;
    padding: 0 20px;
    background: #fff;
    .hang {
        height: 48px;
        border-bottom: 1px solid #f4f6fa;
        line-height: 48px;
        box-sizing: border-box;
        font-size: 16px;
        color: #3a4557;
        span {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .left {
            width: 87px;
        }
        .right {
            width: 240px;
        }
    }
}
.hang:last-child {
    border-bottom: none;
}
.choose {
    height: 57px;
    line-height: 57px;
    font-size: 18px;
    color: #2f2f33;

    font-weight: bold;
    position: relative;
    .mint-cell-allow-right::after {
        right: 0px;
        height: 7px;
        width: 7px;
    }
}
</style>
<style scoped>
.page >>> .mint-cell-text,
input {
    font-size: 16px !important;
}
.page >>> .mint-field-core {
    font-size: 16px !important;
    background: #fff;
}
.page >>> .red .mint-field-core {
    color: #ed3e35 !important;
}
.page >>> .mint-cell-wrapper {
    padding: 0;
}

.page >>> .mint-field-core::-webkit-input-placeholder {
    color: #cccccc;
}
.page >>> .mint-field-core:-moz-placeholder {
    color: #cccccc;
}
.page >>> .mint-field-core::-moz-placeholder {
    color: #cccccc;
}
.page >>> .mint-field-coret:-ms-input-placeholder {
    color: #cccccc;
}
</style>
