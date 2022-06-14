<template>
<div style="width: 100%">
  <div class="title">
    <span>官方榜</span>
  </div>
  <!--排行榜-->
  <div style="display: flex;margin-top: 20px;margin-bottom: 30px"
       v-for="songList in songLists"
       :key="songList.id"
  >
    <!--封面-->
    <div class="coverImg" :style="{backgroundImage: 'url('+songList.coverImgUrl+'?param=175y175'+')' }" @click="clickShowAll(songList)">
      <div class="upDateTime">
        <span>{{songList.updateTime | dateFormatMD}}更新</span>
      </div>
    </div>
    <!-- 展示5首歌曲-->
    <div  style="flex: 1" v-loading="songList.songs.length<1">
      <div class="song"
           v-for="(song,index) in subSongList(songList.songs)"
           :key="song.id"
      >

        <div class="rowBasic"
             :class="{'activityRow':songList.id+song.id===activityRowId}"
             @click="clickSong(songList,song)"
             @dblclick="dbClickSong(song)"
        >
          <div class="colBasic" :class="{'red':index<3,'gray':index>2}" style="font-size: 15px">{{ index+1 }}</div>
          <div class="colBasic  gray" v-if="song.ratio===undefined"><i :class="getRatio(song,index)"></i></div>
          <div class="colBasic  gray" v-if="song.ratio!==undefined">{{song.ratio}}</div>
          <div class="colBasic" >{{song.songName}}</div>
          <div class="colBasic lastCol gray">{{song.singer}}</div>
        </div>
      </div>
      <div class="showAllBtn" style="text-align: left">
        <el-button type="text" @click="clickShowAll(songList)">查看全部<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from "axios";

export default {
  name: "RankingList",
  data(){
    return {
      songLists:[],
      //激活的
      activityRowId:"",
    }
  },
  computed:{

  },
  methods:{
    getRatio(song,index) {
        if (song.lr!==undefined){
          if (song.lr>index){
            return 'el-icon-top red'
          }else if (song.lr===index){
            return 'el-icon-minus'
          }else {
            return 'el-icon-bottom blue'
          }
        }else {
          return 'iconfont icon-new ls'
        }
      },
    clickSong(songList,song){
      this.activityRowId = songList.id+song.id
    },
    dbClickSong(song) {
      this.$store.dispatch("pushSongToList",song)
    },
    clickShowAll(songList){
      let newSongList = {
        createTime: songList.createTime,
        description: songList.description,
        isDeleted: songList.isDeleted,
        picUrl: songList.coverImgUrl,
        playAmount: {total:songList.playCount},
        songListId: songList.id,
        songListName: songList.name,
        songNum: songList.songs.length,
        songs:songList.songs,
        tags: songList.tags,
        updateTime: songList.updateTime,
        userId: "",
        rk:true,
      }
      console.log(songList)
      this.$router.push({
        name:'SongListDetail',
        params:{
            songListInfo:newSongList,
        }
      })
    },
    subSongList(songLists){
      return songLists.filter((songList,index)=>{
        if (index<5){
          return songList
        }
      })
    },
    getRankingList(){
      axios.get('/api/toplist')
        .then(response =>{
          let data = response.data;
          for (let i = 0; i < 4; i++) {
            let songListInfo = data.list[i]
            let songListObj ={
                //id
                id:songListInfo.id,
                //榜单标记
                rk:true,
                //name
                name:songListInfo.name,
                //标签
                tags:[],
                //歌曲
                songs:[],
                //播放数量
                playCount:songListInfo.playCount,
                //封面
                coverImgUrl:songListInfo.coverImgUrl,
                //创建时间
                createTime:songListInfo.createTime,
                //更新时间
                updateTime:songListInfo.updateTime,
                //简介描述
                description:songListInfo.description,
              }
            this.songLists.push(songListObj)
          }
          this.songLists.forEach((songList)=>{
            this.getRankingListContent(songList)
          })
          // this.getRankingListContent(idArr.join(","))
        })
          .catch(error => {
            console.log(error)
          });
    },
    //songListInfo
    getRankingListContent(songListInfo){
      axios.get('/api/playlist/detail?id='+songListInfo.id)
      .then(response =>{
        let data = response.data;
        let trackIds = data.playlist.trackIds;
        data.playlist.tracks.forEach((songInfo,index)=>{
          let songObj = {
                  //歌曲 id
                  id: songInfo.id,
                  //上次排行名次
                  lr:trackIds[index].lr,
                  //url
                  url: "",
                  //上升比例
                  ratio:trackIds[index].ratio!==undefined ? trackIds[index].ratio+'%' :undefined,
                  //专辑
                  album: songInfo.al.name,
                  //封面图片
                  picUrl: songInfo.al.picUrl,
                  // 歌手
                  singer: songInfo.ar[0].name,
                  // 是否收藏
                  operate: false,
                  // 歌名
                  songName: songInfo.name,
                  //时长
                  duration: this.$timeToString(songInfo.dt / 1000),
                }
          songListInfo.songs.push(songObj)
        })
      })
      .catch(error => {
        console.log(error);
      });
    },
  },
  created() {
    this.getRankingList()
  }
}
</script>

<style scoped>
/*标题样式*/
.title{
  width: 100%;
  text-align: left;
  font-size: 18px;
  font-weight: 600;
  margin-top: 10px
}
/*封面*/
.coverImg{
  width: 175px;
  height: 175px;
  cursor: pointer;
  border-radius:6px;
  margin-right: 30px;
  background-color:#aeaeae
}
/*更新时间*/
.upDateTime {
  color: white;
  font-size: 12px;
  margin-top: 115px
}
/*行基础样式*/
.rowBasic{
  width: 100%;
  height: 35px;
  cursor: pointer;
  border-radius: 6px;
  line-height: 35px;
  display: flex;
  font-size: 12px
}
/*激活的row*/
.activityRow{
   background-color: rgba(178, 178, 178, 0.3);
}
/*歌曲行样式*/
.song{
  width: 100%;
  border-radius: 6px;
}
/*斑马纹*/
.song:nth-child(2n+1){
  background-color: #aeaeae17;
}
.song:hover{
  background-color: #aeaeae36;
}
/*列基础样式*/
.colBasic{
  text-align: center;
  margin: 0 5px 0 5px;
}
/*列最后一个元素自适应宽度 并向右对齐*/
.lastCol{
  flex:1;
  padding-right: 10px;
  text-align: right
}
/*查看全部按钮*/
.showAllBtn button{
  color: #aeaeae
}
.showAllBtn button:hover{
  color: #797979
}
.red{
  color: #ec4141;
}
.gray{
  color: #aeaeae
}
.blue{
  color: #3399CC;
}
.ls{
  color: #009966;
}
</style>
