import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions';
import mutations from './mutations';
import { handleStore } from './plugin'

Vue.use(Vuex)


const state = {
    hisRecord: [],
    userInfo: {
        // phone: '13524530886',
        // accessToken: "1714f8c6-5607-45e6-9b16-a81327e83642",
        phone: '',
        accessToken: "",
    },

};
const single = {
    plate: null,
    coupons: null,
    invoice: null,
    leavetyr:false
}

const Store = new Vuex.Store({
    state,
    single,
    actions,
    mutations,
    plugins: [
        handleStore     //在这里设置一些默认值
    ]
});


export default Store
