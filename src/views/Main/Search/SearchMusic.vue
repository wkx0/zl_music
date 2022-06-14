<template>
<div>
  <div class="tabBlock">
      <div
          class="tab"
          :class="{'isActivateTab':isActivateTab===tab.type}"
          v-for="(tab,index) in tabs"
          :key="index"
          @click="clickTab(tab)"
      >
        <button>{{ tab.title }}</button>
      </div>
  </div>
  <div>
       <el-table
        :data="tableData"
        v-loading="tableData.length<=0"
        ref="songTable"
        class="tableData"
        stripe
        style="width: 100%"
        @row-click="rowClick"
        @row-dblclick="rowDblclick"
        highlight-current-row
        :row-style="{height: '40px',fontSize:'13px'}"
       >
         <el-table-column
          type="index"
          width="50"
          align="right"
          class-name="indexColStyle"
         >
        </el-table-column>
        <el-table-column
          label=""
          width="30"
          align="left"
        >
          <template >
            <div class="collectIcon">
              <i class="el-icon-star-off"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="songName"
          label="标题"
          sortable
          min-width="200"
          >
        </el-table-column>
        <el-table-column
          prop="singer"
          width="240"
          sortable
          label="歌手">
        </el-table-column>
         <el-table-column
          prop="album"
          width="335"
          sortable
          label="专辑"
         show-overflow-tooltip>
        </el-table-column>
         <el-table-column
          prop="duration"
          width="70"
          sortable
          label="时间"
         class-name="timeColStyle">
        </el-table-column>
      </el-table>
        <div
            style="text-align: center;font-size: 12px;color: #c0c0c0;margin-top: 20px"
            v-loading="isLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"

        >
          <span v-if="!hasMore && tableData.length>1">暂无更多歌曲</span>
        </div>
    </div>
</div>
</template>

<script>
import axios from "axios";

export default {
  name: "SearchMusic",
  data(){
    return {
      keyWork:"",
      limit:30,
      offset:0,
      hasMore:false,
      isLoading:false,
      tabs:[
        {title:"单曲",path:"",type:1},
        // {title:"专辑",path:"",type:100},
        // {title:"歌手",path:"",type:1000},
        // {title:"歌单",path:"",type:1002}
      ],
      tableData:[],
      isActivateTab:1
    }
  },
  methods:{
    rowClick(row){
      this.$refs.songTable.setCurrentRow(row);
    },
    rowDblclick(row){
      this.$store.dispatch("pushSongToList",row)
    },
    getSearchData(type,keyWork){
      //默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
      axios.get('/api/search',{
        params: {
          keywords:keyWork,
          type:type,
          limit:this.limit,
          offset:this.offset
        }
      })
      .then(response =>{
        let data = response.data;
        console.log("搜索数据",data)
        if (data.code ===200){
          this.hasMore = data.result.hasMore
          data.result.songs.forEach((songInfo)=>{
          let songObj = {
              //歌曲 id
              id : songInfo.id,
              // url
              url:"",
              //专辑
              album: songInfo.album.name,
              //封面图片
              picUrl:  "",
              // 歌手
              singer: songInfo.artists[0].name,
              // 是否收藏
              operate: false,
              // 歌名
              songName: songInfo.name,
              //时长
              duration: this.$timeToString(songInfo.duration/1000),
          }
          this.tableData.push(songObj)
        })
        }else {
          this.hasMore = false
        }
        this.isLoading = false
      })
      .catch(error => {
        console.log(error);
        this.isLoading = false
      });
    },
    clickTab(tab){
      this.tableData =[]
      this.isActivateTab = tab.type
      this.getSearchData(tab.type,this.keyWork)
    },
    refSearch(keyWork){
      this.tableData = []
      this.offset = 0
      this.getSearchData(this.isActivateTab,keyWork)
    },
    handleScroll(e){
      let scrollHeight = e.target.scrollTop + e.target.clientHeight
      if (scrollHeight + 1 >= e.target.scrollHeight) {
        if (this.hasMore && !this.isLoading){
          this.isLoading = true
          this.offset += 30
          this.getSearchData(this.isActivateTab,this.keyWork)
          e.target.scrollTop = scrollHeight - 660
        }
      }

    }
  },
  created() {
    if (!this.$route.params.keyWork){
      this.$router.push("/")
    }else {
      this.$bus.$on("refSearch",this.refSearch)
      this.keyWork = this.$route.params.keyWork
      this.getSearchData(1,this.keyWork)
    }
  },
  activated() {
    window.addEventListener('scroll', this.handleScroll, true);
  },
  deactivated() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  mounted(){
    window.addEventListener('scroll', this.handleScroll, true);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>

<style scoped>
.tab button{
	border-style: none;
	outline: none;
  background: none repeat scroll 0 0 transparent;
  font-size: 16px;
  padding: 0;
}
.tabBlock{
  display: flex;
}
.tabBlock .tab{
  height: 60px;
  line-height: 60px;
  padding-right: 10px;
  padding-left: 10px;
}

.isActivateTab button{
  border-bottom:4px solid #fd544e;
  font-size: 19px;
  font-weight: 600;
}
</style>