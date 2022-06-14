<template>
<div>
  <div
      class="asideSmallTitle"
  >
    <span>创建的歌单</span>
  </div>
  <div
      class="asideBasis asideSpan"
      :class="{'asideActivate':activateIndex === index}"
      v-for="(tab,index) in tabs"
      :key="index"
      @click="clickMyMusicList($event,index,tab)"
  >
    <i style="margin-right: 5px" :class="tab.icon"></i>
    <span>{{tab.title}}</span>
  </div>
</div>
</template>

<script>
import {getMySongListTab} from "../../api/mySongList";
export default {
  name: "MyMusicList",
  data(){
    return {
      tabs:[
      ],
      activateIndex:-1,
      isActive:false,
    }
  },methods:{
    //获取 用户创建的歌单

    getMySongList(){
      getMySongListTab({
        id:this.$store.state.user.userId
      }).then((res)=>{
        let mySongList = res.data.data
        let newTabs = []
        mySongList.forEach((songs)=>{
          console.log(songs)
          if (songs.songListName === "我喜欢的音乐"){
            this.$store.commit("UpdateLoveSongListId",songs.songListId)
            newTabs.push({title:'我喜欢的音乐',icon:'iconfont icon-aixin',name:'MySongList',songs:songs},)
          }else {
            newTabs.push({title:songs.songListName,icon:'iconfont icon-gedan',name:'MySongList',songs:songs})
          }
        })
        this.tabs = newTabs
      }).catch((error)=>{
        console.log(error)
      })
    },
    clickMyMusicList(e,index,tab){
      console.log("dianjile1",this.isActive)

      if(!this.isActive){
        this.$bus.$emit("myMusicLeave")
        this.$bus.$emit("discovrMusicLeave")
        // this.isActive = true
        this.$router.push({ name: 'MySongList', params: { songs: tab.songs }})
        this.$bus.$emit("refreshMySongListDetailPage",tab.songs)
        // console.log("dianjile")
      }
      this.activateIndex=index
    },
    myMusicListLeave(){
      this.activateIndex = -2
      this.isActive =false
    }
  },
  mounted() {
    this.getMySongList()
    this.$bus.$on('myMusicListLeave',this.myMusicListLeave)
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
