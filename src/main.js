// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './index'
import router from './router'
import '@/assets/css/reset.css'
import 'lib-flexible/flexible.js'

Vue.config.productionTip = false

import VueWechatTitle from 'vue-wechat-title';  
Vue.use(VueWechatTitle)

import Mint from 'mint-ui';
Vue.use(Mint);
import 'mint-ui/lib/style.css'; 

import { Progress,Autocomplete} from 'element-ui';
Vue.use(Progress)
Vue.use(Autocomplete)

import Api from "@/api/Api.js";
Vue.use(Api);



import base from './base'
Vue.use(base);

import store from "./store/index";

import fastclick from 'fastclick'
fastclick.attach(document.body)

import qs  from 'qs'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
