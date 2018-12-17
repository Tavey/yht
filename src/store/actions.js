import * as types from './types';

export default {
    [types.global.actions.GET_OR_RECOVER_LOGIN_INFO]({state, commit}) {
        return new Promise(function (resolve, reject) {
            if (!state.userInfo.token) {
                let userInfo = null;
                if ((userInfo = localStorage.getItem('userInfo')) == null) {
                    reject(new Error());
                }
                userInfo = JSON.parse(userInfo);
                commit(types.global.mutations.SET_USER_INFO, userInfo);
            }
            resolve(state.userInfo);
        })
    },
}
