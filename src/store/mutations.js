import * as types from './types';

export default {
    [types.global.mutations.SET_USER_INFO](state, obj) {
        state.userInfo = obj;
    },
    [types.global.mutations.SET_HISTORICAL_RECORD](state, obj) {
        if(state.hisRecord&&state.hisRecord.length >= 10){
            state.hisRecord.shift();
        }
        state.hisRecord.push(obj)
    },
    [types.global.mutations.SET_PLATE_CHOOSE](single, obj){
        single.plate = obj;
    },
    [types.global.mutations.SET_COUPONS_CHOOSE](single, obj){
        single.coupons = obj;
    },
    [types.global.mutations.SET_INVOICE](single, obj){
        single.invoice = obj;
    },
    [types.global.mutations.SET_BUYER](state, str){
        state.buyerId = str;
    },
    
    // [types.global.mutations.SET_LOGIN_INFO](state, loginInfo) {
    //     if (loginInfo == null) {
    //         loginInfo = {};
    //         localStorage.removeItem('loginInfo');
    //     } else {
    //         localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
    //     }
    //     state.loginInfo = loginInfo;
    // },
    // [types.global.mutations.HAS_LOGGED_ON](state, loginName) {
    //     if (loginName != null) {
    //         let hasLoggedOn = localStorage.getItem('hasLoggedOn');
    //         if (hasLoggedOn == null) {
    //             hasLoggedOn = {
    //                 nameArr: [loginName]
    //             }
    //             localStorage.setItem('hasLoggedOn', JSON.stringify(hasLoggedOn));
    //         } else {
    //             hasLoggedOn = JSON.parse(hasLoggedOn);
    //             if (hasLoggedOn.nameArr.indexOf(loginName) < 0) {
    //                 hasLoggedOn.nameArr.push(loginName);
    //                 localStorage.setItem('hasLoggedOn', JSON.stringify(hasLoggedOn));
    //             }
    //         }
    //     }
    // },
   
    
    
   
   
   
    
   
    
    
}
