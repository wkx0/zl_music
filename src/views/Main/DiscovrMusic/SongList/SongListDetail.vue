<template>
  <div style="margin: 30px 10px 0 10px" v-if="songListInfo">
    <div class="headerBlock" style="display: flex">
      <div class="headerImage">
        <img width="200" v-bind:src="songListInfo.picUrl+'?param=200y200'" alt="">
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
        <div style="height: 24px;line-height: 25px;font-size: 12px" v-if="songListInfo.tags.length>0">标签：<span style="color: blue" v-for="(tag,index) in songListInfo.tags" :key="index">{{tag}} </span></div>
        <div style="height: 24px;line-height: 25px;font-size: 12px">歌曲：{{tableData.length}} 播放：{{songListInfo.playAmount.total}}</div>
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
        v-loading="tableData.length<=0"
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
          v-if="['原创榜','热歌榜','新歌榜'].indexOf(songListInfo.songListName)>=0"
        >
          <template slot-scope="scope">
              <div style="font-size: 15px"  >
                <i :class="getRatio(scope.row,scope.$index)"></i>
              </div>
          </template>
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
            v-if="['飙升榜'].indexOf(songListInfo.songListName)>=0"
          prop="ratio"
          width="100"
          sortable
          label="飙升率">
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
import {addLoveSong,removeLoveSong,addSongsPlayAmount,getSongIdBySongListId} from "../../../../api/songList";
import {getSongDetail} from "../../../../api/mySongList";
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
      ]
    }
  },
  computed:{
  },
  methods:{
    //省略
    omit(value){
      if (value.length>80){
        let dArr =  value.split("\n");
        if (dArr[0].length>50){
          return dArr[0].slice(0,49)
        }

      }else {
        return value
      }
    },
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
    //行单机事件
    rowClick(row){
      this.$refs.songTable.setCurrentRow(row);
    },
    //行双击事件
    rowDblclick(row){
      const params = {
        songListId : this.songListInfo.songListId
      }
      addSongsPlayAmount(params).catch((error)=>{
        console.log(error)
      })
      this.$store.dispatch("pushSongToList",row)
    },
    //收藏歌曲
    clickCollect(value){
      if (value.operate){
        value.operate = false
        removeLoveSong({
          songsId:this.$store.state.user.loveSongListId,
          songId:value.id
        }).then((res)=>{
          this.$store.commit("addLoveSongs",value.id)
          console.log(res)
        }).catch((error)=>{
          console.log(error)
        })
      }else {
        value.operate = true
        addLoveSong({
          songsId:this.$store.state.user.loveSongListId,
          songId:value.id
        }).then((res)=>{
          console.log(res)
          this.$store.commit("addLoveSongs",value.id)
        }).catch((error)=>{
          console.log(error)
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
              operate:this.isOperate(songInfo.id),
              // 歌名
              songName: songInfo.name,
              //时长
              duration: this.$timeToString(songInfo.dt/1000),
            }
            this.tableData.push(songObj)
          }
      )
    },
    isOperate(id){
      if (this.$store.state.user.loginOK){
        console.log("loveSongIds",this.$store.state.user.loveSongIds)
        return this.$store.state.user.loveSongIds.includes(id)
      }else{
        return false;
      }
    },
    //获取歌单详细信息
    getSongListDetail(){
      const params = {
        id : this.songListInfo.songListId
      }
      getSongIdBySongListId(params).then((res)=>{
        this.formatSong(res.data.data)
      }).catch((error)=>{
        console.log(error)
      })
    },
    // 格式化歌曲数据
    formatSong(songIds){
      getSongDetail({
        ids:songIds.join(",")
      }).then((res)=>{
        this.initTableInfo(res.data.songs);
      }).catch((error)=>{
        console.log(error)
      })
    },
  },
  created() {
    window.addEventListener('beforeunload', this.refreshPage)

    this.songListInfo = this.$route.params.songListInfo
    console.log("info",this.songListInfo)
    if (!this.songListInfo){
      this.$router.push("/")
    }else if (this.songListInfo.songs!==undefined){
      this.tableData = this.songListInfo.songs
    }else {
      this.getSongListDetail();
    }
  },
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
