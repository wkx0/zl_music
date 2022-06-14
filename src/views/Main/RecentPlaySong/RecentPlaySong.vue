<template>
  <div>
    <div class="header" style="display: flex">
      <div class="title">
        <span>最近播放</span>
      </div>
      <div style="width: 80%;text-align: right">
        <el-button type="text" @click="clickClean">清空列表</el-button>
      </div>
    </div>

    <div>
      <el-table
        :data="tableData"
        ref="songTable"
        class="tableData"
        stripe
        style="width: 100%"
        @row-click="rowClick"
        @row-dblclick="rowDblclick"
        highlight-current-row
        :row-style="{height: '40px',fontSize:'13px',cursor: 'pointer'}"
       >
         <el-table-column
          type="index"
          width="50"
          align="right"
          class-name="indexColStyle"
         >
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
    </div>
  </div>
</template>

<script>
export default {
  name: "RecentPlaySong",
  data(){
    return {
    }
  },
  computed:{
    tableData(){
      return this.$store.state.historyPlayList;
    }
  },
  methods:{
    //行单机事件
    rowClick(row){
      this.$refs.songTable.setCurrentRow(row);
    },
    //行双击事件
    rowDblclick(row){
      this.$store.dispatch("pushSongToList",row)
    },
    clickClean(){
      console.log("清空了列表")
      this.$store.commit("CleanHistorySong")
    }
  }
}
</script>

<style scoped>
.header{
  height: 60px;
  line-height: 60px;
  margin-left: 10px;
  margin-right: 10px;
}
.title{
  width: 20%;
  font-size: 19px;
  font-weight: 600;
  text-align: left;

}
</style>
