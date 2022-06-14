<template>
  <div class="main">
    <div class="close">
      <i class="el-icon-close" @click="close"></i>
    </div>
    <div style="margin: 0 40px 0  40px">
      <!--  顶部背景图-->
      <div class="formTopBg">
        <img src="../../assets/images/bg2.png" height="100" alt="">
      </div>
      <!--  from表单-->
      <div style="margin-top: 30px">
        <div >
          <!-- 输入框块-->
          <div class="inputBlock">
            <div style="margin: 0 10px 0 10px">
              <!-- 输入框1-->
              <div class="inputDivBasic" style=";border-bottom:1px solid #aeaeae ">
                <div class="inputIcon">
                  <i class="el-icon-mobile"></i>
                </div>
                <input type="text" placeholder="请输入账号" v-model="userName">
              </div>
              <!-- 输入框2-->
              <div class="inputDivBasic">
                <div class="inputIcon">
                  <i class="el-icon-lock"></i>
                </div>
                <input type="password" v-model="password" placeholder="请输入密码">
                <el-button  type="text">重设密码</el-button>
              </div>
            </div>
          </div>
          <div class="autoLogin-msg" style="display:flex;height: 30px;line-height: 30px">
            <label class="autoLogin">
              <input  id="checkbox" type="checkbox" name="demo-checkbox1" v-model="autoLogin">
              <span>自动登录</span>
            </label>
            <div class="registerMsg">
              {{msg}}
            </div>
          </div>
          <button style="width: 100%;background-color: #E94D47;border-radius: 6px;height: 35px;border:0;color: white"
                  @click="logBtn"
          >
            登录
          </button>
        </div>
        <div class="goBtn">
          <el-button type="text" @click.prevent="showRegister">注册</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {verifyUser} from "../../api/user";
export default {
  name: "Login",
  data(){
    return {
      userName:"",
      password:"",
      autoLogin:false,
      msg:""
    }
  },
  computed:{
  },
  methods:{
    close(){
        this.$bus.$emit('showLogin')
    },
    showRegister(){
      this.$bus.$emit('showLogin')
      this.$bus.$emit("showRegister")
    },
    logBtn(){
      this.msg = ""
      if (this.userName.length === 0 || this.password.length === 0 ){
        this.msg = "用户名或密码不能为空"
      }else if (
          this.userName.length < 6 || this.password.length < 6 ){
        this.msg = "用户名或密码不能小于6位"
      }else if(this.userName.length > 16 || this.password.length > 16){
        this.msg = "用户名或密码不能大于16位"
      }else {
        let user = {
          userAccount: this.userName,
          userAvatar: "",
          userNickname: "",
          userPassword: this.password,
          userPhone: "",
          userEmail: "",
        }
        verifyUser(user).then((res)=>{
          if (res.data.code === 1){
            this.msg = "用户名或密码错误"
          }else {
            let loginUser = res.data.data
            console.log("loginUser",loginUser)
            this.$store.commit("UpDateUser",loginUser)
            this.close()
          }
        }).catch((error)=>{
          console.log(error)
        })
      }
    },
  },
}
</script>

<style scoped>
/*整体背景*/
.main{
  width: 350px;
  height: 530px;
  background-color: white;
  border-radius:6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
/*关闭icon*/
.close{
  text-align: right;
  color: #aeaeae;
  margin: 7px 10px 0 10px
}
.close i:hover{
  color: #E94D47;
}
/*表单顶部背景图片*/
.formTopBg{
  height: 100px;
  margin-top: 40px;
  text-align: center
}
.inputBlock{
  border-radius:6px;
  border:1px solid rgba(174,174,174,0.68);
}
.inputDivBasic{
  display: flex;
  height: 40px;
  line-height: 40px
}
.inputIcon{
  margin-right: 10px
}
.inputDivBasic input{
  background:none;
  outline:none;
  border:0;
}
.inputDivBasic button{
  color: #aeaeae;
}
#checkbox{
  vertical-align:middle;
  margin:auto;
}
.goBtn{
  margin-top: 10px;
  text-align: center
}
.goBtn button{
  color: #aeaeae
}
.goBtn button:hover{
  color: #707070;
}
::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: #a8aaa7;
  font-size: 10px;
}
::-moz-placeholder { /* Firefox 19+ */
  color: #a8aaa7;
  font-size: 10px;
}
:-ms-input-placeholder { /* IE 10+ */
  color: #a8aaa7;
  font-size: 10px;
}
:-moz-placeholder { /* Firefox 18- */
  color: #a8aaa7;
  font-size: 10px;
}
/*自动登录和msg*/
.autoLogin-msg{
  display: flex;
}
.autoLogin{
  width: 30%;

}
.autoLogin span{
  font-size: 12px;
  margin-left: 5px;
  color: #7c7c7c
}
.registerMsg{
  width: 70%;
  text-align: right;
  color: #EA9E48;
  font-size: 12px;
}
</style>
