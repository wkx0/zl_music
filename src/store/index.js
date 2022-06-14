import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const state = {
  //user
  user:{
    userId:"",
    userAccount: "",
    userAvatar: "",
    userNickname: "未登录",
    userPassword: "",
    userPhone: "",
    userEmail: "",
    loveSongListId:"",
    loveSongIds:[],
    loginOK:0,
  },
  //正在播放的id
  playId:0,
  //播放列表k-v
  playListKv:{},
  historyPlayList:[],
  //播放器信息
  playInfo:{
    playing:false,
    //音量
    volume:50,
    // 播放类型：0-列表循环，1-单曲循环，2-随机播放
    playType: 0,
    //播放时长
    currentTime:0,
    //播放百分比（进度条百分比）
    sliderBoxX:0,
    //是否全屏
    isFullScreen:false
  },
  searchHistory:[],
}
const mutations = {
  //添加歌曲到列表
  PushSongToList(state,value){
    Vue.set(state.playListKv,value.id,value)
    // state.playListKv[value.id] = value
  },
  //添加搜索历史
  PushSearchHistory(state,value){
    if (state.searchHistory.indexOf(value)<0){
      state.searchHistory.push(value);
    }
  },
  //添加搜索历史
  PushHistorySong(state,value){
    state.historyPlayList.push(value)
  },
    //删除搜索历史
  DelSearchHistory(state){
    state.searchHistory = [];
  },
  //更新音量
  UpdateVolume(state,value){
    state.playInfo.volume = value
  },
  //更新播放模式
  UpdatePlayType(state,value){
    state.playInfo.playType = value
  },
  //更细播放状态
  UpdatePlayId(state,value){
    if (typeof(value)!=="number")
    {
      value = parseInt(value)
    }
    state.playId = value
  },
  //更细播放状态
  UpdatePlaying(state,value){
    state.playInfo.playing = value
  },
  //从列表中删除歌曲
  DeleteSong(state,value){
    // delete state.playListKv[value]
    delete state.playListKv[value]
    // Vue.delete(state.playListKv,value)
  },
  DeleteSongs(state){
     state.playListKv ={}
    // Vue.delete(state.playListKv,value)
  },
  UpDateUser(state,value){
    state.user.userId = value.userId
    state.user.userAccount = value.userAccount
    state.user.userNickname = value.userNickname
    state.user.userAvatar = value.userAvatar
    state.user.loginOK = 1
    console.log("登陆了")
  },
  CleanUser(state){
    state.user = {
      userId:"",
      userAccount: "",
      userAvatar: "",
      userNickname: "未登录",
      userPassword: "",
      userPhone: "",
      userEmail: "",
      loveSongListId:"",
      loveSongIds:[],
      loginOK:0,
    }
  },
  UpdateLoveSongListId(state,songListId){
    state.user.loveSongListId = songListId
  },
  addLoveSongs(state,songIds){
    state.user.loveSongIds.push(songIds)
  },
  removeLoveSongs(state,songIds){
    state.user.loveSongIds.remove(songIds)
  },
  CleanHistorySong(state){
    state.historyPlayList = []
  },
  ChangeFullScreen(state){
    state.playInfo.isFullScreen = !state.playInfo.isFullScreen
  },
}
const actions = {
  //列表中删除歌曲
  deleteSong(context,data){
    let id = data.id;
    let index = data.index;
    let keys = Object.keys(state.playListKv);
    if (state.playId === id){
      //正在播放的被删除了 就播放下一首
      //如果播放列表只有一首歌
      if (keys.length === 1) {
        //没歌了
        context.commit("UpdatePlayId", 0)
      } else if (index === 0){
        context.commit("UpdatePlayId", parseInt(keys[1]))
      }else if (index +1 === keys.length){
        context.commit("UpdatePlayId", parseInt(keys[0]))
      }
    }
    //不是正在播放的id 直接删除
    context.commit("DeleteSong",id)
  },
  deleteSongs(context){
    context.commit("DeleteSongs")

    context.commit("UpdatePlayId",0)
  },
  //添加歌曲到播放列表
  pushSongToList(context,value){

    if (Object.hasOwnProperty.call(state.playListKv,value.id)){
      //如果id不是当前音乐就修改播放id
      if (context.state.playId !== value.id){
        context.commit("UpdatePlayId",value.id)
      }
    }else {
      context.commit("PushHistorySong",value)
      context.commit("UpdatePlayId",value.id)
      context.commit("PushSongToList",value)
    }
  },
  //切换下一首歌
  nextSong(context,value){
    //value id
    console.log("切割:",context)
    let keys = Object.keys(context.state.playListKv)
    let songIndex = keys.indexOf(value+"");
    console.log("songIndex",songIndex)
    //列表播放
    if(state.playInfo.playType===0 || state.playInfo.playType===1){
      if (songIndex<keys.length-1){
        songIndex++
      }else if (songIndex===keys.length-1){
        songIndex = 0
      }
    }
    else if (state.playInfo.playType === 2){
      let i = 1
      while (i===1){
        let randomNum = Math.floor(Math.random()*keys.length);
        if (randomNum!==songIndex){
          songIndex = randomNum
          i++
        }
      }
    }
    console.log("切换的歌曲",keys[songIndex])
    context.commit("UpdatePlayId",keys[songIndex])
  },
  //切换上一首歌
  upSong(context,value){
    let keys = Object.keys(context.state.playListKv)
    console.log("keys",keys)
    console.log(value)
    let songIndex = keys.indexOf(value+"");
    console.log("songIndex",songIndex)
    if(state.playInfo.playType===0 || state.playInfo.playType===1){
      if (songIndex>0){
        songIndex--
      }else if (songIndex===0){
        songIndex = keys.length-1
      }
    }
    else if (state.playInfo.playType === 2){
      let i = 1
      while (i===1){
        let randomNum = Math.floor(Math.random()*keys.length);
        if (randomNum!==songIndex){
          songIndex = randomNum
          i++
        }
      }
    }
    console.log("切换的歌曲",keys[songIndex])
    context.commit("UpdatePlayId",keys[songIndex])
  }
}
const getters = {
  volume : state => state.playInfo.volume,
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    plugins: [createPersistedState({
      storage: window.localStorage,
      reducer(state) {
            return {
                user: state.user,
                playId: state.playId,
                playListKv: state.playListKv,
                playInfo: state.playInfo,
                searchHistory:state.searchHistory,
                historyPlayList: state.historyPlayList,
            }
        }
    })],
})
