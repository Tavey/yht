import { Indicator } from 'mint-ui';
import { Toast } from 'mint-ui';
import { MessageBox } from 'mint-ui';
import router from './router'
export default {
    install(Vue, options) {
        Vue.prototype.nad = function () {

        };
        Vue.prototype.loadingOpen = function (str) {
            Indicator.open(
                {
                    spinnerType: 'fading-circle'
                }
            );
        };
        Vue.prototype.loadingClose = function () {
            Indicator.close();
        };
        Vue.prototype.gotoRouter = function (str) {
            router.go(-1)
            // this.$router.push({
            //     path:'phone'
            // })
        };
        Vue.prototype.toasts = function (str) {
            try {
                AlipayJSBridge.call('toast', {
                    content: str,
                    duration: 3000
                }, function () {
                    
                });
            } catch (error) {
                Toast({
                    message: str,
                    position: 'middle',
                    duration: 3000
                });
            }


        };
        Vue.prototype.message = function (str, fun) {
            MessageBox.alert(str).then(action => {
                fun()
            });
        };
        Vue.prototype.confirm = function (str, fun1, fun2) {

            MessageBox.confirm('', {
                message: '支付未完成',
                title: '提示',
                showConfirmButton: true,
                showCancelButton: true,
                cancelButtonClass: 'cancelButton',
                confirmButtonClass: 'confirmButton',
                confirmButtonText: '确定',
                cancelButtonText: '订单有疑问'
            }).then(action => {
                if (action == 'confirm') {//点击确定的回调

                }
            }).catch(err => {
                if (err == 'cancel') {//点击暂不的回调
                    fun2()
                }
            });
        };
        Vue.prototype.$setgoindex = function () {
            if (window.history.length <= 1) {
              if (location.href.indexOf('?') === -1) {
                window.location.href = location.href + '?goindex=true'
              } else if (location.href.indexOf('?') !== -1 && location.href.indexOf('goindex') === -1) {
                window.location.href = location.href + '&goindex=true'
              }
            }
          }

    }

}
