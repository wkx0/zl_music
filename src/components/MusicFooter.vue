<template>
  <div class="musicFooter" @keyup.space="clickSpace">
    <!--歌曲名和略缩图-->
    <div class="musicInfo">
      <transition
          appear
          name="animate__animated animate__bounce"
          enter-active-class="animate__fadeInDown"
          leave-active-class="animate__fadeOutUp"
      >
        <div class="coverIcon" v-show="isFullScreen" @click="ClickFullScreen">
        <i class="el-icon-arrow-down"></i>
      </div>
      </transition>
      <!--略缩图-->
        <transition
          appear
          name="animate__animated animate__bounce"
          enter-active-class="animate__fadeInUp"
          leave-active-class="animate__fadeOutDown"
      >
          <div style="display: flex" v-if="!isFullScreen">
            <div :class="{'coverImg':!coverFilter,'coverImg2':coverFilter && musicUrl !== ''}"
               :style="{backgroundImage: 'url('+picUrl+'?param=48y48'+')' }"
               @mouseenter="coverFilter=true"
               @mouseleave="coverFilter=false"
               @click="ClickFullScreen"
               v-loading="musicUrl === '' && playId !== 0"
               element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <i v-if="coverFilter" class="el-icon-arrow-up" style="z-index: -1;color: #c3c3c3;font-size: 25px;cursor: pointer;"></i>
            <i v-if="picUrl === ''" class="iconfont icon-yinle" style="z-index: 1;color: #000000;font-size: 25px;cursor: pointer;"></i>
          </div>
            <!-- 歌名和歌手 -->
            <div class="musicTitle">
              <div class="musicTitleBasic">
                <span style="font-size: 15px;font-weight: 500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{songInfo.songName}}</span>
              </div>
              <div class="musicTitleBasic">
                <span style="font-size: 13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{songInfo.singer}}</span>
              </div>
            </div>
          </div>
      </transition>



    </div>
    <!--播放器等按钮-->
    <div class="audioBlock">
        <!--播放按钮-->
        <div class="audioButton">
          <!-- 顺序播放-->
          <el-button
              type="text"
              style="font-size:20px"
              :icon="playModelIconStyle"
              @click="switchModel"
          >
          </el-button>
          <!-- 上一曲-->
          <el-button
              type="text"
              style="font-size:20px"
              icon="el-icon-arrow-left"
              @click="upSong"
          >
          </el-button>
          <!-- 播放-->
          <el-button
              type="primary"
              style="font-size:20px;background-color: #f4f4f4"
              :icon="iconStyle"
              @click="play"
              circle
          >
          </el-button>
          <!-- 下一曲-->
          <el-button
              type="text"
              style="font-size:20px"
              icon="el-icon-arrow-right"
              @click="nextSong"
          >
          </el-button>
          <!-- 歌词 -->
          <el-button
              type="text"
              style="font-size:20px"
              @click="ClickFullScreen"
              icon="iconfont icon-gecitiaozheng"
          >
          </el-button>
        </div>
        <!--播放进度条-->
        <div class="audioSliderBlock">
          <!--当前时间-->
          <div class="audioSliderBasic" >
              <span>{{currentTime}}</span>
          </div>
          <!-- 滑动条-->
          <div class="audioSliderBasic audioSlider">
            <el-slider
              class="progressSlider"
              v-model="sliderBoxX"
              @change="sliderChange($event)"
              :show-tooltip="false"
              :debounce="500"
              @mousedown.native="sliderChangeState=true"
              @mouseup.native="sliderChangeState=false"
              >
            </el-slider>
          </div>
          <!-- 完整时长-->
          <div class="audioSliderBasic">
              <span>{{finalTime}}</span>
          </div>
        </div>
    </div>
    <!--音量和播放列表按钮-->
    <div class="rightBlock">
      <div class="rightContentBlock">
        <!-- 音量 -->
        <div class="volumeBlock"
           @mouseleave="showVolumeSlider=false"
           @mouseenter="showVolumeSlider=true"
        >
          <el-button
              type="danger"
              @click="isMute"
              :icon="volumeIcon"
              circle>
          </el-button>
          <div class="volumeSlider" v-show="showVolumeSlider">
              <el-slider
                v-model="volume"
                vertical
                height="100px"
              >
              </el-slider>
            </div>
        </div>
        <!-- 展示播放列表的按钮-->
        <el-button class="playListButton" type="text" icon="iconfont icon-24gf-playlist3" @click="showPlayList"></el-button>
      </div>
    </div>
    <!-- audio播放器   -->
    <audio :src="musicUrl" autoplay="autoplay" :loop="loop" ref="audio"></audio>
  </div>
</template>

