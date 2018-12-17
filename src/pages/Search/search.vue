<template>
    <div class="page">
        <div class="search-wrap ellipse" @click="aler()">
            <div class="mintui-ic"></div>
            <el-autocomplete class="input"   ref="searchInt" v-model="keywords" :fetch-suggestions="querySearchAsync" :trigger-on-focus="false" placeholder="请输入内容" @select="handleSelect" hide-loading>
                <template slot-scope="{ item }">
                    <div class="sele">
                        <div class="iocn sea"></div>
                        <div class="item-info-wrap">
                            <div class="name">{{item.name}}</div>
                            <!-- <div class="distance">{{item.distance}}</div> -->
                            <div class="address">{{item.cityname}}-{{item.adname}}-{{item.address}}</div>
                        </div>
                    </div>
                </template>
            </el-autocomplete>
            <!-- <input class="input" v-model="value" placeholder="您想停在哪里？"> -->
        </div>
        <div v-if="loadings" class="loadings"><mt-spinner type="fading-circle"></mt-spinner></div>
        <div class="cancel" @click="cancel()">取消</div>
        <div v-if="hisRecord&&hisRecord.length>0" class="historical">
            <div class="tit">历史记录</div>
            <ul class="list">
                <li @click="handleSelect(item)" v-for="(item,index) in hisRecord" class="ellipse">{{item.name}}</li>
            </ul>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import * as types from "@/store/types";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    name: "index",
    components: {},
    data() {
        return {
            keywords: "",
            timeout: null,
            arrary: [],
            loadings:false,
        };
    },
    computed: {
        ...mapState({
            hisRecord: state => state.hisRecord
        })
    },
    mounted() {
        this.$nextTick(function(){
            this.aler()
        })
    },
    methods: {
        ...mapMutations({
            setHisRecord: types.global.mutations.SET_HISTORICAL_RECORD
        }),
        aler(){
            document.querySelector('.el-input__inner').focus();
        },
        querySearchAsync(queryString, cb) {
            let vm = this;
            vm.loadings = true;
            vm.mapAutoComplete(queryString).then(res => {
                    if (res.status == 200) {
                        let data = res.data.pois;
                        if (data && data.length > 0) {
                            let origins = data.map(v => {
                                return v.location;
                            });
                            origins = origins.join("|");
                            let collection = data.map(v => {
                                v.value = v.name;
                                return v;
                            });
                            clearTimeout(vm.timeout);
                            vm.timeout = setTimeout(() => {
                                vm.loadings = false;
                                cb(collection);
                            }, 1000);
                        } else {
                            vm.toasts("没有匹配到相关位置信息！");
                            vm.loadings = false;
                            cb([]);
                        }
                    }
                })
        },
        handleSelect(item) {
            let vm = this;
            if (!vm.IsInArray(item.location)) {
                vm.setHisRecord({
                    name: item.name,
                    location: item.location,
                    cityAdcode:item.adcode
                });
            }
            this.$router.push({
                path: "results",
                query: {
                    name: item.name,
                    location: item.location,
                    cityAdcode:item.adcode
                }
            });
        },
        IsInArray(val) {
            if (!this.hisRecord) {
                return false;
            }
            if (this.hisRecord && this.hisRecord.length > 0) {
                for (let i = 0; i < this.hisRecord.length; i++) {
                    if (val == this.hisRecord[i].location) {
                        return true;
                    }
                }
            } else {
                return false;
            }
        },
        mapAutoComplete(keywords) {
            return this.Api.mapAutoComplete(keywords);
        },
        // getDistance(origins, destination){

        //     this.distance(origins,destination).then( res =>{
        //         console.log(res);
        //         if(res.status == 200){
        //              let data =  await res.data.results
        //              return data;
        //         }

        //     }).catch((err) => {

        //     });
        // },
        distance(origins, destination) {
            return this.Api.distance(origins, destination);
        },
        cancel() {
            this.keywords = "";
        }
    }
};
</script>

<style scoped lang="scss">
.page {
    height: 100%;
    background: #fff;
    padding: 18px 20px 0 20px;
    box-sizing: border-box;
}
.search-wrap {
    width: 295px;
    height: 44px;
    background: #f9f9f9;
    line-height: 44px;
    padding-left: 20px;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    border: 1px solid #E9EAEE;
}
.cancel {
    position: absolute;
    right: 0;
    top: 18px;
    font-size: 14px;
    color: #bdbdbd;
    height: 44px;
    width: 60px;
    text-align: center;
    line-height: 44px;
}
.loadings{
    position: absolute;
    right:70px;
    top: 27px;
}
.distance {
    color: #79808a;
    font-size: 13px;
    position: absolute;
    right: 0;
    top: 16px;
}
.mintui {
    font-size: 20px;
    color: #bebebe;
    position: absolute;
}
.input {
    border: 0px;
    height: 100%;
    width: 240px;
    background: #f9f9f9;
    font-size: 17px;
    line-height: 44px;
    margin-left: 10px;
}
.historical {
    margin-top: 24px;
}
.tit {
    color: #1a1a1a;
    font-size: 18px;
    line-height: 25px;
}
.list {
    li {
        display: inline-block;
        background: #f4f4f4;
        height: 26px;
        padding: 0 8px;
        font-size: 13px;
        color: #898f95;
        line-height: 26px;
        margin-right: 14px;
        margin-top: 12px;
    }
}

.sele {
    // height: 66px;
    padding-left: 27px;
    box-sizing: border-box;
    position: relative;
    .iocn {
        height: 14px;
        width: 14px;
        position: absolute;
        left: 0;
        top: 27px;
    }
    .sea {
        background: url("../../assets/img/search.png") no-repeat;
        background-size: 100%;
    }
    .his {
        background: url("../../assets/img/once.png") no-repeat;
        background-size: 100%;
    }
    .item-info-wrap {
        height: 100%;
        border-bottom: 1px solid #f4f4f4;
        padding-top: 16px;
        box-sizing: border-box;
        .name {
            color: #1a1a1a;
            font-size: 14px;
            line-height: 14px;
        }
        .address {
            color: #79808a;
            font-size: 12px;
            line-height:20px;
            margin-top: 8px;
            padding:  0 0 10px 0;
        }
    }
}
.item-info-wrap:nth-last-child() {
    border: none;
}

input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #bdbdbd;
}

input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #bdbdbd;
}

input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #bdbdbd;
}

input:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #bdbdbd;
}
.mintui-ic {
    // color: #79808a;
    margin:  7px 0 0 3px;
    height: 30px;
    width: 30px;
    position: absolute;
    background: url('../../assets/img/icon-search.png');
    background-size: 100%;
}
</style>
<style scoped>
.page >>> .el-input {
    padding: 0 0 6px 0;
    box-sizing: border-box;
    height: 100%;
    width: 220px;
}
.page >>> .el-input__inner {
    border: 0px;
    height: 21px;
    width: 200px;
    background: #f9f9f9;
    font-size: 17px;
    line-height: 21px;
    padding: 0;
    position: absolute;
    left: 55px;
    top: 12px;
}
.page >>> .mint-searchbar-cancel {
    color: #bdbdbd;
}
.page >>> .el-autocomplete {
    display: inline-block;
}
</style>

