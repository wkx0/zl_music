<template>
  <div class="fullScreen">
    <div class="context">
      <div class="close" @click="close">
        <i class="el-icon-close"></i>
      </div>
      <div class="main">
<!--        //棍-->
        <div style="width: 50%;margin: 0 auto;text-align: right">
          <transition>
            <div class="cd-g" :style="{'transform':'rotate('+tweenedAngle_g+'deg)'}">
            </div>
          </transition>
        </div>
<!--        //圆盘-->
        <div style="width: 50%;margin: 0 auto">
          <div class="cover" :style="[{'transform':'rotate('+tweenedAngle_y+'deg)'},{backgroundImage: 'url('+songInfo.picUrl+'?param=370y370'+')' }]">
            <div class="cd-y">
              <img width="100%" height="100%" src="../../assets/images/coverall.png" alt="">
            </div>
          </div>
        </div>
        <!--歌词-->
        <div style="text-align: center">
        <!--歌名-->
          <div style="font-size: 30px;color: #333333;margin-top: 10px">
            {{songInfo.songName}}
          </div>
          <div style="margin-top: 20px">
            <div ref="lyricsDom" style="height: 80px;overflow: auto" @mousewheel="isMouseWheel=true" @mouseleave="isMouseWheel=false">
                <div class="lyricBasic" :class="{'lyricActivity':index === showIndex}" v-for="(lyric,index) in lyrics" :key="index">
                    <span>{{lyric.text}}</span>
                </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { gsap } from "gsap"
import axios from "axios";
import {mapState} from "vuex";
export default {
  name: "FullScreenPlay",
  data(){
    return {
      //歌词
      lyrics:[],
      //当前时间
      currentTime:0,
      sortTime:[],
      //上一个消失的下标
      showIndex:0,
      //旋转角度
      angle_g:0,
      angle_y:0,
      tweenedAngle_g:0,
      tweenedAngle_y:0,
      //鼠标滚动
      isMouseWheel:false
    }
  },
  computed:{
    ...mapState({
      //播放列表kv
      playListKv: state => state.playListKv,
      playId: state => state.playId,
    }),
    songInfo(){
      if (this.playId===0){
        return {
          // 歌曲 id
          id : 0,
          //音乐资源
          url:"null",
          // 是否收藏
          operate: false,
          // 歌名
          songName:"",
          //歌手
          singer:"",
          //专辑
          album: "",
          //封面图片
          picUrl: require("../../assets/images/music.svg"),
          //时长
          duration:"00:00"
        }
      }else {
        return this.playListKv[this.playId]
      }
    },
    playing(){
      return this.$store.state.playInfo.playing
    }
  },
  methods:{
    //关闭全屏
    close(){
      this.$store.commit("ChangeFullScreen")
    },
    rotate(value){
      if (!this.tween){
        this.tween = gsap.to(this.$data, { duration: 10000, tweenedAngle_y: 50000 })
      }
      if (value){
        this.angle_g = 35
        this.tween.play()
      }else {
        this.angle_g = 0
        this.tween.pause()
      }
    },
    //播放时间改变
    changeCurrentTime(time){
      this.currentTime = time
    },
    //获取歌词
    getLyrics(id){
      ///lyric
      axios.get('/api/lyric?id='+id)
        .then(response =>{
          let data = response.data;
          let lyricArr = data.lrc.lyric.split("\n")
          this.formatLyric(lyricArr)
          })
          .catch(error => {
            console.log(error)
          });
    },
    //格式化歌词数据
    formatLyric(metaLyric){
      console.log("歌词",metaLyric)
      metaLyric.forEach((str)=>{
        if (str!==""){
          let search = str.match(/\[\d{2}:\d{2}.\d{1,3}\]/);
          let text = str.split("]");
          if (text.length>1 && search !==null){
            let lyricObj={
              time:this.stringToSec(search[0].slice(1,-1)),
              text:text[1],
            }
            this.sortTime.push(lyricObj.time)
            this.lyrics.push(lyricObj)
          }
        }
      })
      if (this.lyrics.length<1){
        let lyricObj={
              time:this.stringToSec("00:00.01"),
              text:"暂无歌词",
            }
        this.lyrics.push(lyricObj)
      }
    },

    stringToSec(time){
        let s = '';
        let min = time.split(':')[0];
        let sec = time.split(':')[1];
        s = Number(min*60) + Number(sec);
        return s;
    }

  },
  watch:{
    angle_g(newValue){
      gsap.to(this.$data, { duration: 0.5, tweenedAngle_g: newValue });
    },
    angle_y(newValue){
      let tween = gsap.to(this.$data, { duration: 999, tweenedAngle_y: newValue });
      if (newValue === 0 ){
        tween.pause()
      }


    },
    currentTime(newValue){
      if (this.lyrics.length>1 && !this.isMouseWheel){
        for (let i = this.lyrics.length-1; i > 0; i--) {
          if (Object.prototype.hasOwnProperty.call(this.lyrics[i],"time")){
            if (this.lyrics[i].time<=newValue){
              this.showIndex = i
              gsap.to(this.$refs.lyricsDom, { duration: 0.5, scrollTop: 40*this.showIndex });
              break
            }
          }
        }
      }
    },
    playId(newValue){
        this.lyrics = []
        this.getLyrics(newValue)
    },
    playing:{
      immediate:true,
      handler(newValue){
        this.rotate(newValue)
      }
    },
  },
  created() {
    this.getLyrics(this.playId)
    this.$bus.$on("changeCurrentTime",this.changeCurrentTime)
  },mounted() {
    console.log(this.$refs.lyricsDom.scrollHeight)

  }
}
</script>

<style scoped>

.fullScreen{
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  z-index: 1;
  /*background-color: white;*/
  background-image: linear-gradient(rgba(174, 174, 174, 1), #ffffff);
}
.context{
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 30px;
  /*background-color: #3399CC;*/
}
.close{
  text-align: right;
}
.close i{
  font-size: 35px;
  cursor:pointer;
}
.cd-g{
  position: relative;
  width:150px;
  height: 75px;
  z-index: 2;
  margin-left: calc(50% - 10px);
  transform-origin: 10px 10px;
  background-size:100% 100%;
  background-image: url("../../assets/images/cdg.png")
}
.cover{
  position: relative;
  z-index: 1;
  width: 370px;
  height: 370px;
  margin: 0 auto;
  background-size:66% 66%;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url("https://p3.music.126.net/E11nNQsHOmxwMKJK7rJ2_w==/109951163718681710.jpg?param=300y300")
}
.cd-y{
  width: 100%;
  height: 100%
}
.cd-y img{
  z-index: 1;
}
/*歌词基础样式*/
.lyricBasic{
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  color: rgba(174,174,174,0.68);
}
.lyricActivity{
  color: #333333;
}
::-webkit-scrollbar{
display:none;
}
</style>
