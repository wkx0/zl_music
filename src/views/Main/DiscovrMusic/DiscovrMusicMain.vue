<template>
  <div class="mainBlock" ref="mainBlock">
    <DiscovrMusicHeader :active="1"></DiscovrMusicHeader>
    <!--    二级路由-->
    <keep-alive>
      <router-view style="width: 85%;margin: 0 auto;"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import DiscovrMusicHeader from "../../../components/Main/DiscovrMusic/DiscovrMusicHeader";
export default {
  name: "DiscovrMusicMain",
  components:{
    DiscovrMusicHeader,
  },
  created() {
  },
  mounted() {

    console.log(this.$route.path)
  }
}
</script>

<style scoped>

</style>