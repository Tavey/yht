<template>
    <div class="page">
        <iframe v-if="scrs!=''" :src="srcs" frameborder="0"></iframe>
        <!-- <div class="info-wrap">
            <ul class="list">
                <li>
                    <span class="tit">发票抬头</span>
                    <span class="value">上海辉通电子科技有限公司</span>
                </li>
                <li>
                    <span class="tit">税号</span>
                    <span class="value">91310117769697337T</span>
                </li>
                <li>
                    <span class="tit">发票内容</span>
                    <span class="value">运输服务 客运服务</span>
                </li>
                <li>
                    <span class="tit">发票金额</span>
                    <span class="value red">1892.2</span>
                </li>
                <li>
                    <span class="tit">申请时间</span>
                    <span class="value">2018-07-14 16:30:02</span>
                </li>
            </ul>
        </div>
        <div class="email-wrap">
            <ul class="list">
                <li >
                    <span class="tit">接收邮箱</span>
                    <span class="value">上yujr@phtons.com</span>
                </li>
            </ul>
        </div> -->
    </div>
</template>

<script>
export default {
    name: "detailed",
    components: {},
    data() {
        return {
            srcs:''
        };
    },
    computed: {
        //...mapState(['s'])
    },
    mounted() {
        this.getDetailed()
    },
    methods: {
        getDetailed(){
            let vm = this;
             vm.loadingOpen()
            vm.Api.viewInvoice(vm.$route.query.id).then(res=>{
                console.log(res)
                vm.srcs = res.data.data
            })
        }
    }
};
</script>

<style scoped lang="scss">
.page {
    box-sizing: border-box;
    // padding-top: 9px;
}
iframe{
    height: 100%;
    width: 100%;
}
.info-wrap {
    padding: 0 20px;
    background: #fff;
}
.email-wrap{
    padding: 0 20px;
    background: #fff;
    margin-top: 8px;
}
.list {
    li {
        height: 48px;
        box-sizing: border-box;
        border-bottom: 1px #f4f6fa solid;
        line-height: 48px;
        .tit {
            color: #bec2cc;
            font-size: 16px;
            height: 100%;
            margin-right: 23px;
        }
        .value {
            color: #3a4557;
            font-size: 15px;
            height: 100%;
        }
        .red {
            color: #ed3e35;
        }
    }
    li:last-child{
        border: none;
    }
}
</style>
