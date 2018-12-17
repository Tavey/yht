<template>
    <div :class="{iosx:iosX}">
        <div class="lb keyboard">
            <div class="down" @click="upload('',4)">完成</div>
            <div class="n-wrap">
                <!-- <div class="keys" v-for="(num,index) in number" @click="upload(num,2)">{{num}}</div> -->
                <mt-button  class="keys"  v-for="(num,index) in number" @click="upload(num,2)" type="default" :key="index">{{num}}</mt-button>
            </div>
            <div class="l-wrap">
                <!-- <div class="keys" v-for="(lets,index) in letter" @click="upload(lets,2)"
                >{{lets}}</div> -->
                <mt-button type="default" class="keys" v-for="(lets,index) in letter" @click="upload(lets,2)" :key="index">{{lets}}</mt-button>
                <!-- <div class="delete" @click="upload('',3)"></div> -->
                <mt-button class="delete" @click="upload('',3)" type="default"></mt-button>
            </div>
            
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
.rb {
    height: 225px;
    padding: 10px 0px 0 3px;
}
.lb {
    height: 269px;
}
.n-wrap {
    padding: 10px 3px 2px 6px;
    border-bottom: 1px solid #b2b2bd;
    .keys {
        margin-bottom: 6px;
    }
}
.l-wrap {
    position: relative;
    padding: 8px 3px 0 6px;
    .keys {
    }
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
    width: 32px;
    height: 42px;
    display: inline-block;
    margin: 0 5px 12px 0;
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
