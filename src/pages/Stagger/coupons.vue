<template>
    <div class="page">
        <div
            class="noCoup"
            @click="noCoup"
        >
            不使用优惠券
        </div>
        <ul>
            <li
                v-for="(item,index) in list"
                @click="backUp()"
                :key="index"
            >
                <div class="money">
                    <div class="small">￥</div>
                    <div class="big">10</div>
                </div>
                <div class="info">
                    <div class="name">{{item.name}}</div>
                    <div class="time">{{item.dead_time}}</div>
                </div>
            </li>
        </ul>
        <!-- <mt-cell-swipe
        title="标题文字"
        :right="[
            {
            content: 'Delete',
            style: { background: 'red', color: '#fff' },
            handler: () => this.$messagebox('delete')
            }
        ]"></mt-cell-swipe> -->
    </div>
</template>

<script>
import * as types from "@/store/types";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    name: "index",
    components: {},
    data() {
        return {
            list: []
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo
        })
    },
    mounted() { },
    created() {
        this.getList()
    },
    methods: {
        ...mapMutations({
            setPlateChoose: types.global.mutations.SET_PLATE_CHOOSE
        }),
        backUp(item, index) {
            this.current = index;
            this.setPlateChoose(item);
            setTimeout(() => {
                this.$router.back(-1);
            }, 100);
        },
        noCoup() {
            this.setPlateChoose(null);
            setTimeout(() => {
                this.$router.back(-1);
            }, 100);
        },
        getList() {
            let vm = this;
            vm.loadingOpen();
            let info = {
                currentPage: 1,
                pageSize: 20,
                status: '1',
                phone: vm.$route.query.phone
            }
            vm.activelist(info).then(res => {
                vm.loadingClose();
                console.log(res);
                if (res.status == 200) {
                    vm.list = res.data.couponList;
                }
            })
                .catch(err => {
                    vm.loadingClose();
                    console.log(err);
                });
        },
        activelist(userInfo) {
            return this.Api.activelist(userInfo);
        }
    }
};
</script>

<style scoped lang="scss">
.page {
    padding-top: 9px;
    box-sizing: border-box;
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
        padding: 0 40px;
        background: #fff;
        margin-bottom: 8px;
        height: 56px;
        line-height: 56px;
        font-size: 16px;
        padding-top: 11px;
        box-sizing: border-box;
        .money {
            display: inline-block;
            color: #ff0024;
            padding-left: 15px;
            position: relative;
            height: 35px;
            div {
                display: inline-block;
            }
        }
        .small {
            line-height: 25px;
            font-size: 15px;
            position: absolute;
            left: 0;
            top: 0;
        }
        .big {
            font-size: 30px;
            line-height: 35px;
            position: absolute;
            left: 15px;
            top: 0;
        }
        .info {
            position: absolute;
            left: 125px;
            top: 0;
            height: 100%;
            width: 200px;
            padding-top: 13px;
            box-sizing: border-box;
            .name {
                font-size: 15px;
                color: #2f2f33;
                line-height: 15px;
            }
            .time {
                color: #9dadbd;
                line-height: 10px;
                font-size: 10px;
                margin-top: 6px;
            }
        }
    }
}
</style>
