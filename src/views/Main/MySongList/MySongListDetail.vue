<template>
  <div style="margin: 30px 10px 0 10px" v-if="songListInfo">
    <div class="headerBlock" style="display: flex">
      <div class="headerImage" v-if="songListInfo.picUrl">
        <img width="200" v-bind:src="'/zl'+songListInfo.picUrl" alt="">
      </div>
      <div class="headerTitleBlock">
        <div style="height: 45px;line-height:45px; font-size: 19px; font-weight: 600">
          <span>{{songListInfo.songListName}}</span>
        </div>
        <div style="height: 30px; line-height: 30px;font-size: 12px;color: #aeaeae">
          <span v-if="!songListInfo.rk">{{songListInfo.createTime | dateFormat}} 创建</span>
          <span v-if="songListInfo.rk">{{songListInfo.updateTime | dateFormat}} 更新</span>
        </div>
        <div style="height: 55px;line-height: 53px">
          <el-button
              round
              type="danger"
              @click="playAllMusic"
              icon="el-icon-caret-right"
              style="font-size: 15px"
          >播放全部</el-button>
        </div>
        <div style="height: 24px;line-height: 25px;font-size: 12px" v-if="songListInfo.tags">标签：<span style="color: blue" v-for="(tag,index) in songListInfo.tags" :key="index">{{tag}} </span></div>
        <div style="height: 24px;line-height: 25px;font-size: 12px" v-if="songListInfo.playAmount">歌曲：{{songListInfo.songNum}} 播放：{{songListInfo.playAmount.total}}</div>
        <div style="height: 24px;line-height: 25px;font-size: 12px" >简介：{{omit(songListInfo.description)}}</div>
      </div>
    </div>
    <div class="tabBlock">
      <div
          class="tab"
          :class="{'isActivateTab':true}"
          v-for="(tab,index) in tabs"
          :key="index"
      >
        <button>{{ tab.title }}</button>
      </div>
    </div>
    <div>
      <el-table
          :data="tableData"
          :v-loading="isLoading"
          ref="songTable"
          class="tableData"
          stripe
          style="width: 100%"
          @row-click="rowClick"
          @row-dblclick="rowDblclick"
          highlight-current-row
          :row-style="{height: '40px',fontSize:'13px',cursor: 'pointer'}"
      >
        <el-table-column
            type="index"
            width="50"
            align="right"
            class-name="indexColStyle"
        >
        </el-table-column>
        <el-table-column
            label=""
            width="30"
            align="left"
        >
          <template slot-scope="scope">
            <div class="collectIcon" @click="clickCollect(scope.row)">
              <i :class="scope.row.operate ? 'iconfont icon-aixin2 red' : 'iconfont icon-aixin1' "></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="songName"
            label="标题"
            sortable
            min-width="200"
        >
        </el-table-column>
        <el-table-column
            prop="singer"
            width="240"
            sortable
            label="歌手">
        </el-table-column>
        <el-table-column
            prop="album"
            width="335"
            sortable
            label="专辑"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            prop="duration"
            width="70"
            sortable
            label="时间"
            class-name="timeColStyle">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {getSongListAllSongId, getSongDetail, removeLoveSong} from "../../../api/mySongList";
