//路由规则
import Vue from 'vue'
import VueRouter from 'vue-router'
import DiscovrMusicMain from "../views/Main/DiscovrMusic/DiscovrMusicMain";
import SongListDetail from "../views/Main/DiscovrMusic/SongList/SongListDetail";
Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


export default new VueRouter({
  mode: 'hash',
    routes: [
        {
            //路径为空时跳到home
            path: '',
            redirect: '/MusicHome',
        },
        {
          path:'/MusicHome',
          name:'MusicHome',
          redirect:'/MusicHome/DiscovrMusic',
          component:() => import('@/views/MusicHome'),
          children:[
            //发现音乐
            {
              path:'/MusicHome/DiscovrMusic',
              name:'DiscovrMusic',
              redirect:"/MusicHome/DiscovrMusic/RecommendedMusic",
              component:DiscovrMusicMain,
              children:[
                  //推荐音乐
                {
                  path:'/MusicHome/DiscovrMusic/RecommendedMusic',
                  name:'RecommendedMusic',
                  component:() => import('@/views/Main/DiscovrMusic/Recommend')
                },
                    //歌单
                {
                  path:'/MusicHome/DiscovrMusic/SongList',
                  name:'SongList',
                  component:() => import('@/views/Main/DiscovrMusic/SongList/SongList')
                },
                  //歌手
                {
                  path:'/MusicHome/DiscovrMusic/Singer',
                  name:'Singer',
                  component:() => import("@/views/Main/DiscovrMusic/Singer/Singer")
                },
                  //排行榜
                {
                  path:'/MusicHome/DiscovrMusic/RankingList',
                  name:'RankingList',
                  component:() => import("@/views/Main/DiscovrMusic/RankingList/RankingList"),
                }
              ]
            },
              //歌单详情
            {
              path:'/MusicHome/SongListDetail',
              name:'SongListDetail',
              component:SongListDetail,
            },
              //歌手详情 SingerDetailInfo
            {
              path:'/MusicHome/SingerDetailInfo',
              name:'SingerDetailInfo',
              component:() => import("@/views/Main/DiscovrMusic/Singer/SingerDetailInfo"),
            },
                //搜索
            {
              path:'/MusicHome/SearchMusic',
              name:'SearchMusic',
              component:() => import("@/views/Main/Search/SearchMusic"),
            },
              //最近播放列表
            {
              path:'/MusicHome/RecentPlaySong',
              name:'RecentPlaySong',
              component:() => import("@/views/Main/RecentPlaySong/RecentPlaySong"),
            },
            //我的歌单
            {
              path:'/MusicHome/MySongList',
              name:'MySongList',
              component:() => import("@/views/Main/MySongList/MySongListDetail"),
            },


          ]
        }
    ]
})
