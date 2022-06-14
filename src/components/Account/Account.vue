<template>
<div>
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
              <div class="inputDivBasic" :style="style">
                <div class="inputIcon">
                  <i class="el-icon-lock"></i>
                </div>
                <input type="password" v-model="password" :placeholder="text">
                <el-button v-if="formType===0" type="text">重设密码</el-button>
              </div>
              <!-- 输入框3-->
              <div class="inputDivBasic" v-if="formType===1">
                <div class="inputIcon">
                  <i class="el-icon-lock"></i>
                </div>
                <input type="password" v-model="password" placeholder="确认密码">
                <el-button v-if="formType===0" type="text">忘记密码</el-button>
              </div>
            </div>
          </div>
          <div style="height: 30px;line-height: 30px">
            <label v-if="formType===0">
              <input  id="checkbox" type="checkbox" name="demo-checkbox1">
              <span style="font-size: 12px;margin-left: 5px;color: #7c7c7c">自动登录</span>
            </label>
            <div>
              {{msg}}
            </div>
          </div>
          <button style="width: 100%;background-color: #E94D47;border-radius: 6px;height: 35px;border:0;color: white"
                  @click="logBtn"
          >
            {{formType===0 ? '登录' : '注册'}}
          </button>
        </div>
        <div class="goBtn" v-if="formType === 0">
          <el-button type="text" @click.prevent="showRegister">注册</el-button>
        </div>
      </div>
  </div>
</div>
</template>

<script>
export default {
  name: "Account",
  props:["formType","clickMethod"],
  data(){
    return {
      userName:"",
      password:"",
      msg:""
    }
  },
  computed:{
    text(){
      return this.formType ? "请设置密码" : "清输入密码"
    },
    style(){
      return this.formType ? 'border-bottom:1px solid #aeaeae ' : ''
    }
  },methods:{
    close(){
      if (this.formType===0){
        this.$bus.$emit('showLogin')
      }else {
        this.$bus.$emit('showRegister')
      }
    },
    showRegister(){
      this.$bus.$emit('showLogin')
      this.$bus.$emit("showRegister")
    },
    logBtn(){
      console.log(this.userName)
      console.log(this.password)
        if (this.userName!=="" && this.password !== ""){
          this.clickMethod(this.userName,this.password)
        }else {
          this.msg = "用户名或密码为空"
        }
      }
    },
}
</script>

<style scoped>
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
</style>
