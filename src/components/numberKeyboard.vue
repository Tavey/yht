<template>
    <div :class="{iosx:iosX}">
        <div class="keyboard">
            <!-- <div class="keys" v-for="(region,index) in number" @click="upload(region,1)">{{region}}</div> -->
            <mt-button type="default" class="keys" v-for="(region,index) in number" @click="upload(region,1)" :key="index">{{region}}</mt-button>
            <!-- <div class="delete" @click="upload('',2)"></div> -->
            <mt-button type="default" class="delete" @click="upload('',2)"></mt-button>
        </div>
        
    </div>
</template>

<script>
import { NUMBER } from "@/consts";
export default {
    components: {},
    data() {
        return {
            number: NUMBER,
            iosX: window.isIOS
        };
    },
    mounted() {},
    methods: {
        upload(str,type) {
            let data = {
                type: type,
                str: str
            };
            this.$emit("setInfo", data);
        }
    }
};
</script>

<style scoped lang="scss">
.keyboard {
    width: 100%;
    height: 216px;
    background: #d2d5db;
    box-sizing: border-box;
    padding: 7px 6px 3px 6px;
}
.keys{
    float: left;
    background: #fff;
    height: 46px;
    width: 117px;
    box-shadow: 0px 1px 0px #888888;
    line-height: 46px;
    text-align: center;
    margin-right:6px;
    border-radius: 5px;
    color: #000000;
    font-size: 25px;
    margin-bottom: 7px;
}
.keys:nth-child(3n + 0) {
    margin-right: 0;
}
.keys:nth-child(10){
    margin-bottom: 0;
    margin-left:123px;
}
.delete {
    height: 43px;
    width: 115.5px;
    display: inline-block;
    background: url("../assets/img/det.png") no-repeat;
    background-size: 23px 18px;
    background-position: 50px 13px;
    position: absolute;
    right: 6px;
    top: 168px;
    border-radius: 4px;
    overflow: hidden;
    box-sizing: border-box;
    border: none;
}
.iosx{
    padding-bottom: 34px;
    background: #d2d5db;
}

</style>
