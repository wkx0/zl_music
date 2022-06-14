<template>
<div>
  <div
      class="asideSmallTitle"
  >
    <span>我的音乐</span>
  </div>
  <div
      class="asideBasis asideSpan"
      :class="{'asideActivate':activateIndex === index}"
      v-for="(tab,index) in tabs"
      :key="index"
      @click="clickMyMusic($event,index,tab)"
      @change="asideActivate=-2"
  >
    <i style="margin-right: 5px" :class="tab.icon"></i>
    <span>{{tab.title}}</span>
  </div>
</div>
</template>

<script>
export default {
  name: "MyMusic",
  data(){
    return {
      //选项卡数据
      tabs:[
        {title:'最近播放',icon:'el-icon-time',path:'/MusicHome/RecentPlaySong'},
        // {title:'我的音乐云盘',icon:'el-icon-cloudy'},
        // {title:'我的收藏',icon:'el-icon-folder-add'},
      ],

      //点击的顺序
      activateIndex : -1,
      isActive:false
    }
  },
  methods:{
    clickMyMusic(e,index,tab){
      if (!this.isActive){
        this.$bus.$emit('discovrMusicLeave')
        this.$bus.$emit("myMusicListLeave")
        this.isActive = true
        this.$router.push(tab.path)
      }
      this.activateIndex = index
    },
    myMusicLeave(){
      this.activateIndex = -2
      this.isActive = false
    }
  },
  mounted() {
    this.$bus.$on("myMusicLeave",this.myMusicLeave)
  }
}
</script>

<style scoped>
.asideSmallTitle{
  padding-left: 5px;
  line-height: 35px;
  border-radius: 6px;
  font-size: 13px;
  color: #aeaeae;
  font-weight: 100;
  margin-top: 13px;
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