<script>
//播放状态 音量 播放模式
//当前播放音乐：头像 url 百分比 当前播放时间 总时间
//歌单信息
import { mapState } from "vuex";
import axios from "axios";
import {addSongPlayAmount} from "../api/song";
export default {
  name: "MusicFooter",
  data() {
    return {
      error: "", // 报错内容
      playing:false,
      musicUrl:"", //音乐资源
      picUrl:"", //封面资源
      coverFilter:false,// 封面滤镜
      sliderBoxX:0, //进度条
      currentTime:"00:00",
      finalTime:'00:00',// 总播放时间
      historyVolume:50,//历史音量
      sliderChangeState:false,//是否在滑动滑块
      showVolumeSlider:false, //显示音量滑动条
    };
  },
  computed:{
    ...mapState({
      //播放列表kv
      playListKv: state => state.playListKv,
      isFullScreen:state => state.playInfo.isFullScreen,
    }),
    loop(){
      if (this.playType===1){
        return true
      }else {
        return false
      }
    },
    //当前播放音乐的id
    playId:{
      get(){
        return this.$store.state.playId
      },
      set(value){
        this.$store.commit("UpdatePlayId",value)
      }
    },
    //音量
    volume:{
      get(){
        return this.$store.state.playInfo.volume
      },
      set(value){
        this.audio.volume = value/100
        this.$store.commit("UpdateVolume",value)
      }
    },
    //播放模式
    playType:{
      get(){
        return this.$store.state.playInfo.playType
      },
      set(value){
        this.$store.commit("UpdatePlayType",value)
      }
    },
    //音乐信息
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
          picUrl: require("../assets/images/music.svg"),
          //时长
          duration:"00:00"
        }
      }else {
        return this.playListKv[this.playId]
      }
    },
    //播放和暂停的图标
    iconStyle(){
      //播放暂停icon
      return this.playing === false ? "el-icon-video-play" : "el-icon-video-pause";
      },
    //播放模式的图标
    playModelIconStyle(){
      //循环播放 顺序播放 随机播放
      return ['iconfont icon-liebiaoxunhuan','iconfont icon-danquxunhuan','iconfont icon-suijibofang'][this.playType]
      },
    //是否静音图标
    volumeIcon(){
      return this.volume >0 ? 'iconfont icon-yinliang' : "iconfont icon-jingyin"
    },
  },
  methods: {
    //播放与暂停
    play() {
      if (this.playing) {
        // 播放中,点击则为暂停
        this.audio.pause();
      } else {
        // 暂停中,点击则为播放
        this.audio.play();
      }
      this.playing = !this.playing
    },
    //静音/不静音
    isMute(){
      if (this.volume>0){
        this.historyVolume = this.volume;
        this.volume = 0
      }else {
        this.volume = this.historyVolume;
      }
        this.$store.state.playInfo.mute = !this.mute
    },
    //上一曲
    upSong(){
      this.$store.dispatch("upSong",this.playId)
    },
    //下一曲
    nextSong(){
      this.$store.dispatch("nextSong",this.playId)
    },
    //初始化
    playInit() {
      //添加监听事件  时间更新时被调用
      this.audio.addEventListener('timeupdate',this.updateCurrentTime)
      //添加监听事件  可以播放时被调用
      this.audio.addEventListener('canplaythrough',this.canplaythrough)
      //监听播放结束
      this.audio.addEventListener('ended',this.musicEnded)
      //监听播放音乐时
      this.audio.addEventListener("playing", ()=>{
        this.playing = true
          this.finalTime = this.$timeToString(this.audio.duration)
      });
      //监听音乐暂停时
      this.audio.addEventListener("pause", ()=>{
          this.playing = false;
      });

    },
    clickSpace(){
      console.log("按下了空格")
    },
    //获取单曲url
    getSongUrl(value){
      const params = {
        songId:value.id
      }
      addSongPlayAmount(params).catch((error)=>{
        console.log(error)
      })
      if (value.id === 0){
        return ""
      }else{
        axios.get('/api/song/url?id='+value.id)
        .then(response =>{
          let data = response.data.data;
          let url = data[0].url
          if (url!==null){
            value.url = url
            this.musicUrl = url
          }
          })
          .catch(error => {
            console.log(error)
          });
      }
    },

    ClickFullScreen(){
      this.$store.commit("ChangeFullScreen")
    },
    //播放完毕回调
    musicEnded(){
      if (this.playType !== 1){
        this.nextSong()
      }
    },
    //是否显示播放列表
    showPlayList(){
      this.$bus.$emit('showPlaylist')
    },
    //进度条被拖动回调
    sliderChange(value){
      this.audio.currentTime = this.audio.duration * (value/100)
    },
    //当前播放时间改变时回调
    updateCurrentTime(){
      this.currentTime = this.$timeToString(this.audio.currentTime)
      //设置播放百分比
      if (!this.sliderChangeState){ //不能在拖动滑块时操作
        this.sliderBoxX = (this.audio.currentTime / this.audio.duration  || 0)*100
      }
      this.$bus.$emit("changeCurrentTime",this.audio.currentTime)
    },
    //切换播放模式
    switchModel(){
      this.playType < 2 ? this.playType++ : this.playType=0
    },
  },
  watch:{
    songInfo:{
      immediate:true,
      handler(value){
        this.musicUrl = ""
        if (value.picUrl===""){
          axios.get('https://api.paugram.com/netease/?id='+value.id)
            .then(response =>{
                let data = response.data;
                let url = data.cover.split("?")
                value.picUrl = url[0]
                this.picUrl = url[0]
              })
              .catch(error => {
                console.log(error)
              });
        }else {
          this.picUrl = value.picUrl.split("?")[0]
        }
        this.getSongUrl(value);
      }
    },
    playing:{
      immediate:true,
      handler(newValue){
        this.$store.commit("UpdatePlaying",newValue)
      }

    }
  },
  mounted() {
    this.audio = this.$refs.audio
    this.playInit()
  },
  beforeDestroy() {
    //销毁之前
    window.addEventListener('beforeunload',()=>{
            this.playing = false
        });
  }
}
</script>

