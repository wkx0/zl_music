<template>
  <div v-loading="this.songListInfos.length<1">
    <!-- 走马灯   -->
    <el-carousel :interval="5000" type="card" height="200px">
      <el-carousel-item v-for="banner in banners" :key="banner.bannerId">
          <img class="carouselImg" height="200" v-bind:src="banner.pic" alt="">
      </el-carousel-item>
    </el-carousel>
    <div >
      <!--  更多推荐歌单按钮    -->
      <div class="moreButton">
        <el-button
            size="medium"
            type="text"
            @click="clickMoreMusic"
        >
          推荐歌单
          <i class="el-icon-arrow-right"></i>
        </el-button>
      </div>
      <!--  歌单-->
      <SongListBlock :songListInfos="songListInfos"></SongListBlock>
    </div>
  </div>
</template>
<!--个性推荐-->
<script>
import SongListBlock from "../../../components/Main/DiscovrMusic/SongListBlock";
import axios from "axios";
import {getSongsByHot} from "../../../api/songList";
export default {
  name: "Recommend",
  data(){
    return {
      //推荐歌单的数量
      limit: 20,
      //banner 信息
      banners: [
        {
          //banner 资源地址
          pic:"",
          //bannerId
          bannerId:"",
        }
      ],
      //歌单数据 未格式化
      playLists:[],
      //歌单信息 格式化后
      songListInfos:[
        // {
        //   //歌单id
        //   id:"",
        //   //歌单名 name
        //   name:"",
        //   //标签 tags
        //   tags:[],
        //   //创建歌单用户Id userId
        //   userId:"",
        //   //播放量 playCount
        //   playCount:0,
        //   //封面 coverImgUrl
        //   coverImgUrl:"",
        //   //评论数量 commentCount
        //   commentCount:"",
        //   //描述 description
        //   description:"",
        //   //创建时间 createTime
        //   createTime:"",
        // }
      ]
    }
  },
  components:{
    SongListBlock
  },
  methods:{
    //获取banner信息
    getBanner(){
      axios.get('/api/banner', {
        params: {
          type: 1
        }
      })
      .then(response =>{
        this.banners = response.data.banners
      })
      .catch(error => {
        console.log(error);
      });
    },
    //获取歌单信息
    getSongList(){
      getSongsByHot().then((res)=>{
        this.songListInfos = res.data.data
      }).catch((error)=>{
        console.log(error)
      })
    },
    //点击跳转到歌单
    clickMoreMusic(){
      this.$router.push("/MusicHome/DiscovrMusic/SongList")
    },
  },
  created() {
    this.getBanner();
    this.getSongList()
  },
  watch:{
    //监听 playList 内容变化，如果变了，就重新解析歌单的数据
    playLists(newValue){
      newValue.forEach((songInfo)=>{
        const obj = {
          //歌单id
          id:songInfo.id,
          //歌单名 name
          name:songInfo.name,
          //标签 tags
          tags:songInfo.tags,
          //创建歌单用户Id userId
          userId:songInfo.userId,
          //播放量 playCount
          playCount:songInfo.playCount,
          //封面 coverImgUrl
          coverImgUrl:songInfo.coverImgUrl,
          //评论数量 commentCount
          commentCount:songInfo.commentCount,
          //描述 description
          description:songInfo.description,
          //创建时间 createTime
          createTime:songInfo.createTime,
        }
        this.songListInfos.push(obj)
      })
    }

  }
}
</script>

<style scoped>
/*走马灯高度样式*/
/deep/ .el-carousel__indicators{
  height: 40px;
  line-height: 40px;
}
/*走马灯中的图片样式*/
/deep/ .carouselImg{
  border: 1px solid #EBEEF5;
  border-radius:12px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
/*更多推荐歌单div样式*/
.moreButton{
  height: 50px;
  line-height: 50px;
  font-size: 19px;
  font-weight: 600;
  text-align: left;
}
/*更多推荐歌单按钮样式*/
.moreButton button{
  color: #333333;
  font-size: 19px;
  font-weight: 600;
}
</style>
