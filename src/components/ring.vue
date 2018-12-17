<template>
    <div class="progress " :class="[classN]">
        <el-progress type="circle" :troke-width="7" :show-text="false" :percentage="percen" :color="color[num]"></el-progress>
    </div>
</template>

<script type="text/ecmascript-6">
import { STAGGER_TYPE, COLOR } from "@/consts";
export default {
    props: {
        percen: {
            type: Number,
            required: false
        }
    },
    name: "huan",
    data() {
        return {
            title: STAGGER_TYPE,
            color: COLOR,
            classN: "",
            num: null
        };
    },
    created() {
        if (this.percen <= 100 && this.percen >= 80) {
            this.classN = "green";
            this.num = 1
        } else if (this.percen < 80 && this.percen >= 25) {
            this.classN = "yellow";
            this.num = 2;
        } else if (this.percen < 25 && this.percen >= 0) {
            this.classN = "red";
            this.num = 3;
        } else {
            this.num = 4;
        }
    },
    computed: {
        //...mapState(['s'])
    },
    mounted() {},
    methods: {}
};
</script>

<style scoped lang="scss">
.progress {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 12px;
    top: 14px;
}
</style>
<style scoped>
.progress >>> .el-progress-circle {
    width: 30px !important;
    height: 30px !important;
}

.red >>> .el-progress-circle__track {
    stroke: rgb(249, 33, 87) !important;
    opacity: 0.3;
}
.green >>> .el-progress-circle__track {
    stroke: rgb(15, 241, 7) !important;
    opacity: 0.3;
}
.yellow >>> .el-progress-circle__track {
    stroke: rgb(235, 245, 42) !important;
    opacity: 0.5;
}

.progress >>> .el-progress-circle__path {
    stroke-width: 8px !important;
}
</style>

