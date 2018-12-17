<template>
    <div class="page">
        <ul class="list">
            <li  v-for="(item,index) in page.list"   class="bor-b1" @click="backUp(item,index)" :key="index">
                <!-- <div class="">{{item.showName}}</div> -->
                <div class="padd">
                    <span>{{item.showName}}</span>
                    <div :class="{selected:current==index}" class="tick "></div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import qs  from 'qs'
import { PUBLIC } from "@/consts";
import * as types from "@/store/types";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    name: "plate",
    components: {},
    data() {
        return {
            page: {
                list: [],
                pageNo: 1,
                pageRowNo: 20
            },
            type:null,
            current: 0
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.userInfo,
            plateChoose: single => single.plate,
        })
    },
    created() {
        this.type = this.$route.query.type;
        this.getList();
    },
    mounted() {},
    methods: {
        ...mapMutations({
            setPlateChoose: types.global.mutations.SET_PLATE_CHOOSE,
        }),
        backUp(item, index) {
            let vm = this;
            this.current = index;
            window.plateChoose = item;
            // this.setPlateChoose(item);
            setTimeout(function(){
                vm.$router.back(-1)
            },500)
        },
        getList() {
            let vm = this;
            vm.loadingOpen();
            vm.carPlate(vm.userInfo.phone)
                .then(res => {
                    if (res.status == 200) {
                        vm.page.list = res.data.data.map(a => ({
                            ...a,
                            showName:
                                a.lpn.substr(0, 2) +
                                "·" +
                                a.lpn.substr(2, a.lpn.length)
                        }));
                        for (let i = 0; i < vm.page.list.length; i++) {
                            if(vm.page.list[i].showName == window.plateChoose.showName){
                                vm.current = i ;
                            }
                        }
                    }
                })
                .catch(err => {
                    vm.loadingClose();
                    console.log(err);
                });
        },
        carPlate(info) {
            return this.Api.carList(info);
        },
        deleteCar(index) {
            let vm = this;
            vm.loadingOpen();
            let info = {
                car_type: 0,
                car_number: vm.page.list[index].car_number
            };
            vm.Api.deleteCar(qs.stringify(info))
                .then(res => {
                    vm.loadingClose();
                    console.log(res);
                    if (res.status == 200) {
                        let data = res.data;
                        if (data.code == 0) {
                            vm.toasts("删除成功");
                            vm.getList()
                        } else {
                            vm.toasts(PUBLIC[data.code]);
                        }
                    } else {
                    }
                })
                .catch(err => {
                    vm.loadingClose();
                    console.log(err);
                });
        },
        leftButtonHandler(evt) {
            console.log(123);
        },
        default(info){
            return this.Api.default(
                info
            )
        }
    }
};
</script>

<style scoped lang="scss">
.page {
    padding-top: 9px;
    box-sizing: border-box;
    font-family: '微软雅黑';
}
ul {
    
    background: #fff;
    li {
        position: relative;
        height: 48px;
        line-height: 48px;
        font-size: 16px;
    }
    .padd{
        padding: 0 20px;
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

</style>
<style scoped>
.page>>>.mint-cell-title .mint-cell-text{
    margin-left: 20px;
}
</style>
