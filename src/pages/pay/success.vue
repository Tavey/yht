<template>
    <div class="page">
        <div class="top-banner">
            <div class="gou"></div>
            <div class="prompt">场库缴费成功</div>
        </div>
        <div class="order-info">
            <div class="plate-wrap bor-b1">
                <span class="plate">{{info.palte}}</span>
            </div>
            <div class="address-wrap bor-b1">
                <span>停车点</span>
                <div class="place">{{info.name}}</div>
            </div>
             <div class="address-wrap">
                <span>结算时间</span>
                <div class="place">{{info.time}}</div>
            </div>
        </div>
        <div class="warm-prompt">*请在{{info.freeMinute}}分钟内离开场库，如超时将会重新</div>
        <div class="but bottoms" @click="complete()">完成</div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    name: "success",
    components: {},
    data() {
        return {
            info:null
        };
    },
    created(){
        this.info = this.$route.query;
        console.log(this.info)
    },
    computed: {
        //...mapState(['s'])
    },
    mounted() {},
    methods: {
        complete(){
            try {
                AlipayJSBridge.call('popWindow');
            } catch (error) {
                
            }
        }
    }
};
</script>

<style scoped lang="scss">
.page{
    font-family:"微软雅黑";
}
.top-banner {
    height: 217px;
    padding-top: 46px;
    box-sizing: border-box;
}
.gou {
    margin: 0 auto;
    height: 34px;
    width: 49px;
    background: url("../../assets/img/gou.png") no-repeat;
    background-size: 100%;
}
.prompt {
    text-align: center;
    color: #fff;
    font-size: 24px;
    margin-top: 19px;
}
.order-info {
    padding: 0 20px 0 20px;
    background: #fff;
    margin-bottom: 7px;
    .mint-cell {
        height: 68px;
    }
    .plate-wrap {
        position: relative;
        height: 68px;
        line-height: 68px;
    }
    .plate {
        color: #2f2f33;
        font-size: 22px;
    }
    .address-wrap {
        height: 48px;
        line-height: 48px;
        font-size: 16px;
        color: #79808a;
        .place {
            float: right;
            display: inline-block;
            color: #9dadbd;
            font-size: 15px;
            text-align: right;
            width: 260px;
        }
    }
}
.warm-prompt{
    color: #CCCCCC;
    font-size: 12px;
    text-align: left;
    padding-left: 20px;
    line-height: 17px;
    margin-top: 7px;
}
.but{
    // margin-top: 107px;
}
.bottoms{}
</style>

<style lang="stylus" scoped>
@import "../../assets/css/mixin.styl"   
.top-banner {
    bg-image('../../assets/img/successful') // 使用bg-image($url)函数 $url为变量：brand
    background-position: 100% 100%;
    background-size:100%;
}
</style>