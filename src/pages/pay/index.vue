<template>
  <div class="index">
    <router-view v-wechat-title="$route.meta.title"></router-view>
  </div>
</template>

<script>
export default {
  name: "index"
};
</script>

<style>
</style>
