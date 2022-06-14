<template>
  <el-container style="min-width: 800px">
      <!-- 头部-->
      <MusicHeader />
      <el-container style="position: fixed;bottom: 75px;top: 60px;left: 0;right: 0">
        <el-aside width="200px">
          <!-- 侧边 -->
          <MusicAside/>
        </el-aside>
        <el-main ref="main">
            <router-view></router-view>
        </el-main>
      </el-container>
      <el-footer :class="{'footer_border':footerBorder}" height="75" style="min-width: 800px">
        <MusicFooter></MusicFooter>
      </el-footer>
      <!-- 播放列表-->
      <PlayList v-show="isShowPlayList" style="z-index:9"></PlayList>

    <transition
        appear
        name="animate__animated animate__bounce"
        enter-active-class="animate__zoomIn"
        leave-active-class="animate__zoomOut"
    >
      <Login v-if="isShowLogin" style="position: fixed;top: 80px; left: calc(50% - 175px);"></Login>
      <Register v-if="isShowRegister" style="position: fixed;top: 80px; left: calc(50% - 175px);"></Register>
    </transition>

      <transition
        appear
        name="animate__animated animate__bounce"
        enter-active-class="animate__fadeInUp"
        leave-active-class="animate__fadeOutDown"
      >
        <FullScreenPlay v-if="isFullScreen"></FullScreenPlay>
      </transition>

  </el-container>
</template>

<script>
import FullScreenPlay from "../components/FullScreen/FullScreenPlay";
import MusicHeader from "../components/MusicHeader";
import MusicAside from "../components/MusicAside";
import MusicFooter from "../components/MusicFooter";
import PlayList from "../components/Main/PlayList";
import Login from "../components/Account/Login";
import Register from "../components/Account/Register";
import 'animate.css'
export default {
  name: "MusicHome",
  data(){
    return {
      isShowPlayList:false,
      isShowLogin:false,
      isShowRegister:false,
    }
  },
  computed:{
    footerBorder(){
      return !this.isFullScreen
    },
    isFullScreen(){
      return this.$store.state.playInfo.isFullScreen
    }
  },
  components:{
    FullScreenPlay,
    MusicHeader,
    MusicAside,
    MusicFooter,
    PlayList,
    Register,
    Login
  },
  mounted() {
    //绑定显示播放列表事件
    this.$bus.$on('showPlaylist',()=>{
      this.isShowPlayList = !this.isShowPlayList
    })
    //绑定显示登录事件
    this.$bus.$on('showLogin',()=>{
      this.isShowLogin = !this.isShowLogin
    })
    //绑定显示注册事件
    this.$bus.$on('showRegister',()=>{
      this.isShowRegister = !this.isShowRegister
    })
  }
}
</script>

<style scoped>

  .el-aside {
    color: #333;
    padding-left: 15px;
    padding-right: 15px;
    border-right:1px solid #e1e1e1;
  }

  .el-main {
    width: 100%;
    color: #333;
    /*overflow: auto;*/
    text-align: center;
    padding-top: 0;
  }
.el-main::-webkit-scrollbar {/*滚动条整体样式*/
  width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
}
.el-main::-webkit-scrollbar-thumb{
  height: 5px;
  background-color: #aeaeae;
  border-radius: 3px;
}
  .el-footer {
    display: flex;
    color: #333;
    bottom: 0;
    z-index: 100;
    position: fixed;
    width: 100%;
    text-align: center;
    padding-left: 15px;
    padding-right: 15px;
    min-width: 800px;
  }
  .footer_border{
    border-top:1px solid #e1e1e1;
  }

  body > .el-container {
    margin-bottom: 40px;
  }


</style>