<style scoped>
/*footer整体样式*/
.musicFooter{
  z-index: 999;
  width: 100%;
  display: flex;
}
/*音乐略缩图和歌曲名样式*/
.musicInfo{
  /*display: flex;*/
  height: 48px;
  width: 30%;
  margin-top: 13px;

}
/*歌曲名位置样式*/
.musicTitle{
  margin-left: 12px;
}
/*歌曲名基本样式 */
.musicTitleBasic{
  height: 22px;
  text-align: left;
}
/*略缩图div*/
.coverImg2{
  width: 48px;
  height: 48px;
  line-height: 48px;
  z-index: 1;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 0 50px  #333333 inset, 0 0 6px rgba(5, 5, 5, 0.08)
}
.coverImg{
  width: 48px;
  height: 48px;
  line-height: 48px;
  z-index: 1;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 0 1px #6b6969 inset, 0 0 6px rgba(5, 5, 5, 0.08)
}
.coverIcon{
  position: absolute;
  color: #333333;
  font-size: 25px;
  left: 15px;
  bottom: 13px;
  width: 48px;
  height: 48px;
  cursor: pointer;
  line-height: 48px;
}
/*播放音频模块*/
.audioBlock{
  display: block;
  width: 40%;
  height: 75px;
}
/*
播放音频按钮
*/
.audioButton{
  height: 30px;
  line-height: 60px;
}
/*播放音频按钮*/
.audioBlock button{
  border: none;
  margin-left: 9px;
  margin-right: 9px;
  padding: 5px 5px;
  color: #333333;
}
/*鼠标移入颜色*/
.audioBlock button:hover{
  color: #E94D47;
}
.audioSliderBlock{
  display: flex;
  height: 45px;
  line-height: 45px;
  justify-content:center;
}
/*播放条*/
.audioSlider{
  margin-top: 4px;
  margin-left: 14px;
  margin-right: 14px;
}
/*滑块长度*/
.progressSlider{
  width: 350px;
  /*width: 100%;*/
}

/*滑动条水平对齐*/
.audioSliderBasic{
  font-size: 8px;
  display: flex;
  text-align: center;
  vertical-align: middle;
}
/*加载中*/
/deep/ .coverImg .el-loading-spinner .path{
  stroke:#aeaeae;
}
/*加载中*/
/deep/ .coverImg .el-loading-mask{
  border-radius: 6px;
}
/*滑块背景色*/
/deep/ .el-slider__bar{
  background-color: #E94D47;
}
/*滑块按钮颜色大小*/
/deep/ .el-slider__button{
     width: 10px;
    height: 10px;
    border: 2px solid #f56c6c;
}
/*右侧功能区域*/
.rightBlock{
  /*display: flex;*/
  width: 30%;
}
/*右侧功能内容*/
.rightContentBlock{
  display: flex;
  justify-content:flex-end;
  align-items: center;
  margin-right: 50px;
  height: 75px;
  line-height: 75px;
}
/*音量模块*/
.volumeBlock{
    display: flex;
    margin-right: 20px;
    padding: 1px;
}
/*音量按钮*/
.volumeBlock button{
  background-color: white;
  color: black;
  border: 0;

}
/*图标大小*/
/deep/ .rightContentBlock .iconfont{
  font-size:20px;
}
.playListButton{
  color: black;
}
/deep/ .rightContentBlock .iconfont:hover{
  color: #E94D47;
}
.volumeSlider{
  width: 40px;
  z-index: 9999;
  background-color: white;
  position: absolute;
  bottom: 57px;
  padding-top: 15px;
  padding-bottom: 15px;
  border: 1px solid #EBEEF5;
  border-radius:4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
</style>
