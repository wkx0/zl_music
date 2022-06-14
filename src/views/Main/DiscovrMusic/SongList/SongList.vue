<template>

  <div v-loading="songListInfos.length<1 && Object.keys(delicateSongList).length<1">
    <!--  头部-->
    <div class="headerBlock"
         @click="clickDelicateSongList(delicateSongList)"
         :style="{ 'backgroundImage':'url('+ delicateSongList.coverImgUrl+'?imageView&blur=40x20'+')' }"
    >
        <div class="headerImage">
          <img height="140" v-bind:src="delicateSongList.coverImgUrl" alt="">
        </div>
        <div>
          <div class="headerTitle">
            <span><i class="iconfont icon-huangguan"></i>精品歌单</span>
          </div>
          <div style="color: white;font-size: 16px;font-weight: 500">
            <span >{{delicateSongList.name}}</span>
          </div>
        </div>
      </div>
    <div class="typeButton">
      <div style="width: 50%">
        <div style="text-align: left">
          <el-button round>{{typeList[activeIndex]}}</el-button>
        </div>
      </div>
      <div style="width: 50%">
        <div class="typeButtonGroup" style="text-align: right" >
          <el-button
              round
              type="text"
              :class="{'active':activeIndex===index}"
              v-for="(item,index) in typeList"
              :key="index"
              @click="clickTypeButton(index)"
          >
            {{item}}
          </el-button>
        </div>
      </div>


    </div>
    <!-- 歌单内容即分页按钮 -->
    <div :v-loading="isLoad">
      <SongListBlock
        :songListInfos="songListInfos"
      >
      </SongListBlock>
      <el-pagination
        :small="true"
        v-if="!isLoad"
        background
        :current-page="page.curPage"
        :page-count="page.pages"
        :page-size="page.size"
        :total="page.total"
        style="margin-top: 30px;margin-bottom: 50px"
        layout="slot,prev, pager, next"
        @current-change="currentChange"
    >
    </el-pagination>
    </div>
  </div>
</template>
<!--歌单组件-->
<script>
import SongListBlock from "../../../../components/Main/DiscovrMusic/SongListBlock";
import axios from "axios";
import {getSongsByTag} from "../../../../api/songList";
export default {
  name: "SongList",
  data(){
    return {
      songListInfos:[],
      //歌单分类
      typeList:["华语","流行","摇滚","民谣","电子","轻音乐"],
      //激活的歌单类型
      activeIndex:0,
      page: {
        curPage: 1,
        size: 20,
        pages: 0,
        total: 0
      },
      isLoad:false,
      //头部推荐精品歌单
      delicateSongList: {},
    }
  },
  components:{
    SongListBlock
  },
  methods:{
    //获得歌单
    getSongList(){
      const params = {
        curPage: this.page.curPage,
        size: this.page.size,
        cat : this.activeIndex + 1
      }
      this.isLoad = true
      getSongsByTag(params).then((res)=>{
        let data = res.data;
        this.songListInfos = data.data.records
        this.page.pages = data.data.pages
        this.page.total = data.data.total
        this.isLoad = false
      }).catch((error)=>{
        console.log(error)
      })
    },
    //换页回调
    currentChange(value){
      //更新呢当前页
      this.page.curPage = value
      //重新请求数据
      this.getSongList()
    },
    //获得精品歌单
    getDelicateSongList(){
      axios.get('/api/top/playlist/highquality', {
        params: {
          cat: this.typeList[this.activeIndex],
          before:"",
          limit:1
        }
      })
      .then(response =>{
        let songListInfo = response.data.playlists[0];
        this.delicateSongList = {
              //歌单id
              id:songListInfo.id,
              //歌单名 name
              name:songListInfo.name,
              //标签 tags
              tags:songListInfo.tags,
              //创建歌单用户Id userId
              userId:songListInfo.userId,
              //播放量 playCount
              playCount:songListInfo.playCount,
              //封面 coverImgUrl
              coverImgUrl:songListInfo.coverImgUrl,
              //评论数量 commentCount
              commentCount:songListInfo.commentCount,
              //描述 description
              description:songListInfo.description,
              //创建时间 createTime
              createTime:songListInfo.createTime,
            }
      })
      .catch(error => {
        console.log(error);
      });
    },
    //切换当前歌单类型
    clickTypeButton(index){
      //切换歌单类型index
      this.activeIndex=index
      //页数重置
      this.page.curPage = 1
      //获取精品歌单
      this.getDelicateSongList()
      //获取歌单
      this.getSongList()
    },
    //点击头部精品歌单
    clickDelicateSongList(){
      this.$router.push({
        name:'SongListDetail',
        params:{
            songListInfo:this.delicateSongList,
        }
      })
    },
  },
  mounted() {
    this.getDelicateSongList()
    this.getSongList()
  }
}
</script>

<style scoped>
/*头部内容格式*/
.headerBlock{
  top: 120px;
  display:flex;
  width: 100%;
  height: 170px;
  cursor: pointer;
  background-size: 3000px;
  background-position: center center;
  border-radius: 7px;

}
/*头部图片div*/
.headerImage{
  height:140px;
  margin:15px;
}
/*头部图片*/
.headerImage img{
  border-radius: 6px;
  filter: grayscale(0);
}
/*头部标题*/
.headerTitle{
  height: 85px;
  color: #EA9E48;
  line-height: 120px;
  text-align: initial;
}
/*分类按钮div样式*/
.typeButton{
  display: flex;
  height: 50px;
  line-height: 50px;
}
/*分类按钮样式*/
.typeButtonGroup button{
  color: #333333;
}
/*分类按钮激活样式*/
.typeButtonGroup .active{
  background-color: rgba(224, 114, 110, 0.27);
  color: #E94D47;
}
/*分页按钮颜色*/
/deep/ .el-pagination.is-background .el-pager li:not(.disabled).active{
  background-color: #E94D47;
}
</style>
