<template>
<div style="width: 80%">
  <div style="margin-bottom: 15px">
    <div class="typeBtnBasic" style="display: flex">
      <span>语种：</span>
      <div>
        <el-button
              round
              type="text"
              v-for="(btn,index) in languageButtons"
              :class="{'activity':index === languageActivityIndex}"
              @click="clickLgTypeBtn(index,btn.id)"
              :key="index"
        >
          {{btn.text}}
        </el-button>
      </div>
    </div>
    <div class="typeBtnBasic" style="display: flex">
      <span>分类：</span>
      <el-button
              round
              type="text"
              v-for="(btn,index) in classifyButtons"
              :class="{'activity':index === classifyActivityIndex}"
              @click="clickClTypeBtn(index,btn.id)"
              :key="index"
        >
          {{btn.text}}
        </el-button>
    </div>
    <div class="typeBtnBasic" style="display: flex">
      <div class="filterBlock">
        <span>筛选：</span>
        <el-button
              round
              type="text"
              v-for="(btn,index) in filterButtons"
              :class="{'activity':index === filterActivityIndex}"
              @click="clickFtTypeBtn(index,btn.id)"
              :key="index"
        >
          {{btn.text}}
        </el-button>
      </div>
  </div>
    <div class="singerInfo" v-loading="singerInfos.length<1">
        <div style="width: 15%;margin-bottom: 20px;cursor: pointer;"
             v-for="singer in singerInfos"
             @click="toSingerInfo(singer)"
             :key="singer.id"
        >
          <!-- 歌手图片-->
          <img :src="singer.img1v1Url+'?param=160y160'" width="160px" height="160px" alt="" style="border-radius: 6px;border:1px solid #e4e7ed;">
          <div style="display: flex">
            <!--  歌手名 -->
            <div style="width:80%;text-align: left">
              <span >{{singer.name}}</span>
            </div>
            <!-- 歌手账户-->
            <div style="width: 20%;text-align: right;color: #E94D47" v-if="singer.accountId">
              <i class="el-icon-user-solid"></i>
            </div>
          </div>
        </div>
    </div>
    <div
            style="text-align: center;font-size: 12px;color: #c0c0c0;margin-top: 20px"
            v-loading="isLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
        >
          <span v-if="!hasMore && singerInfos.length>1">暂无更多歌手</span>
        </div>
  </div>

</div>
</template>

<script>
import axios from "axios";

export default {
  name: "Singer",
  data(){
    return {
      //请求数据
      type:-1,
      area:-1,
      initial:-1,
      offset:0,
      //加载状态
      isLoading:false,
      hasMore:false,
      //语种按钮
      languageButtons:[{text:"全部",id:-1},{text:"华语",id:7},{text:"欧美",id:96},{text:"日本",id:8},{text:"韩国",id:16},{text:"其他",id:0}],
      languageActivityIndex:0,
      //分类按钮
      classifyButtons:[{text:"全部",id:-1},{text:"男歌手",id:1},{text:"女歌手",id:2},{text:"乐队组合",id:3}],
      classifyActivityIndex:0,
      //筛选按钮
      filterButtons:[{text:"热门",id:-1},{text:"A",id:"a"},{text:"B",id:"b"},{text:"C",id:"c"},{text:"D",id:"d"},{text:"E",id:"e"},{text:"F",id:"f"},{text:"G",id:"g"},{text:"H",id:"h"},{text:"I",id:"i"},{text:"J",id:"j"},{text:"K",id:"k"},{text:"L",id:"l"},{text:"M",id:"m"},{text:"N",id:"n"},{text:"O",id:"o"},{text:"P",id:"p"},{text:"Q",id:"q"},{text:"R",id:"r"},{text:"S",id:"s"},{text:"T",id:"t"},{text:"U",id:"u"},{text:"V",id:"v"},{text:"W",id:"w"},{text:"X",id:"x"},{text:"Y",id:"y"},{text:"Z",id:"z"}],
      filterActivityIndex:0,
      //原始数据
      singerInfos : [],
      //格式化后的数据
      formatSingInfo : []
    }
  },
  methods:{
    //点击语种分类
    clickLgTypeBtn(index,id){
      this.languageActivityIndex = index
      this.area = id
      this.singerInfos = []
      this.offset = 0
      this.getSingerInfo()
    },
    //点击分类按钮
    clickClTypeBtn(index,id){
      this.classifyActivityIndex = index
      this.type = id
      this.singerInfos = []
      this.offset = 0
      this.getSingerInfo()
    },
    //点击筛选按钮
    clickFtTypeBtn(index,id){
      this.filterActivityIndex = index
      this.initial = id
      this.singerInfos = []
      this.offset = 0
      this.getSingerInfo()
    },
    //点击查看歌手详情
    toSingerInfo(singer){
      this.$router.push({
        name:'SingerDetailInfo',
        params:{
            singerInfo:singer,
        }
      })
    },
    //获取歌手信息
    getSingerInfo(){
      axios.get('/api/artist/list', {
        params: {
          type: this.type,
          area: this.area,
          limit: 30,
          offset: this.offset,
          initial: this.initial
        }
      })
        .then(response =>{
          let artists = response.data.artists;
          if (response.data.code === 200){
            this.hasMore = response.data.more
            artists.forEach((artist)=>{
              let obg = {
                //id
                id : artist.id,
                //歌手名字
                name : artist.name,
                //trans 姓的意思
                trans : artist.trans,
                //歌手账户id
                accountId : artist.accountId,
                //专辑大小
                albumSize : artist.albumSize,
                //musicSize 歌曲的数量
                musicSize : artist.musicSize,
                //封面
                img1v1Url : artist.img1v1Url,
              }
              this.singerInfos.push(obg)
            })
          }
          else {
            this.hasMore = false
          }
           this.isLoading = false
          })
          .catch(error => {
            console.log(error)
            this.isLoading = false
          });
    },

    handleScroll(e){
      if (e.target.scrollTop + e.target.clientHeight + 1 >= e.target.scrollHeight) {
        if (this.hasMore && !this.isLoading){
          this.isLoading = true
          this.offset += 30
          this.getSingerInfo()
        }
      }

    }
  },
  activated() {
    window.addEventListener('scroll', this.handleScroll, true);
  },
  deactivated() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  created() {

  },
  mounted() {
    this.getSingerInfo()
    window.addEventListener('scroll', this.handleScroll, true);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>

<style scoped>
/*分类按钮的基础样式*/
.typeBtnBasic{
  font-size: 13px;
  line-height: 50px;
  align-items: center;
}
/*所有button的格式*/
.typeBtnBasic button{
  color: #333333;
}
/*所有Button被激活的样式*/
.typeBtnBasic .activity{
  color: #E94D47;
  background-color: rgba(224, 114, 110, 0.27);
}
/*过滤分类的块*/
.filterBlock{
  height:100px;
  display: flex;
  flex-wrap: wrap;
  align-items: center
}
/*歌手信息样式*/
.singerInfo{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>