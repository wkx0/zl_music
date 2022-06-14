
import axios from "../utils/axiosUtil";
import qs from "qs";

//获取歌曲列表（分页）
export function getSongList(obj) {
    return axios({
        url: '/manage/song/list',
        method: 'get',
        params: obj
    })
}

//新建歌曲
export function createSong(obj){
    return axios({
        url: '/manage/song/add',
        method: 'post',
        data: obj
    })
}

//删除歌曲
export function deleteSong(arr){
    return axios.delete('/manage/song/delete', {
        params: {
            ids: arr,
        },
        paramsSerializer: params => {
            return qs.stringify(params, { indices: false })
        }})
}

//修改歌曲
export function updateSong(obj){
    return axios({
        url: '/manage/song/update',
        method: 'post',
        data: obj
    })
}

export function addSongPlayAmount(obj) {
    return axios({
        url: '/manage/song/play/add',
        method: 'get',
        params: obj
    })
}
