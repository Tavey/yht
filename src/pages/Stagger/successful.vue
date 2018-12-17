<template>
    <div class="page">
        <div class="top-banner">
            <div class="gou"></div>
            <div class="prompt">购买成功</div>
        </div>
        <div class="order-info">
            <div class="plate-wrap bor-b1">
                <span class="plate">{{infoData.palte}}</span>
            </div>
            <div class="address-wrap bor-b1">
                <span>停车点</span>
                <div class="place">{{infoData.name}}</div>
            </div>
            <div v-if="type==1" class="address-wrap bor-b1">
                <span>错峰时段</span>
                <div class="place">{{infoData.staggeringTime}}</div>
            </div>
             <div v-else class="address-wrap bor-b1">
                <span>包月时间</span>
                 <div class="place">{{infoData.startTime}} 至 {{infoData.endTime}}</div>
            </div>
            <div v-if="type==1" class="address-wrap bor-b1">
                <span>有效期</span>
                <div class="place">{{infoData.startTime}} 至 {{infoData.endTime}}</div>
            </div>
            <!-- <div class="time-wrap">
                <div class="left">
                    <div class="tag">开始</div>
                    <div v-if="type == 1" class="time">{{infoData.startTime[1]}} {{duan(infoData.startTime)}}</div>
                    <div v-else class="time">{{infoData.startTime[0]}}</div>
                    <div v-if="type == 1" class="date">{{infoData.startTime[0]}}</div>
                </div>
                <div class="right">
                    <div class="tag">结束</div>
                    <div v-if="type == 1" class="time">{{infoData.endTime[1]}} {{duan(infoData.endTime)}}</div>
                    <div v-else class="time">{{infoData.endTime[0]}}</div>
                    <div v-if="type == 1" class="date">{{infoData.endTime[0]}}</div>
                </div>
            </div> -->
        </div>
        <div class="but" @click="complete()">完成</div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    name: "index",
    components: {},
    data() {
        return {
            infoData: null,
            tit: {
                "1": "错峰",
                "2": "包月"
            },
            type: 1
        };
    },
     destroyed: function() {
        AlipayJSBridge.call("popWindow");
    },
    created() {
        this.type = this.$route.query.type;
        this.infoData = this.$route.query;
    },
    mounted() {
    },
    methods: {
        complete() {
            try {
                AlipayJSBridge.call("popWindow");
            } catch (error) {}
        },
        duan(str) {
            if (str.split(":")[0] > 12) {
                return "PM";
            } else {
                return "AM  ";
            }
        }
    }
};
</script>

<style scoped lang="scss">
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
    padding: 0 20px 0px 20px;
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
        font-weight: bold;
        .place {
            display: inline-block;
            color: #9dadbd;
            font-size: 15px;
            text-align: right;
            width: 260px;
            float: right;
        }
    }
    .text {
        color: #79808a;
        font-size: 16px;
        line-height: 48px;
    }
    .time-wrap {
        color: #2f2f33;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        .right {
            text-align: right;
        }
        .time {
            font-size: 24px;
            margin: 6px 0;
            line-height: 29px;
        }
        .date {
            line-height: 20px;
        }
        .tag {
            color: #bec2cc;
            line-height: 20px;
        }
    }
}
</style>

<style lang="stylus" scoped>
@import '../../assets/css/mixin.styl';

.top-banner {
    bg-image('../../assets/img/successful'); // 使用bg-image($url)函数 $url为变量：brand
    background-position: 100% 100%;
    background-size: 100%;
}
</style>