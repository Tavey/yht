import Vue from 'vue';
import Router from 'vue-router';

//Phone
import indexPhone from '../pages/Phone/index.vue';
import bindPhone from '@/pages/Phone/bind';
import verificationPhone from '@/pages/Phone/verification';


//Plate
import plateIndex from '../pages/Plate/index';
import plateManagement from '../pages/Plate/list';
import plateBind from '../pages/Plate/bind';

//Invoice
import invoiceIndex from '../pages/Invoice/index';
import invoiceHistory from '../pages/Invoice/history';
import invoiceDetailed from '../pages/Invoice/detailed';
import invoiceManag from '../pages/Invoice/manag';
import nameList  from '../pages/Invoice/list'


//makeInvoice
import makeIndex from '../pages/makeInvoice/index';
import parking from '../pages/makeInvoice/parking';
import orderList from '../pages/makeInvoice/list';
import openInvoice from '../pages/makeInvoice/opne';
import endInvoice from '../pages/makeInvoice/end';
import addNamefrom from '../pages/makeInvoice/addNew'



//stagger
import staggrIndex from '../pages/Stagger/index';
import staggerList from '../pages/Stagger/list';
import staggerBuy from '../pages/Stagger/pay';
import choosePlate from '../pages/Stagger/plate';
import chooseCoupons from '../pages/Stagger/coupons';
import staggerFinish from '../pages/Stagger/successful';


//search
import searchIndex from '../pages/Search/index';
import searchIng from '../pages/Search/search';
import searchResults from '../pages/Search/results';
import searchMap from '../pages/Search/map';
import searchNear from '../pages/Search/near';

//pay
import payIndex from '../pages/pay/index';
import payOngoing from '../pages/pay/ongoing';
import paySuccess from '../pages/pay/success';
import Coupons from '../pages/pay/coupons';
import quick from '../pages/pay/quick';
import inputPlate from '../pages/pay/plate'

//card
import cardIndex from '../pages/Card/index';
import cardList from '../pages/Card/list';

import cardCoupons from '../pages/Card/coupons';

//clear
import clear from '../pages/clear/clear';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/clear',
            component: clear,
        },
        {
            path: '/card',
            component: cardIndex,
            children: [
                {
                    path: '/',
                    name: 'cardList',
                    component: cardList,
                    meta: {
                        title: '购买记录'
                    }
                },
            ]
        },
        {
            path: '/coupons',
            name: 'cardCoupons',
            component: cardCoupons,
            meta: {
                title: '优惠券'
            },
            
        },
        {
            path: '/phone',
            component: indexPhone,
            children: [
                {
                    path: '/',
                    name: 'bind',
                    component: bindPhone,
                    meta: {
                        title: '手机号登录'
                    }
                },
                {
                    path: 'verification',
                    name: 'verification',
                    component: verificationPhone,
                    meta: {
                        title: '手机号登录'
                    }
                },
            ]
        },
        {
            path: '/plate',
            component: plateIndex,
            children: [
                {
                    path: '/',
                    name: 'plateManagement',
                    component: plateManagement,
                    meta: {
                        title: '车牌管理'
                    }
                },
                {
                    path: 'bind',
                    name: 'plateBind',
                    component: plateBind,
                    meta: {
                        title: '添加车牌'
                    }
                },
            ]

        },
        {
            path: '/invoice',
            component: invoiceIndex,
            children: [
                {
                    path: '/',
                    name: 'invoiceHistory',
                    component: invoiceHistory,
                    meta: {
                        title: '开票历史'
                    }
                },
                {
                    path: 'detailed',
                    name: 'detailed',
                    component: invoiceDetailed,
                    meta: {
                        title: '发票详情'
                    }
                },
                {
                	path: 'list',
                	name: 'nameList',
                	component: nameList,
                	meta: {
                		title: '抬头管理'
                	}
                },
                
            ]
        },
        {
            path: '/makeInvoice',
            component: makeIndex,
            children: [
                {
                    path: '/',
                    name: 'manag',
                    component: invoiceManag,
                    meta: {
                        title: '发票管理'
                    }
                },
                {
                    path: 'choose',
                    name: 'parking',
                    component: parking,
                    meta: {
                        title: '选择停车场'
                    }
                },
                {
                    path: 'order',
                    name: 'order',
                    component: orderList,
                    meta: {
                        title: '停车订单'
                    }
                },
                {
                    path: 'open',
                    name: 'open',
                    component: openInvoice,
                    meta: {
                        title: '开票详情'
                    }
                },
                {
                    path: 'end',
                    name: 'endInvoice',
                    component: endInvoice,
                    meta: {
                        title: '开票详情'
                    }
                },
                {
                	path: 'add',
                	name: 'addNamefrom',
                	component: addNamefrom,
                	meta: {
                		title: '新增抬头'
                	}
                },
            ]
        },
        {
            path: '/stagger',
            component: staggrIndex,
            children: [
                {
                    path: '/',
                    name: 'list',
                    component: staggerList,
                    meta: {
                        title: '优会停'
                    },
                },
                {
                    path: 'buy',
                    name: 'buy',
                    component: staggerBuy,
                    meta: {
                        title: '优会停'
                    },
                },
                {
                    path: 'plate',
                    name: 'st-plate',
                    component: choosePlate,
                    meta: {
                        title: '车牌'
                    },
                },
                {
                    path: 'coupons',
                    name: 'coupons',
                    component: chooseCoupons,
                    meta: {
                        title: '优惠券'
                    },
                },
                {
                    path: 'finish',
                    name: 'finish',
                    component: staggerFinish,
                }

            ]
        },
        {
            path: '/search',
            component: searchIndex,
            children: [
                {
                    path: '/',
                    name: 'near',
                    component: searchNear ,
                    meta: {
                        title: '优会停'
                    },
                },
                {
                    path: 'search',
                    name: 'search',
                    component: searchIng,
                    meta: {
                        title: '优会停'
                    },
                },
                {
                    path: 'results',
                    name: 'results',
                    component: searchResults,
                    meta: {
                        title: '优会停'
                    },
                },
                {
                    path: 'map',
                    name: 'map',
                    component: searchMap,
                    meta: {
                        title: '优会停'
                    },
                },
                

            ]
        },
        {
            path: '/pay',
            component: payIndex,
            children: [
                {
                    path: '/',
                    name: 'pay',
                    component: payOngoing,
                    meta: {
                        title: '缴费'
                    },
                },
                {
                    path: 'success',
                    name: 'success',
                    component: paySuccess,
                    meta: {
                        title: '支付完成'
                    },
                },
                {
                    path: 'coupons',
                    name: 'coupons',
                    component: Coupons,
                    meta: {
                        title: '优惠券'
                    },
                },
                {
                    path: 'quick',
                    name: 'quick',
                    component: quick,
                    meta: {
                        title: '快捷支付'
                    },
                },
                 {
                    path: 'inplate',
                    name: 'inplate',
                    component: inputPlate,
                    meta: {
                        title: '输入车牌'
                    },
                }
            ]

        },

        
    ]
})

