<template>
  <div style="margin: 30px 10px 0 10px">
    <div class="headerBlock" style="display: flex">
      <div class="headerImage">
        <img width="200" v-bind:src="singerInfo.img1v1Url+'?param=200y200'" alt="">
      </div>
      <div class="headerTitleBlock">
        <div style="height: 45px;line-height:45px; font-size: 19px; font-weight: 600">
          <span>{{singerInfo.name}}</span>
        </div>
        <div style="height: 55px;line-height: 53px">
          <el-button
            round
            type="danger"
            icon="el-icon-caret-right"
            style="font-size: 15px"
          >收藏全部</el-button>
        </div>
        <div style="height: 24px;line-height: 25px;font-size: 12px">单曲数：{{singerInfo.musicSize}} 专辑数：{{singerInfo.albumSize}}</div>
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
    <div v-loading="albumInfos.length<1">
      <div v-for="(albumInfo,index) in albumInfos"
         :key="index">
      <div style="display: flex;margin-bottom: 60px">
        <!--  封面-->
        <div style="margin-right: 60px">
          <img :src="albumInfo.picUrl+'?param=150y150'" style="border-radius: 6px" width="150" height="150" alt="">
        </div>
        <div style="width: 100%">
          <div style="display:flex;text-align: left;font-weight: 600">
            <div style="margin-right: 20px"><span>{{albumInfo.name}}</span></div>
            <div style="margin-right: 20px"><i class="el-icon-video-play"></i></div>
            <div style="margin-right: 20px"><i class="el-icon-folder-add"></i></div>
          </div>
          <!-- 数据-->
          <div>
            <el-table
              stripe
              ref="songTable"
              class="tableData"
              style="width: 100%"
              :show-header="false"
              @row-click="rowClick($event,index)"
              @row-dblclick="rowDblclick"
              :data="albumInfo.songs"
              highlight-current-row
              :row-style="{height: '40px',fontSize:'13px'}">
             <el-table-column
              type="index"
              width="50"
              align="right"
              class-name="indexColStyle"
             >
             </el-table-column>
              <el-table-column
                label=""
                width="50"
                align="left"
                class-name="operateColStyle"
              >
              <template >
                <div class="collectIcon">
                  <i class="el-icon-star-off"></i>
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
              prop="duration"
              width="150"
              sortable
              label="时间"
             class-name="timeColStyle">
            </el-table-column>
          </el-table>
          </div>
        </div>
      </div>
    </div>
    </div>







  </div>
</template>

<script>
//歌手详细信息
import axios from "axios";

export default {
  name: "SingerDetailInfo",
  data(){
    return {
      //选项
      tabs:[
        {title:"专辑",path:""}
      ],
      //专辑信息 + 歌曲信息
      albumInfos:[
      ],
      singerInfo:{},
    }
  },
  methods:{
    //行单击
    rowClick(row,index){
      for (let i = 0; i < this.albumInfos.length; i++) {
        if (i!==index){
          this.$refs.songTable[i].setCurrentRow("")
        }else {
          this.$refs.songTable[i].setCurrentRow(row)
        }
      }
    },
    //行双击
    rowDblclick(row){
      this.$store.dispatch("pushSongToList",row)
    },
    filterHandler(value, row, column){
      console.log(value)
      console.log(row)
      console.log(column)
    },
    getRowKey(row){
      return row.id
    },
    expand(table){
      return table
    },
    //歌手热门50首数据
    getSingerHotMusic() {
      let singerInfo = {
                id:0,
                name: "热门50首",
                picUrl:require("../../../../assets/images/top50.png"),
                songs:[]
              }
      axios.get('/api/artist/top/song',{
        params: {
          id: this.singerInfo.id,
        }
      })
        .then(response =>{
          let data = response.data;
          data.songs.forEach((songInfo)=>{
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
            singerInfo.songs.push(songObj)
            })
          this.albumInfos.unshift(singerInfo)
        })
          .catch(error => {
            console.log(error)
          });
    },
    //获取到专辑信息 再遍历获取专辑信息
    getSingerAlbum() {
      axios.get('/api/artist/album',{
              params: {
                id: this.singerInfo.id,
              }
            })
          .then(response =>{
            let data = response.data;
            data.hotAlbums.forEach((album)=>{
              const albumObj = {
                      //专辑id
                      id:album.id,
                      //专辑名
                      name:album.name,
                      //专辑封面
                      picUrl:album.picUrl,
                      //发布时间
                      publishTime:album.publishTime,
                      songs:[]
                    }
              this.albumInfos.push(albumObj)
            })
            this.getSingerAlbumContent()
          })
          .catch(error => {
                  console.log(error)
                });
    },
    getSingerAlbumContent() {
      this.albumInfos.forEach((albumInfo)=>{
        if (albumInfo.id !== 0){
        axios.get('/api/album',{
          params: {
          id: albumInfo.id,
        }
        })
            .then(response =>{
              let data = response.data;
              data.songs.forEach((songInfo)=>{
                let songObj = {
                  //歌曲 id
                  id: songInfo.id,
                  //url
                  url: "",
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
                albumInfo.songs.push(songObj)
              })
            })
            .catch(error => {
              console.log(error)
            });
        }
      })
    },
  },
  created() {

    if (!this.$route.params.singerInfo){
      this.$router.push("/")
    }else if (this.$route.params.singerInfo!==undefined){
      this.singerInfo = this.$route.params.singerInfo;
      this.getSingerHotMusic()
      this.getSingerAlbum()
    }




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
.tabBlock{
  display: flex;
}
.tabBlock .tab{
  height: 60px;
  line-height: 60px;
  padding-right: 10px;
  padding-left: 10px;
}
.tab button{
	border-style: none;
	outline: none;
  background: none repeat scroll 0 0 transparent;
  font-size: 16px;
  padding: 0;
}
.isActivateTab button{
  border-bottom:4px solid #fd544e;
  font-size: 19px;
  font-weight: 600;
}
.tableData button{
  padding: 0;
  border: 0;
  font-size: 18px;
  color: #aeaeae
}
.tableData .el-button:hover{
  color: #E94D47;
}
.collectIcon{
  font-size: 17px;
  color: #aeaeae
}
.collectIcon:hover{
  color: #E94D47;
}
/deep/ .indexColStyle .cell{
  color: #aeaeae;
}
/deep/ .operateColStyle .cell{
  height: 19px;
}
/deep/ .timeColStyle .cell{
  color: #aeaeae;
}
</style>