<template>
 <div class="page">
     <div class="notice-wrap">
         <div class="img"></div>
         <div class="text">发票已申请，请注意您的邮箱</div>
         <div class="email">{{email}}</div>
         <div class="help">如未收到请联系客服</div>
     </div>
     <div class="but bor2" @click="complete()">完成</div>
 </div>
</template>

<script>
 export default {
   name:'end',
   components: {

   },
   data() {
     return {
         email:''
     }

   },
   created(){
       this.email = this.$route.query.email;
   },
   methods: {
       complete(){
            try {
                AlipayJSBridge.call('popWindow');
            } catch (error) {
                
            }
        }
   }
 }
</script>

<style scoped lang="scss">
.img{
    height: 72px;
    width: 72px;
    background: url('../../assets/img/cg.png') no-repeat;
    background-size: 100%;
    margin:  0 auto;
}
.notice-wrap{
    background: #fff;
    height: 227px;
    padding-top: 44px;
    box-sizing: border-box;
    text-align: center;
}
.text{
    margin-top:6px;
    font-size: 16px;
    color: #2F2F33;
} 
.email{
    margin-top:6px;
    font-size:22px;
    color: #2F2F33;
    font-weight: 500;
}
.help{
    margin-top:6px;
    font-size: 15px;
    color: #9B9B9B;
}
</style>
