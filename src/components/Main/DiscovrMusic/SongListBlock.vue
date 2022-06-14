<template>
  <div>
    <div class="songListBlock">
      <div class="blockBasic"
           v-for="songListInfo in songListInfos"
           @click="clickPlayList(songListInfo)"
           :key="songListInfo.songListId"
      >
        <div class="bg"
             :style="{backgroundImage: 'url('+songListInfo.picUrl+'?param=200y200'+')' }"
             @mouseenter="showBtnId = songListInfo.songListId"
             @mouseleave="showBtnId = ''"
        >
          <div class="playCount">
              <i class="iconfont icon-24gl-play"></i>
              <span>{{songListInfo.playAmount.day | numToInteger}}</span>
          </div>
          <div class="playAllSong"
              @click.stop="clickPlayAllBtn(songListInfo.songListId)"
              v-show="showBtnId === songListInfo.songListId"
          >
            <el-button icon="iconfont icon-bofangqi-bofang" circle></el-button>
          </div>
        </div>
        <div style="text-align: left;font-size: 14px;font-weight: 400;margin-top: 5px">
          <span>{{songListInfo.songListName}}</span>
        </div>
      </div>
    </div>
  </div>

</template>
<!--歌单demo-->
<script>
import axios from "axios";
import {addSongsPlayAmount} from "../../../api/songList";

export default {
  name: "SongListBlock",
  props:["songListInfos"],
  data(){
    return {
      showBtnId:"",
      showPlayAllBtn:false,
    }
  },

  methods:{
    clickPlayList(songListInfo){
      this.$router.push({
        name:'SongListDetail',
        params:{
            songListInfo:songListInfo,
        }
      })
    },
    clickPlayAllBtn(id){
      const params = {
        songListId : id
      }
      addSongsPlayAmount(params).catch((error)=>{
        console.log(error)
      })
      this.getSongListDetail(id)
    },
    //初始化table
    initTableInfo(songListDetailInfo){
      //遍历歌单信息中的歌曲信息
      songListDetailInfo.tracks.forEach(
          (songInfo)=>{
            let songObj = {
              //歌曲 id
              id : songInfo.id,
              //url
              url:"",
              //专辑
              album: songInfo.al.name,
              //封面图片
              picUrl:  songInfo.al.picUrl,
              // 歌手
              singer: songInfo.ar[0].name,
              // 是否收藏
              operate: false,
              // 歌名
              songName: songInfo.name,
              //时长
              duration: this.$timeToString(songInfo.dt/1000),
            }
            // if (index===0){
            //   this.$store.commit("UpdatePlayId",songInfo.id)
            // }
            this.$store.dispatch("pushSongToList",songObj)
          })

    },
    //获取歌单详细信息
    getSongListDetail(id){
      axios.get('/api/playlist/detail?id='+id)
      .then(response =>{
        let data = response.data;
        console.log("歌单的详细信息",data)
        this.initTableInfo(data.playlist)
      })
      .catch(error => {
        console.log(error);
      });
    },
  },
}
</script>

<style scoped>
/*整体的样式*/
.songListBlock{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.blockBasic{
  width: 19%;
  cursor: pointer;
  margin-bottom: 10px;

}
.bg{
  width: 200px;
  height: 200px;
  position: relative;
  border-radius:3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.playCount{
  color: white;
  font-size: 13px;
  text-align: right;
  padding-top: 5px;
  margin-right: 10px;

}
.playAllSong{
  right: 10px;
  bottom: 10px;
  position: absolute;
}
.playAllSong button{
  padding: 5px 5px;
}
/deep/ .playAllSong i {
  font-size: 22px;
  color: #E94D47;
}
</style>
