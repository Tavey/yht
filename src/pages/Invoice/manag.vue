<template>
    <div class="page">
        <ul class="list">
            <li @click="goToOrder">
                <span>选择停车场</span>
                <i class="mint-cell-allow-right"></i>
            </li>
            <li @click="goToHistory">
                <span>发票历史</span>
                <i class="mint-cell-allow-right"></i>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "index",
    components: {},
    data() {
        return {
            destroyed:false
        };
    },
    computed: {
        //...mapState(['s'])
    },
    mounted() {
        // localStorage.clear()
    },
    destroyed: function() {
        try {
            if (!this.destroyed) {
                AlipayJSBridge.call("popWindow");
            } else {
                next();
            }
        } catch (error) {}
    },
    methods: {
        goToOrder() {
            this.destroyed = true
            this.$router.push({ path: "makeInvoice/choose" });
        },
        goToHistory() {
            this.destroyed = true
            this.$router.push({ path: "/invoice"});
        },

    }
};
</script>

<style scoped lang="scss">
.page {
    box-sizing: border-box;
    padding-top: 9px;
}
.list {
    background: #fff;
    padding: 0 20px;
    li {
        height: 48px;
        box-sizing: border-box;
        border-bottom: 1px #f4f6fa solid;
        line-height: 48px;
        font-size: 16px;
        position: relative;
        color: #3a4557;
    }
}
li:nth-last-child() {
    border: none;
}
</style>
<style>
.mint-cell-allow-right::after {
    right: 0px;
    height: 7px;
    width: 7px;
}
</style>