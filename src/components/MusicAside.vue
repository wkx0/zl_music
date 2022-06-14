<template>
  <div>
    <DiscovrMusic class="asideBlock"></DiscovrMusic>
    <MyMusic v-if="loginOk" class="asideBlock"></MyMusic>
    <MyMusicList v-if="loginOk" class="asideBlock"></MyMusicList>
  </div>
</template>

<script>
import DiscovrMusic from "./Aside/DiscovrMusic";
import MyMusic from "./Aside/MyMusic";
import MyMusicList from "./Aside/MyMusicList";
export default {
  name: "MusicAside",
  components:{
    DiscovrMusic,
    MyMusic,
    MyMusicList
  },computed:{
    loginOk(){
      return this.$store.state.user.loginOK
    }
  },methods:{
  }
}
</script>

<style scoped>
.asideBlock{
    /*margin-bottom: 10px;*/
}
</style>
