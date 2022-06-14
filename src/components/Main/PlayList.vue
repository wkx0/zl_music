<template>
  <div class="playListBlock" >
    <div>
      <div class="title">
        <span style="font-size: 18px; font-weight: 600;">当前播放</span>
      </div>
      <div class="title2Block">
        <div class="title2Left">总{{playListCount}}首</div>
        <div class="title2Button">
            <el-button
            size="mini"
            type="text">
              收藏全部
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="cleanSongs"
            >
              清空列表
            </el-button>
        </div>
      </div>
      <div class="playListItemList">
            <div class="playListItemBasic"
                 v-for="(songInfo,key,index) in playListKv"
                 :key="key"
                 @click="clickSong(songInfo.id)"
                 @dblclick="dbClickSong(songInfo.id)"
                 @mouseenter="showDelId=songInfo.id"
                 @mouseleave="showDelId=''"
            >
              <div class="playIcon">
                <i v-show="songInfo.id === playId" :class="playIcon"></i>
              </div>
              <div class="songName" show-overflow-tooltip>{{ songInfo.songName }}</div>
              <div class="singer" show-overflow-tooltip>{{songInfo.singer}}</div>
              <div class="delBut" >
                <i class="el-icon-delete"
                   @click="clickDel(songInfo.id,index)"
                   v-show="showDelId === songInfo.id"
                ></i>
              </div>
              <div class="songFinalTime">{{songInfo.duration}}</div>
            </div>
      </div>
    </div>
  </div>
</template>
<!--播放列表-->
<!--思路-->
<!--功能-->
<!--单机激活-->
<!--双击播放-->


<script>
export default {
  name: "PlayList",
  data(){
    return {
      showDelId:"",
    }
  },
  computed:{
    //播放列表
    playListKv(){
      return this.$store.state.playListKv
    },
    //歌曲数量
    playListCount(){
      return Object.keys(this.$store.state.playListKv).length;
    },
    //播放列表的id
    playId:{
      get(){
        return this.$store.state.playId
      },
      set(value){
        this.$store.commit("UpdatePlayId",value)
      }
    },
    playing(){
      return this.$store.state.playInfo.playing
    },
    //播放状态的icon
    playIcon(){
      return this.playing ? "iconfont icon-bofangqi-bofang" : "iconfont icon-24gf-pause2"
    }
  },
  methods:{
    //从列表删除
    clickDel(id,index){
      const delData = {
        "id":id,
        "index":index
      }
      this.$forceUpdate();
      this.$store.dispatch("deleteSong",delData)
    },
    cleanSongs(){
      this.$store.dispatch("deleteSongs")
    },
    //点击歌曲
    clickSong(id){
      console.log("被单机了",id)
    },
    dbClickSong(id){
      this.$store.commit("UpdatePlayId",id)
      console.log("被双击了",id)
    },
  },
  created() {
    this.$bus.$on("changePlaying",this.changePlaying)
  }
}
</script>

<style scoped>

.playListBlock{
  right: 0;
  top:60px;
  bottom:75px;
  width: 420px;
  z-index: 99;
  overflow: auto;
  overflow-y:scroll;
  position: absolute;
  background-color: white;
  border-left:1px solid #EBEEF5;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, .12)
}
.playListBlock::-webkit-scrollbar {/*滚动条整体样式*/
  width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
}
.playListBlock::-webkit-scrollbar-thumb{
  height: 5px;
  background-color: #aeaeae;
  border-radius: 3px;
}
/*当前播放字体样式*/
.title{
  height: 40px;
  line-height:40px;
  margin-left: 20px;
  margin-top: 15px;
  text-align: left;
}
.title2Block{
  display: flex;
  height: 30px;
  line-height:30px;
  margin-left: 20px;
  margin-right: 20px;
}
.title2Left{
  width:50%;
  font-size: 6px;
  text-align:left;
  color: #aeaeae
}
.title2Button{
  display:flex;
  height:30px;
  width:50%;
  line-height:30px;
  align-items: center;
  justify-content: flex-end;
}
.playListItemList{
  margin-top: 10px;
}
.playListItemBasic{
  display: flex;
  height: 35px;
  line-height: 35px;
}
.playListItemBasic:nth-child(2n+1){
  background-color: #aeaeae17;
}
.playListItemBasic:hover{
  background-color: #aeaeae36;
}
.songName{
  width: 50%;
  font-size: 10px;
  text-align: left;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.singer{
  width: 20%;
  font-size: 10px;
  text-align: left;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.songFinalTime{
  width: 10%;
  font-size: 10px;
  color: #aeaeae;
  text-align: left;
}
.playIcon{
  width: 20px;
  color: #E94D47;
  line-height: 31px;
  text-align: center;
}
.playIcon i{
  font-size: 12px;
}
.delBut{
  width: 10%;
}
.delBut i:hover{
  color: #E94D47;
}
</style>