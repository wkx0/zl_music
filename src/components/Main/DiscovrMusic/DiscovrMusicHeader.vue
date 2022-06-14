<template>
  <div class="discovrMusicHeader">
      <div
          class="item"
          :class="{'isActivate':$route.path===item.path}"
          v-for="(item,index) in items"
          :key="index"
          @click="clickItem(item.path)"
      >
        <button>{{ item.title }}</button>
       </div>
  </div>
</template>

<script>
export default {
  name: "DiscovrMusicHeader",
  data(){
    return {
      items:[
          {
            title:'个性推荐',
            path:'/MusicHome/DiscovrMusic/RecommendedMusic'
          },
          {
            title:'歌单',
            path:'/MusicHome/DiscovrMusic/SongList'

          },{
            title:'排行榜',
            path:'/MusicHome/DiscovrMusic/RankingList'
          },
          {
            title:'歌手',
            path:'/MusicHome/DiscovrMusic/Singer'
          }
        ],
      activeIndex:0,
    }
  },
  methods:{
    clickItem(path){
        this.$router.push(path)
    }
  }
}
</script>

<style scoped>

button {
  cursor: pointer;
	border-style: none;
	outline: none;
  background: none repeat scroll 0 0 transparent;
  font-size: 16px;
  padding: 0;
}
.discovrMusicHeader{
  display: flex;
}
.discovrMusicHeader .item{
  height: 60px;
  line-height: 60px;
  padding-right: 10px;
  padding-left: 10px;
}

.isActivate button{
  border-bottom:4px solid #fd544e;
  font-size: 19px;
  font-weight: 600;
}
button:after {
  border: none;
}
</style>