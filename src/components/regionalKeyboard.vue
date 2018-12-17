<template>
    <div class="wrap" :class="{iosx:iosX}">
        <div class="rb keyboard">
            <!-- <div class="keys" v-for="(region,index) in regional" @click="upload(region,1)">{{region}}</div> -->
             <mt-button class="keys"  type="default" v-for="(region,index) in regional" @click="upload(region,1)" :key="index">{{region}}</mt-button>
        </div>
    </div>
</template>

<script>
import { REGIONAL_KEYBOARD, NUMBER_KEYBOARD, LETTER_KEYBOARD } from "@/consts";
export default {
    // props: {
    //     show: {
    //         type: Boolean,
    //         required: false,
    //     }
    // },
    components: {},
    data() {
        return {
            regional: REGIONAL_KEYBOARD,
            number: NUMBER_KEYBOARD,
            letter: LETTER_KEYBOARD,
            iosX: window.isIOS
        };
    },
    mounted() {
    },
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
    background: #d2d5db;
}
.wrap{
    width:  100%;
}
.rb {
    height: 225px;
    padding: 10px 3px 0 3px;
    box-sizing: border-box;
}
.down {
    height: 42px;
    background: #fff;
    line-height: 42px;
    text-align: right;
    font-size: 20px;
    color: #030303;
    padding-right: 10px;
}
.keys {
    width: 31.4px;
    height: 42px;
    box-sizing: border-box;
    display: inline-block;
    margin: 0 6px 12px 0;
    background: #fff;
    border-radius: 5px;
    text-align: center;
    line-height: 42px;
    font-size: 20px;
    color: #030303;
    box-shadow: 0px 1px 0px #888888;
}
.delete {
    height: 42px;
    width: 42px;
    display: inline-block;
    background: url("../assets/img/delete.png") no-repeat 100%;
    position: absolute;
    right: 3px;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0px 1px 0px #888888;
}
.keys:nth-child(10n + 0) {
    margin-right: 0;
}
.iosx{
    padding-bottom: 34px;
    background: #d2d5db;
}
</style>
