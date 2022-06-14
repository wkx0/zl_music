<template>
<div style="height: 130px;">
  <div
      class="asideBasis asideTitle"
      :class="{'asideActivate':activateIndex === -1}"
      @click="clickDiscovrMusic($event,-1)"
      @change="asideActivate=-2"
  ><span>发现音乐</span></div>
<!--  <div-->
<!--      class="asideBasis asideSpan"-->
<!--      :class="{'asideActivate':activateIndex === index}"-->
<!--      v-for="(tab,index) in tabs"-->
<!--      :key="index"-->
<!--      @click="clickDiscovrMusic($event,index)"-->
<!--      @change="asideActivate=-2"-->
<!--  ><span>{{tab}}</span></div>-->
</div>
</template>

<script>
export default {
  name: "DiscovrMusic",
  data(){
    return {
      //选项卡数据
      tabs:['博客','视频','朋友'],
      //点击选项卡的顺序
      activateIndex:-1,
      //是否在操作本组件
      isActive:false
    }
  },methods:{
    clickDiscovrMusic(e,index){
      if(!this.isActive){
        this.$bus.$emit("myMusicLeave")
        this.$bus.$emit("myMusicListLeave")
        this.isActive = true
      }
      this.activateIndex=index
      if (this.activateIndex===-1){
        this.$router.push('/MusicHome/DiscovrMusic')
      }
    },
    discovrMusicLeave(){
      // console.log('不点我了')
      this.activateIndex=-2
      this.isActive =false
    }
  },
  mounted() {
    this.$bus.$on('discovrMusicLeave',this.discovrMusicLeave)
  }
}
</script>

<style scoped>
.asideTitle{
 font-size: 17px;
  font-weight: 700;
  margin-top: 13px;
  /*background-color: #F6F6F7;*/
}
.asideBasis{
  cursor:pointer;
  padding-left: 5px;
  line-height: 35px;
  border-radius: 6px;

}
.asideSpan{
  margin-top: 2px;
}
.asideBasis:hover{
  background-color: #F6F6F7;
}
.asideActivate{
    background-color: #F6F6F7;
}
</style>