import {addSongsPlayAmount} from "../../../api/songList";
export default {
  name: "SongListDetail",
  data(){
    return {
      //
      tabs:[
        {title:"歌曲列表",path:""}
      ],
      //歌单简略信息 无包含歌曲
      songListInfo:{},
      //歌单详细信息
      songListDetailInfo:[],
      //激活的 activeCollapseName
      activeCollapseName:"1",
      //歌曲数据表单
      tableData: [
        // 歌曲 id
        //id :
        // 是否收藏
        //operate: false,
        // 歌名
        //songName:
        // 歌手
        //singer:
        //专辑
        //album: s
        //封面图片
        //picUrl:  songInfo.al.picUrl,
        //时长
        //duration:
      ],
      isLoading : false,
    }
  },
  methods:{
    //省略
    omit(value){

      if (value){
        console.log("value",value)
        if (value.length>80){
          let dArr =  value.split("\n");
          return dArr[0]
        }
      }
      return value
    },
    //行单机事件
    rowClick(row){
      this.$refs.songTable.setCurrentRow(row);
    },
    //行双击事件
    rowDblclick(row){
      this.songListInfo.playAmount.total = this.songListInfo.playAmount.total +1
      const params = {
        songListId : this.songListInfo.songListId
      }
      addSongsPlayAmount(params).catch((error)=>{
        console.log(error)
      })
      this.$store.dispatch("pushSongToList",row)
    },
    //收藏事件
    clickCollect(value){
      if (value.operate){
        value.operate = false
        this.tableData = this.tableData.filter((row)=>{
          if (row.id ==value.id ){
            removeLoveSong({
              songsId:this.songListInfo.songListId,
              songId:value.id
            }).then((res)=>{
              console.log(res)
            }).catch((error)=>{
              console.log(error)
            })
            return false
          }
          return true
        })

      }

    },
    //播放所有歌曲
    playAllMusic(){
      this.tableData.forEach((songInfo)=>{
        this.$store.dispatch("pushSongToList",songInfo)
      })
    },
    //浏览器刷新事件
    refreshPage(){
      console.log("浏览器刷新了")
    },
    //初始化table
    initTableInfo(songListDetailInfo){
      //遍历歌单信息中的歌曲信息
      console.log()
      songListDetailInfo.forEach(
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
              operate: true,
              // 歌名
              songName: songInfo.name,
              //时长
              duration: this.$timeToString(songInfo.dt/1000),
            }
            this.tableData.push(songObj)
            this.$store.commit("addLoveSongs",songObj.id)
          }
      )
      this.isLoading = false
    },
    //根据id获取歌曲的详细信息
    getSongs(songId){
      getSongDetail({
        ids:songId.join(",")
      }).then((res)=>{
        this.initTableInfo(res.data.songs)
      }).catch((error)=>{
        console.log(error)
      })
    },
    //获取歌单包含歌曲id
    getSongListAllSongId(){
      this.isLoading = true
      getSongListAllSongId({
        id:this.songListInfo.songListId
      }).then((res)=>{
        let songId = res.data.data;
        if (songId.length>0){
          this.$store.commit("UpdateLoveSongs",songId)
          this.getSongs(songId)
        }else {
          console.log("为空")
          this.tableData = []
          this.isLoading = false
        }

      }).catch((error)=>{
        console.log(error)
      })
    },
  },
  mounted() {
    let songs = this.$route.params.songs;
    console.log(songs)
    if (!songs){
      this.$router.push("/")
      console.log("去首页")
    }else {
      this.songListInfo = songs
      this.getSongListAllSongId()
    }
    this.$bus.$on("refreshMySongListDetailPage",(songs)=>{
      this.songListInfo = songs
      this.getSongListAllSongId()
    })



  }
}
</script>

<style scoped>
.headerTitleBlock{
  margin-left: 20px;
  text-align: left;
}
.headerImage img{
  border-radius: 10px;
}
.tab button{
  border-style: none;
  outline: none;
  background: none repeat scroll 0 0 transparent;
  font-size: 16px;
  padding: 0;
}
.tabBlock{
  display: flex;
}
.tabBlock .tab{
  height: 60px;
  line-height: 60px;
  padding-right: 10px;
  padding-left: 10px;
}

.isActivateTab button{
  border-bottom:4px solid #fd544e;
  font-size: 19px;
  font-weight: 600;
}
button:after {
  border: none;
}

.tableData button{
  padding: 0;
  border: 0;
  font-size: 18px;
  color: #aeaeae
}
.collectIcon{
  font-size: 17px;
  color: #aeaeae
}
.collectIcon:hover{
  color: #E94D47;
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
/deep/ .indexColStyle .cell{
  color: #aeaeae;
}
/deep/ .timeColStyle .cell{
  color: #aeaeae;
}
</style>
