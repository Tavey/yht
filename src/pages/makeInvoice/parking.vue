<template>
    <div class="page">
        <div class="scroll-wrap">
            <ul class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="20">
                <li v-for="(item,index) in parkList" @click="goToList(item)" :key="index">
                    <span>{{item.parkName}}</span>
                    <i class="mint-cell-allow-right"></i>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
import qs from "qs";
export default {
    name: "index",
    components: {},
    data() {
        return {
            page: {
                currentPage: 1,
                pageSize: 20,
            },
            parkList:[],
            load:true
        };
    },
    computed: {
        //...mapState(['s'])
    },
    created() {
       
    },
    mounted() {},
    methods: {
        getpark() {
            let vm = this;
            vm.loadingOpen();
            vm.invoiceParkList(vm.page).then(res => {
                vm.parkList = vm.parkList.concat(res.data.data)
                if(res.data.data.length <20){
                    vm.load = false
                }else{
                    vm.page.currentPage  +=1
                }
                if(vm.parkList.length == 0){
                    vm.message("暂无可开票停车场", function() {});
                }
                
            });
        },
        invoiceParkList(info) {
            return this.Api.invoiceParkList(info);
        },
        goToList(item) {
            this.$router.push({ 
                path: "order" ,
                query:{
                   parkCode:item.parkCode,
                   invoiceType:item.invoiceType
                }
            });
        },
        loadMore() {
            if(this.load){
                this.getpark();
            }
            
        },
    }
};
</script>

<style scoped lang="scss">
.page {
    box-sizing: border-box;
    padding-top: 9px;
}
.list {
    background: #fff;
    padding: 0 20px;
    li {
        height: 48px;
        box-sizing: border-box;
        border-bottom: 1px #f4f6fa solid;
        line-height: 48px;
        font-size: 16px;
        position: relative;
        color: #3a4557;
    }
}
li:nth-last-child() {
    border: none;
}
</style>
<style>
.mint-cell-allow-right::after {
    right: 0px;
    height: 7px;
    width: 7px;
}
</style>
