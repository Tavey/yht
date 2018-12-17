<template>
    <div class="page">
        <iframe  id="ifa" :src="`https://m.amap.com/search/mapview/keywords=${keywords}&daddr=${daddr}&types=150907&city=${cityAdcode}`" frameborder="0"></iframe>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    name: "index",
    components: {},
    data() {
        return {
            keywords:'',
            daddr:'',
            cityAdcode:''
        };
    },
    created(){
        let vm = this;
        vm.keywords = vm.$route.query.name+ vm.$route.query.addr;
        vm.daddr = vm.$route.query.location,
        vm.cityAdcode = vm.$route.query.cityAdcode
        // console.log(vm.$route.query)
    },
    mounted() {
        
    },
    methods: {
    }
};
</script>

<style scoped lang="scss">
iframe{
    height: 100%;
    width: 100%;
}
</style>
