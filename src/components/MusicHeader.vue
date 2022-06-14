<template>
  <el-header>
    <div class="headerLeft">
      <!-- log  -->
      <div id="musicLog">
        <img  width="30" src="../assets/images/log.svg" alt="" />
      </div>
      <!--  标题  -->
      <div id="title">
        <span >折柳音乐</span>
      </div>
      <!-- 前进后退按钮  -->
      <div id="back">
        <div>
          <el-button icon="el-icon-arrow-left" circle @click="goBack"></el-button>
          <el-button icon="el-icon-arrow-right" circle @click="forward"></el-button>
        </div>

      </div>

      <!--搜索框div-->
      <div id="searchClass" @click="searchPopover = true" @change="searchPopover = false">
        <!--弹出框-->
        <el-popover
          top="45px"
          width="200"
          type="click"
          v-model="searchPopover"
          transition="fade-in-linear"
        >
          <!--搜索框-->
          <div class="searchInput" style="height: 47px" slot="reference">
            <el-input
              type="danger"
              ref="searchInput"
              placement="bottom"
              size="mini"
              placeholder="搜索"
              v-model="searchKeyWork"
              prefix-icon="el-icon-search"
              @keydown.enter.native="searchMusic"
            >
            </el-input>
          </div>
          <!-- 这里添加推荐内容-->
          <div>
            <div>
              <span>搜索历史 </span>
              <i class="el-icon-delete" @click="delSearchHistory"></i>
            </div>
            <div style="display: flex;flex-wrap: wrap;justify-content: left;">
              <div style="margin-top: 10px;margin-right: 10px" v-for="(keyWord,index) in searchHistory" :key="index">
                <el-button round @click="clickSearchHistory(keyWord)" >{{keyWord}}</el-button>
              </div>
            </div>
          </div>

        </el-popover>
      </div>
    </div>

    <div class="headerRight">
      <div id="userInfo" style="cursor: pointer">
          <el-popover
            top="47px"
            width="200"
            trigger="manual"
            placement="bottom"
            v-model="loginPopover"
        >
          <!-- 这里添加推荐内容-->
          <div class="popoverSlot" slot="reference" @click="login">
            <div class="coverImg">
                <i class="el-icon-user" v-if="!user.loginOK"></i>
                <img v-if="user.loginOK" :src="'/zl'+user.userAvatar" width="30" height="30" style="border-radius: 30px" alt="">
            </div>
            <span v-text="user.userNickname"></span>
          </div>
          <div>
            <el-button type="text" @click="outLogin">
              <i class="el-icon-switch-button"></i> 退出登录
            </el-button>
          </div>
        </el-popover>
      </div>
    </div>

  </el-header>
</template>

<script>
export default {
  name: "MusicHeader",
  data() {
      return {
        searchKeyWork:"",
        searchPopover: false,
        loginPopover: false,

      };
    },
  computed:{
    user(){
      return this.$store.state.user
    },
    searchHistory(){
      return this.$store.state.searchHistory
    }
  },
  methods:{
    //登录
    login(){
      if (!this.user.loginOK){
        this.$bus.$emit("showLogin")
      }else {
        this.loginPopover = !this.loginPopover
      }
    },
    //退出
    outLogin(){
      this.$store.commit("CleanUser")
      this.loginPopover = !this.loginPopover
    },
    //后退
    goBack(){
      this.$router.go(-1)
    },
    //前进
    forward(){
      this.$router.go(1)
    },
    searchMusic(){
      this.searchPopover = false
      this.$store.commit("PushSearchHistory",this.searchKeyWork)
      if (this.$route.path!=="/MusicHome/SearchMusic"){
        this.$router.push({
        name:'SearchMusic',
        params:{
            keyWork:this.searchKeyWork,
        }
      })
      }else {
        this.$bus.$emit("refSearch",this.searchKeyWork)
      }
    },
    clickSearchHistory(keyWord){
      this.searchKeyWork = keyWord
      this.searchMusic()
    },
    delSearchHistory(){
      this.$store.commit("DelSearchHistory")
    }
  },
}
</script>

<style>

</style>

<style scoped>
  /*导航条样式*/
  .el-header{
    display: flex;
    padding-left: 15px;
    padding-right: 15px;
    background-color: #fd544e;
    color: #333;
    line-height: 60px;
  }
/*  !*log样式*!*/
  #musicLog{
    width: 30px;
    height: 30px;
    margin-top: 10px;
  }
  /*标题*/
  #title span{
    color: white;
    font-size: 17px;
    margin-left: 5px;
    margin-right: 65px;
  }

  /*控制返回按钮的位置*/
  #back{
    width: 72px;
    margin-left: 25px;
    display: flex;
  }
  /*前进后退按钮样式*/
  #back button{
    padding: 6px;
    background-color: #E94D47;
    border: none;
    color: brown;
  }
  /*获取焦点按钮变色*/
  #back button:hover{
  color: #ffffff;
}
  /*搜索框div*/
  #searchClass{
    width: 150px;
    margin-left: 20px;
  }
  /*搜索框 圆角 透明度*/
  .searchInput>>>.el-input__inner{
      border-radius: 12px; /*输入框圆角值*/
      background-color: #E94D47;
      color: white;
      border: 1px solid #ec4141 !important;
    }
  /*搜索图标透明度*/
  .searchInput>>>.el-input__prefix{
    color: white;
  }
.coverImg{
  height: 30px;
  width: 30px;
  color:white;
  line-height: 30px;
  border-radius: 15px;
  text-align: center;
  background-color: #d5d5d5;
}
  .headerLeft{
    width: 50%;
    display: flex;
  }
  .headerRight{
    width: 50%;
  }
  #userInfo{
    display: flex;
    height: 60px;
    margin-right: 50px;
    align-items: center;
    justify-content:flex-end;
  }
.popoverSlot{
  height: 30px;
  display: flex;
  align-items: center
}
.popoverSlot span{
  margin-left: 5px;
  font-size: 12px;
  color: white;
}
.searchInput .el-input input::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: rgba(231, 124, 121, 0.85);
  font-size: 15px;
  opacity: 0.2;
}
>>>input::-webkit-input-placeholder {
    color:white;
  opacity: 0.3;
}


</style>
